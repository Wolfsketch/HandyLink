const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  benefits: [{ type: String }], // Lijst van voordelen
  duration: { type: String, required: true }, // "1 maand", "1 jaar", etc.
  tags: [{ type: String }], // Bijv. "Meest gekozen"
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
