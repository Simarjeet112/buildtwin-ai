const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const validate = require("../validations/validate")
const { signupSchema } = require("../validations/authValidation")

router.post("/signup", validate(signupSchema), authController.signup)
router.post("/verify-otp", authController.verifyOTP)
router.post("/resend-otp", authController.resendOTP)
router.post("/login", authController.login)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`)
  }
)

module.exports = router