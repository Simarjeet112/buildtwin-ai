const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  title: String,

  language: String,

  code: String,

  description: String

},{timestamps:true});

module.exports = mongoose.model("Snippet",snippetSchema);