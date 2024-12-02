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

// PUT - Klant bijwerken
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subscription, address, birthDate } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        subscription,
        address,
        birthDate,
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Klant niet gevonden" });
    }

    res.json(updatedCustomer);
  } catch (err) {
    console.error("Fout bij het bijwerken van klant:", err);
    res.status(400).json({ error: "Fout bij het bijwerken van klant" });
  }
});

// DELETE - Klant verwijderen
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Klant niet gevonden" });
    }

    res.json({ message: "Klant succesvol verwijderd" });
  } catch (err) {
    console.error("Fout bij het verwijderen van klant:", err);
    res.status(400).json({ error: "Fout bij het verwijderen van klant" });
  }
});

module.exports = router;
