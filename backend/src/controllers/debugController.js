const DebugSession = require("../models/DebugSession");

exports.createDebugSession = async (req, res) => {
  try {

    const { projectId, language, code, errorMessage } = req.body;

    const session = await DebugSession.create({
      userId: req.user.userId,
      projectId,
      language,
      code,
      errorMessage
    });

    res.status(201).json({
      message: "Debug session created",
      session
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to create debug session",
      error: error.message
    });

  }
};


exports.getDebugSessions = async (req, res) => {
  try {

    const sessions = await DebugSession.find({
      userId: req.user.userId
    });

    res.json(sessions);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch debug sessions"
    });

  }
};


exports.getDebugSessionById = async (req, res) => {
  try {

    const session = await DebugSession.findById(req.params.id);

    res.json(session);

  } catch (error) {

    res.status(500).json({
      message: "Debug session not found"
    });

  }
};


exports.deleteDebugSession = async (req, res) => {
  try {

    await DebugSession.findByIdAndDelete(req.params.id);

    res.json({
      message: "Debug session deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete failed"
    });

  }
};
exports.getProjectDebugHistory = async (req, res) => {

    try {
  
      const { projectId } = req.params;
  
      const sessions = await DebugSession.find({ projectId })
        .sort({ createdAt: -1 });
  
      res.json({
        sessions
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Failed to fetch debug history"
      });
  
    }
  
  };