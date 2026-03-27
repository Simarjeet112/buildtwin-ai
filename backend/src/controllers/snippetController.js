const Snippet = require("../models/Snippet");

exports.createSnippet = async (req, res) => {
  try {
    const { title, language, code, description } = req.body;

    const snippet = await Snippet.create({
      userId: req.user.id,  // ✅ fixed
      title,
      language,
      code,
      description
    });

    res.status(201).json({ message: "Snippet created", snippet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create snippet" });
  }
};

exports.getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.user.id });  // ✅ fixed
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch snippets" });
  }
};

exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: "Snippet not found" });
  }
};

exports.deleteSnippet = async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.json({ message: "Snippet deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};