const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

// POST: Create a new appointment
router.post("/appointments", async (req, res) => {
  const { doctorName, date, time, contact } = req.body;
  try {
    const newAppointment = new Appointment({
      doctorName,
      date,
      time,
      contact,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

router.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id); // MongoDB delete
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET: Retrieve all appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "Error fetching appointments", error });
  }
});

module.exports = router;
