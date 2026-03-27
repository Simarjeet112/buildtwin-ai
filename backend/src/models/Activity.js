const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      required: true
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId
    },

    itemType: {
      type: String,
      enum: ["project", "snippet", "debug", "file", "bookmark", "tag"]
    },

    metadata: {
      type: Object
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Activity", activitySchema);