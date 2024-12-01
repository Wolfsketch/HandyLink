const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// GET - Alle klanten ophalen
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Fout bij het ophalen van klanten" });
  }
});

// POST - Nieuwe klant aanmaken
router.post("/", async (req, res) => {
  const { name, email, phone, subscription, address, birthDate } = req.body;

  const newCustomer = new Customer({
    name,
    email,
    phone,
    subscription,
    address,
    birthDate,
  });

  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ error: "Fout bij het maken van klant" });
  }
});

module.exports = router;
