// models/ambooking.js
const mongoose = require("mongoose");

const ambookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // to remove extra spaces
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{9}$/, "Phone number must be 10 digits"], // add basic validation
    },
    address: {
      type: String,
      required: true, // made it required
    },
    status: {
      type: String, // Add this field to track dispatch status
      enum: ["Pending", "Dispatched"], // Define acceptable values
      default: "Pending", // Default status
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ambooking", ambookingSchema);
