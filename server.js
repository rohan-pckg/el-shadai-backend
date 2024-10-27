const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
require("dotenv").config();

const app = express();

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(csrfProtection); // CSRF protection should come after cookie-parser

// Import routes
const doctorsRoute = require("./routes/doctors");
const appointmentRoute = require("./routes/appointments");
const contactRoute = require("./routes/contacts");
const ambookingRoute = require("./routes/ambookings");
const loginRoute = require("./routes/login");
const newsletterRoute = require("./routes/newsletters");

// Routes
app.use("/api", doctorsRoute);
app.use("/api", appointmentRoute);
app.use("/api", contactRoute);
app.use("/api", ambookingRoute);
app.use("/api", loginRoute);
app.use("/api", newsletterRoute);

// Get CSRF Token
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() }); // Send the CSRF token to the client
});

// MongoDB Connection
const dbURL = process.env.DB_URL; // Use environment variable for MongoDB URI

mongoose
  .connect(dbURL) // Removed deprecated options
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Error handling for CSRF
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next(err);
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Welcome Message
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API! Use /api/doctors to fetch doctors.");
});
