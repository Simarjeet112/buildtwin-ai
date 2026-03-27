const express = require("express");
const router = express.Router();
const tutorialController = require("../controllers/tutorialController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, tutorialController.getTutorials);
router.post("/:id/rate", authMiddleware, tutorialController.rateTutorial);

module.exports = router;
