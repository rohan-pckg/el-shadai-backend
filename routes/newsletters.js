const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Newsletter = require('../models/newsletter');

// Post newsletter subscription
router.post('/newsletter', 
  body('email').isEmail().withMessage('Please enter a valid email'), 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const newEmail = new Newsletter({ email });
      await newEmail.save();
      return res.status(200).json({ message: 'Email added successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Error adding email.' });
    }
});

// Get all newsletter subscribers
router.get('/newsletter', async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    return res.status(200).json(subscribers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching subscribers.' });
  }
});

// Delete a subscriber
router.delete('/newsletter/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Subscriber deleted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting subscriber.' });
  }
});

module.exports = router;
