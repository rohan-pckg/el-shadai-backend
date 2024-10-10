const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctor"); // Import the Doctor model

// GET all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Fetch all doctors
    res.json(doctors); // Send the list of doctors as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors
  }
});

router.delete("/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error });
  }
});

// routes/doctors.js

// ... Other routes (GET, POST, DELETE)

// Update a doctor by ID
router.put("/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, speciality } = req.body; // Extract name and speciality from the request body

    // Validate input
    if (!name || !speciality) {
      return res
        .status(400)
        .json({ message: "Name and speciality are required" });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { name, speciality },
      { new: true },
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error });
  }
});

module.exports = router;

// POST a new doctor
router.post("/doctors", async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    speciality: req.body.speciality,
  });

  try {
    const newDoctor = await doctor.save(); // Save the new doctor to the database
    res.status(201).json(newDoctor); // Respond with the created doctor
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle validation errors
  }
});

module.exports = router; // Export the router
