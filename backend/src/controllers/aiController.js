const {
    analyzeDebug,
    fixBug,
    explainCodeAI,
    generateLearning,
    recommendTutorial
  } = require("../services/llmService");
const DebugSession = require("../models/DebugSession");

/*
AI DEBUG ANALYSIS
*/
exports.debugAssistant = async (req, res) => {
  try {

    const { projectId, language, code, errorMessage } = req.body;

    const aiResponse = await analyzeDebug(language, code, errorMessage);

    const session = await DebugSession.create({
      userId: req.user.id,
      projectId,
      language,
      code,
      errorMessage,
      aiAnalysis: {
        explanation: aiResponse
      }
    });

    res.json({
      message: "AI debug session created",
      session
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "AI analysis failed"
    });

  }
};

/*
AI FIX CODE
*/
exports.fixCode = async (req, res) => {

  try {

    const { language, code, errorMessage } = req.body;

    const fixed = await fixBug(language, code, errorMessage);

    res.json({
      result: fixed
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "AI fix failed"
    });

  }

};
exports.explainCode = async (req, res) => {

    try {
  
      const { code } = req.body;
  
      const result = await explainCodeAI(code);
  
      res.json({
        explanation: result
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Code explanation failed"
      });
  
    }
  
  };

/*
GET DEBUG HISTORY
*/
exports.getProjectDebugHistory = async (req, res) => {

  try {

    const { projectId } = req.params;

    const sessions = await DebugSession
      .find({ projectId })
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

exports.learnConcept = async (req, res) => {

    try {
  
      const { topic, level, goal } = req.body;
  
      const result = await generateLearning(topic, level, goal);
  
      res.json({
        learning: result
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Learning generation failed"
      });
  
    }
  
  };

  exports.getTutorials = async (req, res) => {

    try {
  
      const { topic, level, goal } = req.body;
  
      const tutorials = await recommendTutorial(topic, level, goal);
  
      res.json({
        tutorials
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        message: "Tutorial recommendation failed"
      });
  
    }
  
  };