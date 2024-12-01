const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    country: { type: String },
    postalCode: { type: String },
    street: { type: String },
    houseNumber: { type: String },
    busNumber: { type: String },
    city: { type: String },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subscription: {
    name: String,
    price: Number,
    startDate: Date,
    endDate: Date,
  },
  address: addressSchema,
  birthDate: { type: Date },
});

module.exports = mongoose.model("Customer", customerSchema);
