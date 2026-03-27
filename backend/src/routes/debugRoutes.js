const express = require("express");
const router = express.Router();

const debugController = require("../controllers/debugController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, debugController.createDebugSession);

router.get("/", authMiddleware, debugController.getDebugSessions);

router.get("/:id", authMiddleware, debugController.getDebugSessionById);

router.delete("/:id", authMiddleware, debugController.deleteDebugSession);

module.exports = router;