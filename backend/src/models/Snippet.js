const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    language: {
      type: String,
      required: true
    },

    code: {
      type: String,
      required: true
    },

    description: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Snippet", snippetSchema);