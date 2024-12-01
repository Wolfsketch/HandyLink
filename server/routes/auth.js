// server/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registratie route
// Registratie route
router.post("/register", async (req, res) => {
  const { email, password, role, name, skills, hourlyRate, location } =
    req.body;

  try {
    // Controleer of de gebruiker al bestaat
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Gebruiker bestaat al" });
    }

    // Maak een nieuw gebruiker object
    user = new User({
      email,
      password,
      role,
      name,
      skills: role === "Professional" ? skills : [],
      hourlyRate: role === "Professional" ? hourlyRate : null,
      location,
    });

    // Hash het wachtwoord
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sla de gebruiker op in de database
    await user.save();

    // Genereer een JWT-token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Fout bij registratie:", err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Zoek de gebruiker op e-mailadres
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Ongeldige inloggegevens" });
    }

    // Vergelijk het ingevoerde wachtwoord met het gehashte wachtwoord
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ongeldige inloggegevens" });
    }

    // Genereer een JWT-token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Fout bij inloggen:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
