const Project = require("../models/Project");
const Snippet = require("../models/Snippet");
const DebugSession = require("../models/DebugSession");

exports.search = async (req, res) => {
  try {

    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        message: "Search query missing"
      });
    }

    const projects = await Project.find({
      name: { $regex: query, $options: "i" }
    });

    const snippets = await Snippet.find({
      title: { $regex: query, $options: "i" }
    });

    const debugSessions = await DebugSession.find({
      errorMessage: { $regex: query, $options: "i" }
    });

    res.json({
      projects,
      snippets,
      debugSessions
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Search failed"
    });

  }
};