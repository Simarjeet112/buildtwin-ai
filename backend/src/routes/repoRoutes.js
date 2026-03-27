
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const { analyzeRepo, chatAboutRepo } = require("../controllers/repoController")
 
router.post("/analyze", authMiddleware, analyzeRepo)
router.post("/chat", authMiddleware, chatAboutRepo)
 
module.exports = router
 