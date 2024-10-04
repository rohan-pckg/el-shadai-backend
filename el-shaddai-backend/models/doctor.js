const mongoose = require("mongoose");

// Define the doctor schema
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
});

// Create the Doctor model
const Doctor = mongoose.model("Doctor", doctorSchema);

// Export the model
module.exports = Doctor;
