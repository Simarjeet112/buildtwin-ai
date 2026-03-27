const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String },
  type: { type: String, enum: ["youtube", "article", "docs", "practice"], default: "article" },
  description: { type: String },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 }
    }
  ]
}, { timestamps: true });

// Virtual for average rating
tutorialSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

tutorialSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Tutorial", tutorialSchema);