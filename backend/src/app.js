const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const passport = require("./config/passport");
const session = require("express-session");
const morgan = require("morgan");

const app = express();

/* GLOBAL MIDDLEWARE */

app.use(cors());
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
    service: "BuildTwin AI Backend",
  });
});

/* ROUTES */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

const errorHandler = require("./middleware/errorHandler");

app.use(errorHandler);

const validate = require("../middleware/validate");
const { signupSchema } = require("../validations/authValidation");

module.exports = app;