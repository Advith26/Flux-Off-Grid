import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = () => {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/listings');
      setListings(res.data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Live Marketplace</h2>
      <table>
        <thead>
          <tr>
            <th>Producer</th>
            <th>Type</th>
            <th>Quantity (kWh)</th>
            <th>Price (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(l => (
            <tr key={l._id}>
              <td>{l.producerName}</td>
              <td>{l.energyType}</td>
              <td>{l.quantityKWh}</td>
              <td>₹{l.pricePerKWh}</td>
              {/* The missing <td> tags have been restored here */}
              <td>
                <button 
                  className="buy-btn" 
                  onClick={() => alert(`Transaction Initiated: Purchasing ${l.quantityKWh}kWh from ${l.producerName}`)}
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marketplace;