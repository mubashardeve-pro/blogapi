const { where } = require("sequelize");
const { authers } = require("../db/models");
const { AppError } = require("../utils/errorController");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { cookieOptions } = require("../utils/cookieOptions")

const signup = async (req, res) => {

    const { name, email, password } = req.body;

    if (!password) {
        throw AppError("Password id Ruquired", 400)
    }

    const hash = await bcrypt.hash(password, 10);
    // console.log(hash)
    const auther = await authers.create({ name, email, password: hash })
    // console.log(auther)

    const token = jwt.sign({ id: auther.id }, process.env.JWT_SECRET)
    res.cookie("token", token, cookieOptions)

    const { password: _password, ...safeAuthor } = auther.toJSON()

    res.status(201).json({ ...safeAuthor, token })



}
const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!password) {
        throw AppError("Password is Required", 400)
    }

    const auther = await authers.findOne({ where: { email: email } })

    if (!auther) {
        throw AppError("Invalid Email or Password", 401)
    }

    const isValidPassowrd = bcrypt.compareSync(password, auther.password);

    if (!isValidPassowrd) {
        throw AppError("Invalid user or Password", 401)
    }
    const token = jwt.sign({ id: auther.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie("token", token, cookieOptions)

    res.json({
        success: true,
        message: "Login SuccessFully",
        token,
    })

}

const profile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.author,
        message: "Profile fetched SuccessFully"
    })
}

const logout = (req, res) => {
    res.clearCookie("token", cookieOptions);

    res.status(200).json({
        success: true,
        message: "Logout Successfully"
    });
};

const getAuthers = async (req, res) => {
    const data = await authers.findAll()
    res.json(data)
}

const updateProfile = async (req, res) => {
    const { name } = req.body;

    const author = await authers.findByPk(req.author.id);
    author.name = name;
    await author.save();


    res.json({
        success: true,
        data: author,
        message: "Profile updated Successfully"
    });
}



module.exports = { signup, getAuthers, signin, profile, logout, updateProfile }