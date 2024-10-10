const express = require("express");
const router = express.Router();
const Contact = require("../models/contact"); // Assuming the contact model is in the 'models' folder

// POST: Create a new contact
router.post("/contacts", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({
      name,
      phone,
      email,
      message,
    });

    // Save the contact to the database
    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact submitted successfully", data: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error creating contact", error });
  }
});

// GET: Fetch all contacts
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res
      .status(200)
      .json({ message: "Contacts fetched successfully", data: contacts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
});

// DELETE: Delete a contact by ID
router.delete("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res
      .status(200)
      .json({ message: "Contact deleted successfully", data: deletedContact });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
});

module.exports = router;
