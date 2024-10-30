const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const csrfProtection = require("csurf")({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "None", // Allow cross-site cookies
    path: "/", // Ensure the CSRF cookie is accessible site-wide
  },
});

const JWT_SECRET = process.env.JWT_SECRET;
const password = process.env.password;
const username = process.env.username;

// Mock user for testing; replace this with your database logic
const mockUser = {
  id: 1,
  username: username,
  passwordHash: bcrypt.hashSync(password, 10), // Hash the password for testing
};

// CSRF token route
router.get("/csrf-token", csrfProtection, (req, res) => {
  console.log("CSRF token requested"); // Log request for CSRF token
  res.json({ csrfToken: req.csrfToken() });
});

// Login route
router.post("/login", csrfProtection, async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username matches and the password is correct
  if (username !== mockUser.username || !bcrypt.compareSync(password, mockUser.passwordHash)) {
    console.warn("Login attempt failed: Invalid credentials for username:", username);
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set the token as an HttpOnly cookie with proper attributes
  res.cookie("token", token, {
    httpOnly: true, // XSS protection
    secure: process.env.NODE_ENV === "production", // HTTPS for production
    sameSite: "None", // Needed for cross-origin requests
    path: "/", // Adjust path as required
    maxAge: 24 * 60 * 60 * 1000, // Optional expiration
  });

  console.log("Login successful for user:", username); // Log successful login
  return res.status(200).json({ message: "Login successful" });
});

module.exports = router;
