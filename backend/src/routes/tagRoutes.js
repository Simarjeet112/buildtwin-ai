const express = require("express");
const router = express.Router();

const tagController = require("../controllers/tagController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, tagController.createTag);

router.get("/", authMiddleware, tagController.getTags);

router.delete("/:id", authMiddleware, tagController.deleteTag);

module.exports = router;