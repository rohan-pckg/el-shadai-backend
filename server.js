const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const cookieParser = require('cookie-parser');

const app = express();


const doctorsRoute = require("./routes/doctors");
const appointmentRoute = require("./routes/appointments");
const contactRoute = require("./routes/contacts");
const ambookingRoute = require("./routes/ambookings");
const loginRoute = require("./routes/login")
const newsletterRoute = require("./routes/newsletters");


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Hospital API! Use /api/doctors to fetch doctors.");
});

const dbURL =
  'mongodb+srv://rohan:b7=iaDRaJm)">xH@el-shaddai.765wi.mongodb.net/?retryWrites=true&w=majority&appName=el-shaddai';

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api", doctorsRoute); // Prefix the routes with /api

app.use("/api", appointmentRoute);
app.use("/api", contactRoute);
app.use("/api", ambookingRoute);
app.use("/api", loginRoute);
app.use("/api", newsletterRoute);
