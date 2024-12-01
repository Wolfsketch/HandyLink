const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

// GET - Alle abonnementen ophalen
router.get("/", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: "Fout bij het ophalen van abonnementen" });
  }
});

// POST - Nieuw abonnement maken
router.post("/", async (req, res) => {
  const { name, price, benefits, duration, tags } = req.body;

  const newSubscription = new Subscription({
    name,
    price,
    benefits,
    duration,
    tags,
  });

  try {
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (err) {
    res.status(400).json({ error: "Fout bij het maken van abonnement" });
  }
});

// PUT - Bestaand abonnement bewerken
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, benefits, duration, tags } = req.body;

  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      { name, price, benefits, duration, tags },
      { new: true }
    );
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ error: "Fout bij het bijwerken van abonnement" });
  }
});

// DELETE - Abonnement verwijderen
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Subscription.findByIdAndDelete(id);
    res.json({ message: "Abonnement succesvol verwijderd" });
  } catch (err) {
    res.status(500).json({ error: "Fout bij het verwijderen van abonnement" });
  }
});

module.exports = router;
