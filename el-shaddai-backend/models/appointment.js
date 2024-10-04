const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String, // Changed from ObjectId to String
      required: true,
    },
    date: {
      type: String, // Could be Date type, but since input is likely in string format (YYYY-MM-DD), String is used here
      required: true,
    },
    time: {
      type: String, // Time in HH:MM format
      required: true,
    },
    contact: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
