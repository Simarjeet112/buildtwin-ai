const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function() { return this.provider === "local" }
  },
  provider: { type: String, enum: ["local", "google"], default: "local" },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)