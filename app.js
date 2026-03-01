import { useState } from 'react';
import AddListing from './AddListing';
import Marketplace from './Marketplace';

function App() {
  const [refresh, setRefresh] = useState(false);

  // Function to trigger a refresh in the Marketplace when a new item is added
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2e7d32' }}>🌱 EcoTrade Portal</h1>
        <p>NMIMS Smart Campus Renewable Energy Exchange</p>
        
        {/* Impact Metric for Sustainability Marks */}
        <div style={{ display: 'inline-block', padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: 0 }}>Estimated Carbon Offset: <strong>124.5 kg CO₂</strong></h3>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <AddListing onListingAdded={triggerRefresh} />
        <Marketplace key={refresh} />
      </div>
    </div>
  );
}

export default App;