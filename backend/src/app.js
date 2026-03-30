const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const rateLimit = require("express-rate-limit");

const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const debugRoutes = require("./routes/debugRoutes");
const snippetRoutes = require("./routes/snippetRoutes");
const fileRoutes = require("./routes/fileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const tagRoutes = require("./routes/tagRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const activityRoutes = require("./routes/activityRoutes");
const aiRoutes = require("./routes/aiRoutes");
const repoRoutes = require("./routes/repoRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

/* RATE LIMITING */

// General API limit - 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." }
})

// Auth limit - 10 requests per 15 minutes per IP (prevents fake account spam)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many auth attempts, please try again after 15 minutes." }
})

// AI limit - 20 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many AI requests, please slow down." }
})

/* GLOBAL MIDDLEWARE */

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost',
    'https://buildtwin-ai-1.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* SESSION */

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

/* PASSPORT */

app.use(passport.initialize());
app.use(passport.session());

/* HEALTH CHECK */

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "BuildTwin AI Backend"
  });
});

/* API ROUTES */

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", generalLimiter, userRoutes);
app.use("/api/v1/projects", generalLimiter, projectRoutes);
app.use("/api/v1/debug", generalLimiter, debugRoutes);
app.use("/api/v1/snippets", generalLimiter, snippetRoutes);
app.use("/api/v1/files", generalLimiter, fileRoutes);
app.use("/api/v1/search", generalLimiter, searchRoutes);
app.use("/api/v1/tags", generalLimiter, tagRoutes);
app.use("/api/v1/bookmarks", generalLimiter, bookmarkRoutes);
app.use("/api/v1/activity", generalLimiter, activityRoutes);
app.use("/api/v1/ai", aiLimiter, aiRoutes);
app.use("/api/v1/repo", aiLimiter, repoRoutes);
app.use("/api/v1/tutorials", generalLimiter, tutorialRoutes);

/* GLOBAL ERROR HANDLER */

app.use(errorHandler);

module.exports = app;