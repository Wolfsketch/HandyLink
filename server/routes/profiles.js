// server/Routes/profiles.js

const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile"); // Het model dat je eerder hebt gedeeld

// Route voor het aanmaken van een profiel
router.post("/", async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const newProfile = new Profile({ name, email, role });
    await newProfile.save();
    res
      .status(201)
      .json({ message: "Admin account aangemaakt", profile: newProfile });
  } catch (error) {
    console.error("Fout bij het aanmaken van profiel:", error);
    res.status(500).json({
      message: "Er is een fout opgetreden bij het aanmaken van het profiel",
    });
  }
});

// Route voor het ophalen van alle profielen
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Fout bij het ophalen van profielen:", error);
    res.status(500).json({
      message: "Er is een fout opgetreden bij het ophalen van profielen",
    });
  }
});

// Route om een profiel bij te werken
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profiel niet gevonden" });
    }
    res.status(200).json(profile);
  } catch (error) {
    console.error("Fout bij het ophalen van profiel:", error);
    res
      .status(500)
      .json({
        message: "Er is een fout opgetreden bij het ophalen van het profiel.",
      });
  }
});

module.exports = router;
