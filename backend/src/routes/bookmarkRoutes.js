const express = require("express");
const router = express.Router();

const bookmarkController = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, bookmarkController.createBookmark);

router.get("/", authMiddleware, bookmarkController.getBookmarks);

router.delete("/:id", authMiddleware, bookmarkController.deleteBookmark);

module.exports = router;