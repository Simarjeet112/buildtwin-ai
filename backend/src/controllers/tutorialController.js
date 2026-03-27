const Tutorial = require("../models/Tutorial");
const { recommendTutorial } = require("../services/llmService");

/*
GET OR GENERATE TUTORIALS FOR A TOPIC
*/
exports.getTutorials = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) return res.status(400).json({ message: "Topic is required" });

    // Check if tutorials for this topic already exist in DB
    const existing = await Tutorial.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") }
    });

    if (existing.length > 0) {
      return res.json({ tutorials: existing });
    }

    // Generate new tutorials via AI
    const aiResult = await recommendTutorial(topic, "beginner", "learn the concept");

    // Parse AI response into structured tutorials
    const lines = aiResult.split("\n").filter(l => l.trim());
    const types = ["youtube", "article", "docs", "practice", "article"];
    const tutorials = [];

    let currentType = 0;
    let currentTitle = "";
    let currentDesc = [];

    for (const line of lines) {
      if (/^\d\./.test(line)) {
        if (currentTitle) {
          tutorials.push({
            topic,
            title: currentTitle,
            type: types[currentType - 1] || "article",
            description: currentDesc.join(" ").trim()
          });
          currentDesc = [];
        }
        currentType++;
        currentTitle = line.replace(/^\d\.\s*/, "").trim();
      } else if (currentTitle) {
        currentDesc.push(line.trim());
      }
    }

    if (currentTitle) {
      tutorials.push({
        topic,
        title: currentTitle,
        type: types[currentType - 1] || "article",
        description: currentDesc.join(" ").trim()
      });
    }

    // If parsing failed, create a single tutorial with full AI response
    const toSave = tutorials.length > 0 ? tutorials : [{
      topic,
      title: `AI Recommended Resources: ${topic}`,
      type: "article",
      description: aiResult
    }];

    const saved = await Tutorial.insertMany(toSave);

    res.json({ tutorials: saved });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get tutorials" });
  }
};

/*
RATE A TUTORIAL
*/
exports.rateTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    // Update existing rating or add new one
    const existingIndex = tutorial.ratings.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingIndex > -1) {
      tutorial.ratings[existingIndex].rating = rating;
    } else {
      tutorial.ratings.push({ userId, rating });
    }

    await tutorial.save();

    res.json({ message: "Rating saved", tutorial });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to rate tutorial" });
  }
};