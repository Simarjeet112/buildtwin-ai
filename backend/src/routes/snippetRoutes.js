const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, snippetController.createSnippet);

router.get("/", authMiddleware, snippetController.getSnippets);

router.get("/:id", authMiddleware, snippetController.getSnippetById);

router.delete("/:id", authMiddleware, snippetController.deleteSnippet);

module.exports = router;