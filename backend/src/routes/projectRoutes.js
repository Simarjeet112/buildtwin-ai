const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, projectController.createProject);

router.get("/", authMiddleware, projectController.getProjects);

router.get("/:id", authMiddleware, projectController.getProjectById);

router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;