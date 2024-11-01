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
    origin: "https://www.elshadaiug.com",
    credentials: true, // Allow credentials like cookies to be sent
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
  }),
);

app.use(morgan("combined")); // Logging
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// Configure CSRF Protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "None", // Allows cross-site cookies
    path: "/", // Ensure the CSRF cookie is accessible site-wide
  },
});

// Import routes
const doctorsRoute = require("./routes/doctors");
const appointmentRoute = require("./routes/appointments");
const contactRoute = require("./routes/contacts");
const ambookingRoute = require("./routes/ambookings");
const loginRoute = require("./routes/login");
const newsletterRoute = require("./routes/newsletters");

// Routes without CSRF Protection
app.use("/api", doctorsRoute);
app.use("/api", appointmentRoute);
app.use("/api", contactRoute);
app.use("/api", ambookingRoute);
app.use("/api", newsletterRoute);

// Apply CSRF Protection to Sensitive Routes
app.use("/api", csrfProtection, loginRoute);

// Route to Get CSRF Token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  console.log("CSRF token requested"); // Log request
  res.json({ csrfToken: req.csrfToken() });
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

// Error Handling
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  console.error("Server error:", err); // Log error for debugging
  res.status(500).json({ error: "Internal Server Error" });
});

// Server Start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Welcome Route
app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API! Use /api/doctors to fetch doctors.");
});
