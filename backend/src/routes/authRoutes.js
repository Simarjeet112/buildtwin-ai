const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post(
    "/signup",
    validate(signupSchema),
    authController.signup
  );
router.post("/login", authController.login);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({
        message: "Google login successful",
        token,
        user: req.user
      });
    }
  );

module.exports = router;