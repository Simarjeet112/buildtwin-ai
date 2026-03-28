const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

/*
SIGNUP - sends OTP, does not log in yet
*/
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser && existingUser.isVerified) {
    return res.status(400).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const otp = generateOTP()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

  if (existingUser && !existingUser.isVerified) {
    existingUser.name = name
    existingUser.password = hashedPassword
    existingUser.otp = otp
    existingUser.otpExpiry = otpExpiry
    await existingUser.save()
  } else {
    await User.create({ name, email, password: hashedPassword, otp, otpExpiry, isVerified: false })
  }

  // TODO: send OTP via email
  console.log(`OTP for ${email}: ${otp}`)

  res.status(201).json({ message: "OTP sent to your email", email })
})

/*
VERIFY OTP - verifies and logs in
*/
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: "User not found" })

  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" })
  if (user.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired. Please sign up again." })

  user.isVerified = true
  user.otp = undefined
  user.otpExpiry = undefined
  await user.save()

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  res.json({ message: "Email verified!", token, user: { name: user.name, email: user.email } })
})

/*
RESEND OTP
*/
exports.resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: "User not found" })

  const otp = generateOTP()
  user.otp = otp
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await user.save()

  console.log(`OTP for ${email}: ${otp}`)
  res.json({ message: "OTP resent" })
})

/*
LOGIN
*/
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({ message: "Login successful", token, user })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}