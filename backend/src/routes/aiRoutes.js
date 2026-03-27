const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    debugAssistant,
    fixCode,
    explainCode,
    getProjectDebugHistory,
    learnConcept,
    getTutorials
  } = require("../controllers/aiController");
router.post("/debug", authMiddleware, debugAssistant);

router.post("/fix", authMiddleware, fixCode);

router.post("/explain", authMiddleware, explainCode);

router.get("/project/:projectId", authMiddleware, getProjectDebugHistory);

router.post("/learn", authMiddleware, learnConcept);

router.post("/tutorials", authMiddleware, getTutorials);

module.exports = router;