const mongoose = require("mongoose");

// Define the doctor schema
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
    minlength: [3, "Name must be at least 3 characters long"], // Minimum name length validation
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: [
        "Cardiology",
        "Dermatology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Radiology",
        "General Practice",
        "Surgery",
      ], // You can extend this with other specialties as needed
      message: "Specialty is not valid",
    },
  },
  // Placeholder for future additions (optional fields)
  // experience: {
  //   type: Number, // Years of experience (optional)
  //   min: 0,
  // },
});

module.exports = mongoose.model("Doctor", doctorSchema);
