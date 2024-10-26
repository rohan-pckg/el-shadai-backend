const express = require('express');
const router = express.Router();
const Newsletter = require('../models/newsletter');

// POST route to add a new email to the newsletter
router.post('/newsletter', async (req, res) => {
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

// GET route to retrieve all newsletter subscribers
router.get('/newsletter', async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    return res.status(200).json(subscribers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching subscribers.' });
  }
});

// DELETE route to remove a subscriber by ID
router.delete('/newsletter/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Newsletter.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Subscriber not found.' });
    }
    return res.status(200).json({ message: 'Subscriber deleted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting subscriber.' });
  }
});

module.exports = router;
