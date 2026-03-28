const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

/*
SIGNUP - no OTP, direct login
*/
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true
  })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  res.status(201).json({ message: "User registered", token, user })
})

/*
VERIFY OTP - kept for compatibility
*/
exports.verifyOTP = asyncHandler(async (req, res) => {
  res.json({ message: "Verification not required" })
})

/*
RESEND OTP - kept for compatibility
*/
exports.resendOTP = asyncHandler(async (req, res) => {
  res.json({ message: "OTP not required" })
})

/*
LOGIN
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({ message: "Login successful", token, user })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}