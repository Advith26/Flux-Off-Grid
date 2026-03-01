import React, { useState } from 'react';
import axios from 'axios';

const AddListing = ({ onListingAdded }) => {
  const [formData, setFormData] = useState({
    producerName: '',
    energyType: 'Solar',
    quantityKWh: '',
    pricePerKWh: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      quantityKWh: Number(formData.quantityKWh),
      pricePerKWh: Number(formData.pricePerKWh)
    };

    try {
      await axios.post('http://localhost:5000/api/listings', payload);
      alert("✅ Energy Listed on Marketplace!");
      setFormData({ producerName: '', energyType: 'Solar', quantityKWh: '', pricePerKWh: '' });
      onListingAdded();
    } catch (error) {
      console.error("❌ Post Error:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #2e7d32', borderRadius: '10px', marginBottom: '20px', backgroundColor: '#fff' }}>
      <h3>List Excess Energy</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder="Producer Name" value={formData.producerName} onChange={(e) => setFormData({...formData, producerName: e.target.value})} required />
        <select value={formData.energyType} onChange={(e) => setFormData({...formData, energyType: e.target.value})}>
          <option value="Solar">Solar</option>
          <option value="Wind">Wind</option>
          <option value="Biogas">Biogas</option>
        </select>
        <input type="number" placeholder="Quantity (kWh)" value={formData.quantityKWh} onChange={(e) => setFormData({...formData, quantityKWh: e.target.value})} required />
        <input type="number" placeholder="Price (₹/kWh)" value={formData.pricePerKWh} onChange={(e) => setFormData({...formData, pricePerKWh: e.target.value})} required />
        <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', padding: '10px', cursor: 'pointer' }}>Post to Market</button>
      </form>
    </div>
  );
};

export default AddListing;