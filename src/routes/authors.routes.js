const { signup, getAuthers, signin, profile, logout, updateProfile } = require("../controllers/authors.controllers")

const router = require("express").Router()


router.post("/signup", signup)
router.post("/signin", signin)
router.put("/update-profile", updateProfile)
router.get("/profile", profile)
router.post("/logout", logout)
router.get("/", getAuthers)





module.exports = router