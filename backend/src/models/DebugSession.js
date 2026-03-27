const mongoose = require("mongoose");

const debugSessionSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: false  // ✅ made optional so debug works without a project
  },

  language: String,

  code: String,

  errorMessage: String,

  aiAnalysis: {
    errorType: String,
    rootCause: String,
    explanation: String,
    fix: String,
    correctedCode: String,
    bestPractice: String
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("DebugSession", debugSessionSchema);