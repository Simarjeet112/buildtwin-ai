const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    filepath: {
      type: String,
      required: true
    },

    filetype: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("File", fileSchema);