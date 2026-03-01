const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Emergency Mock Database (In-memory storage)
let listings = [
  { _id: "1", producerName: "Hostel Block A", energyType: "Solar", quantityKWh: 45, pricePerKWh: 5.5 },
  { _id: "2", producerName: "Indore Wind Farm", energyType: "Wind", quantityKWh: 120, pricePerKWh: 4.2 }
];

// 1. POST: Add Energy (Saves to memory)
app.post('/api/listings', (req, res) => {
  const newListing = { ...req.body, _id: Date.now().toString() };
  listings.unshift(newListing); // Add to the top of the list
  res.status(201).json(newListing);
});

// 2. GET: View Marketplace (Reads from memory)
app.get('/api/listings', (req, res) => {
  res.status(200).json(listings);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 DEMO MODE: Server running on port ${PORT}`));