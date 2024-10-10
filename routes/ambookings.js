const express = require("express");
const router = express.Router();
const Ambooking = require("../models/ambooking"); // Import the ambulance booking model

// POST: Create a new ambulance booking
router.post("/ambookings", async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Create new booking entry
    const newBooking = new Ambooking({
      name,
      phone,
      address,
    });

    await newBooking.save(); // Save booking to the database
    res.status(201).json({
      message: "Ambulance booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to create ambulance booking",
      details: err.message,
    });
  }
});

// GET: Get all ambulance bookings
router.get("/ambookings", async (req, res) => {
  try {
    const bookings = await Ambooking.find(); // Fetch all bookings
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve ambulance bookings",
      details: err.message,
    });
  }
});

// routes/ambbooking.js
router.patch("/ambookings/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("ID:", id); // Log the ID to check if it's correct
    console.log("Status:", status); // Log the status value

    if (!id || !status) {
      return res.status(400).json({ message: "ID and status are required." });
    }

    // Attempt to find the booking by ID and update the status
    const booking = await Ambooking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status." });
  }
});

// DELETE: Delete a specific ambulance booking by ID
router.delete("/ambookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Ambooking.findByIdAndDelete(id); // Find booking by ID and delete it

    if (!booking) {
      return res.status(404).json({ error: "Ambulance booking not found" });
    }

    res
      .status(200)
      .json({ message: "Ambulance booking deleted successfully", booking });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete ambulance booking",
      details: err.message,
    });
  }
});

module.exports = router;
