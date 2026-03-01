const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  producerName: { type: String, required: true },
  energyType: { type: String, required: true },
  quantityKWh: { type: Number, required: true },
  pricePerKWh: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);