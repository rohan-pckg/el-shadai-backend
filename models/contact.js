const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // to remove extra spaces
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"], // add basic validation
    },
    email: {
      type: String,
      required: true, // made it required
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // basic email format validation
    },
    message: {
      type: String,
      required: true, // made it required
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contact", contactSchema);
