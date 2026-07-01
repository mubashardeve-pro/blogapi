const { AppError } = require("../utils/errorController")
const jwt = require("jsonwebtoken")
const { authers } = require("../db/models")

const publicRoutes = [
    "/authors/signup",
    "/authors/signin",
    "/blogs/public",
]



const authMiddleware = async (req, res, next) => {
    const path = req.url.split("?")[0]

    if (publicRoutes.some((route) => path.startsWith(route))) {
        return next()
    }

    const authHeader = req.headers.authorization
    const token =
        req.cookies.token ||
        (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null)



    if (!token) {
        throw AppError("Are You New Please Create Your Account", 401)
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const author = await authers.findByPk(payload.id, {
        attributes: ["id", "name", "email"]
    })

    if (!author) {
        throw AppError("User not found", 401)
    }

    req.author = author
    next()
}

module.exports = authMiddleware