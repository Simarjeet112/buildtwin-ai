const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");

const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const debugRoutes = require("./routes/debugRoutes"); // ✅ add this
const snippetRoutes = require("./routes/snippetRoutes");
const fileRoutes = require("./routes/fileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const tagRoutes = require("./routes/tagRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const activityRoutes = require("./routes/activityRoutes");

const errorHandler = require("./middleware/errorHandler");

const aiRoutes = require("./routes/aiRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const repoRoutes = require("./routes/repoRoutes")

const app = express();

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/debug", debugRoutes); // ✅ register here
app.use("/api/v1/snippets", snippetRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/tutorials", tutorialRoutes);
app.use("/api/v1/repo", repoRoutes)
/* GLOBAL ERROR HANDLER */

app.use(errorHandler);

module.exports = app;