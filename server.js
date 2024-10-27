const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials like cookies to be sent
  }),
);

app.use(morgan("combined")); // Logging
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

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
const dbURL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  }
};

connectDB();

// Error handling for CSRF and other errors
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  console.error(err); // Log error for debugging
  res.status(500).json({ error: "Internal Server Error" });
});

// Server Start
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Welcome Message
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API! Use /api/doctors to fetch doctors.");
});
