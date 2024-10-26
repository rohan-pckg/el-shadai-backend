const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Mock user for testing; replace this with your database logic
const mockUser = {
  id: 1,
  username: 'admin',
  passwordHash: bcrypt.hashSync('password', 10), // Hash the password for testing
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username matches and the password is correct
  if (username !== mockUser.username || !bcrypt.compareSync(password, mockUser.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: '1h' });

  // Set the token as an HttpOnly cookie
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

  return res.status(200).json({ message: 'Login successful' });
});

module.exports = router;
