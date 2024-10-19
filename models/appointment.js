const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Referencing the Doctor model
      required: true,
    },
    doctorName: String,  // Add doctorName here
    date: {
      type: Date, // Changed to Date type for proper handling of dates
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date(); // Ensure date is not in the past
        },
        message: "Appointment date must be in the future.",
      },
    },
    time: {
      type: String, // Time remains as a string in HH:MM format
      required: true,
      match: [
        /^([0-1]\d|2[0-3]):([0-5]\d)$/,
        "Please enter a valid time in HH:MM format",
      ], // Basic time format validation
    },
    contact: {
      name: {
        type: String,
        required: true,
        trim: true, // To remove any extra spaces
      },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"], // Simple phone validation
      },
      email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Basic email validation
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);