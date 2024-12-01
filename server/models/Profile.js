// server/models/profile.js

const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: "User" }, // Standaardwaarde
  status: { type: String, default: "Active" },
});

module.exports = mongoose.model("Profile", ProfileSchema);
