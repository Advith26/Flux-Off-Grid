import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import CustomCursor from './CustomCursor';
import './App.css';

// 🔗 SECURE SUPABASE CONNECTION
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'FALLBACK';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'FALLBACK';
const isSupabaseActive = supabaseUrl !== 'FALLBACK' && supabaseUrl.startsWith('http');
const supabase = isSupabaseActive ? createClient(supabaseUrl, supabaseKey) : null;

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); 
  const [earnings, setEarnings] = useState(1450); 
  
  // 💾 STATE MANAGEMENT
  const [impact, setImpact] = useState(() => {
    const saved = localStorage.getItem('flux_impact');
    return saved ? JSON.parse(saved) : { co2: 12540, traded: 8500, households: 42, revenue: 0 };
  });
  
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('flux_purchases');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('flux_listings');
    return saved ? JSON.parse(saved) : [
      { id: 1, producer: 'Hostel Block A', type: 'Solar', units: 150, price: 5.5, location: 'North Campus' },
      { id: 2, producer: 'NMIMS Main Roof', type: 'Wind', units: 400, price: 4.2, location: 'South Campus' },
      { id: 3, producer: 'Canteen Waste', type: 'Biogas', units: 80, price: 3.0, location: 'East Campus' }
    ];
  });

  const [filterType, setFilterType] = useState('All');
  const [toast, setToast] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [activeMapNode, setActiveMapNode] = useState(null);

  const tickerItems = [
    "⚡ Node 0x7F just secured 45kWh", "🌱 Campus CO2 offset increased by 1.2%", 
    "📈 Solar Yield peaking at Block A", "💸 ROI payout processed for Biogas Investors",
    "🔒 Smart Contract executed on Node 0x2B"
  ];

  useEffect(() => {
    if (isSupabaseActive) {
      const fetchLedger = async () => {
        const { data, error } = await supabase.from('listings').select('*').gt('units', 0).order('id', { ascending: false });
        if (data && data.length > 0) setListings(data);
        if (error) console.error("Supabase Fetch Error:", error);
      };
      fetchLedger();
    }
  }, [view]);

  useEffect(() => {
    localStorage.setItem('flux_listings', JSON.stringify(listings));
    localStorage.setItem('flux_purchases', JSON.stringify(purchases));
    localStorage.setItem('flux_impact', JSON.stringify(impact));
  }, [listings, purchases, impact]);

  const generateHash = () => '0x' + Math.random().toString(16).substring(2, 15);
  const showToast = (message) => { setToast(message); setTimeout(() => setToast(''), 4000); };

  const handleLogin = (e) => {
    e.preventDefault();
    const role = e.target.role.value;
    setUser({ name: e.target.username.value, role });
    setView(role === 'Producer' ? 'producer' : role === 'Investor' ? 'invest' : 'market');
    showToast(`🟢 Secure Protocol Established: Node ${e.target.username.value}`);
  };

  const handlePurchase = async (item) => {
    const qty = prompt(`Initiate transfer from ${item.producer}? Enter kWh (Max: ${item.units}):`, "10");
    const purchaseQty = Number(qty);
    
    if (purchaseQty && purchaseQty <= item.units) {
      setProcessingId(item.id);
      
      const baseCost = purchaseQty * item.price;
      const fluxFee = baseCost * 0.02; // 2% Platform Revenue
      const totalCost = baseCost + fluxFee;

      if (isSupabaseActive && item.id.toString().length < 10) {
        try {
           await supabase.from('listings').update({ units: item.units - purchaseQty }).eq('id', item.id);
        } catch (err) { console.error("DB Sync failed"); }
      }

      setTimeout(() => {
        setProcessingId(null);
        setListings(prev => prev.map(l => l.id === item.id ? { ...l, units: l.units - purchaseQty } : l).filter(l => l.units > 0));
        
        const newPurchase = { 
          id: Date.now(), hash: generateHash(), producer: item.producer, 
          type: item.type, qty: purchaseQty, cost: totalCost.toFixed(2), 
          fee: fluxFee.toFixed(2), time: new Date().toLocaleTimeString() 
        };
        
        setPurchases(prev => [newPurchase, ...prev]);
        setImpact(prev => ({ 
          ...prev, co2: prev.co2 + (purchaseQty * 0.8), 
          traded: prev.traded + purchaseQty, revenue: prev.revenue + fluxFee 
        }));
        
        showToast(`⚡ Contract Executed. Platform Fee: ₹${fluxFee.toFixed(2)}`);
        setActiveMapNode(null); 
      }, 1500);
    } else if (purchaseQty) showToast("❌ Error: Liquidity pool insufficient.");
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    const newListing = { 
      producer: user.name, type: e.target.type.value, units: Number(e.target.units.value), 
      price: Number(e.target.price.value), location: e.target.location.value 
    };

    if (isSupabaseActive) {
      const { data, error } = await supabase.from('listings').insert([newListing]).select();
      if (error) { alert("Supabase Error: " + error.message); } 
      else if (data) { setListings([data[0], ...listings]); showToast("✅ Synced to PostgreSQL Cloud!"); e.target.reset(); }
    } else {
      newListing.id = Date.now();
      setListings([newListing, ...listings]);
      showToast("✅ Assets Listed to Local Order Book!");
      e.target.reset();
    }
  };

  const handleInvest = (project) => {
    const amt = prompt(`Enter investment capital for ${project} (₹):`, "5000");
    if (amt) { setProcessingId(project); setTimeout(() => { setProcessingId(null); showToast(`📈 Capital Deployed to ${project}.`); }, 1500); }
  };

  const filteredListings = listings.filter(l => filterType === 'All' || l.type === filterType);

  if (view === 'landing') {
    return (
      <div className="landing-page">
        <CustomCursor />
        <div className="noise-overlay"></div>
        <div className="animated-grid-bg"></div>
        <nav className="landing-nav">
          <h2 className="logo-italic">Flux</h2>
          <div className="nav-links">
            <span onClick={() => { const el = document.getElementById('market-section'); if(el) el.scrollIntoView({behavior: 'smooth'}); }}>Marketplace</span>
            <span onClick={() => setView('login')}>Architecture</span>
            <span onClick={() => setView('login')}>Network</span>
          </div>
          <button className="btn-chamfer" onClick={() => setView('login')}>Connect Node</button>
        </nav>

        <section className="hero-section">
          <div className="hero-content fade-up-stagger">
            <div className="network-badge"><span className="pulse-dot"></span> HTTPS / SQL Verified</div>
            <h1 className="hero-headline">The financial layer<br/>for campus energy.</h1>
            <p className="hero-subtext">A high-frequency trading protocol for renewable power. Bypass utility firewalls, empower your community, and generate sustainable yield.</p>
            <div className="hero-buttons">
              <button className="btn-chamfer primary" onClick={() => setView('login')}>Initialize Producer</button>
              <button className="btn-chamfer secondary outline" onClick={() => document.getElementById('market-section').scrollIntoView({behavior: 'smooth'})}>View Order Book</button>
            </div>
          </div>
          <div className="hero-visual fade-up-stagger">
            <div className="orb-container"><div className="orb-center"></div><div className="orb-ring ring-1"><span className="orb-node" style={{'--i': 0}}>☀️</span><span className="orb-node" style={{'--i': 1}}>🌬️</span><span className="orb-node" style={{'--i': 2}}>🌿</span></div><div className="orb-ring ring-2"><span className="orb-node" style={{'--i': 0}}>💧</span><span className="orb-node" style={{'--i': 1}}>🔋</span><span className="orb-node" style={{'--i': 2}}>⚡</span></div></div>
          </div>
        </section>

        <div className="stats-strip">
          <div className="stat-item"><h3>{impact.traded} kWh</h3><p>Energy Traded</p></div>
          <div className="stat-item"><h3>{impact.households}</h3><p>Active Nodes</p></div>
          <div className="stat-item"><h3>₹{(listings.reduce((a, b) => a + b.price, 0) / (listings.length || 1)).toFixed(2)}</h3><p>Avg Market Price</p></div>
          <div className="stat-item"><h3>{impact.co2.toFixed(1)} kg</h3><p>CO₂ Offset</p></div>
        </div>

        <section id="market-section" className="landing-section">
          <h2 className="section-title">Live Order Book</h2>
          <div className="landing-grid">
            {listings.slice(0, 6).map((node) => (
              <div key={node.id} className="preview-card hover-glow">
                <div className="card-header"><span className="badge">{node.type === 'Solar' ? '☀️ Solar' : node.type === 'Wind' ? '🌬️ Wind' : '🌿 Biogas'}</span><h4>{node.producer}</h4></div>
                <div className="card-metrics"><div><span>Capacity</span><p>{Math.round(node.units * 1.2)} kWh</p></div><div><span>Available</span><p>{node.units} kWh</p></div><div><span>CO₂ Offset</span><p>{(node.units * 0.8).toFixed(1)}kg</p></div></div>
                <div className="card-footer"><div className="price">₹{node.price.toFixed(2)} <span>/ kWh</span></div><button className="trade-link" onClick={() => setView('login')}>Trade Asset →</button></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="App app-view">
      <CustomCursor />
      {toast && <div className="toast-notification">{toast}</div>}
      {/* 🚀 THE LIVE SMART CONTRACT TERMINAL 🚀 */}
      {processingId && (
        <div className="processing-overlay fade-in">
          <div className="terminal-window">
            <div className="terminal-header"><span></span><span></span><span></span></div>
            <div className="terminal-body">
              <p>&gt; Initiating P2P Handshake Protocol...</p>
              <p className="delay-1">&gt; Verifying Liquidity Pool & Node Uptime...</p>
              <p className="delay-2">&gt; Generating Cryptographic TxHash...</p>
              <p className="delay-3" style={{color: '#fff', fontWeight: 'bold'}}>&gt; ⚡ CONTRACT EXECUTED SUCCESSFULLY</p>
            </div>
          </div>
        </div>
      )}
      <nav className="nav-bar">
        <h2 className="logo logo-italic" onClick={() => user ? setView('market') : null}>FLUX</h2>
        <div className="impact-stats">
          <span className="pill green pulse-pill">🌱 {impact.co2.toFixed(0)} kg CO₂</span>
          <span className="pill blue">⚡ {impact.traded} kWh</span>
        </div>

        {/* 🚨 THE FIXED, SINGLE ROW OF BUTTONS 🚨 */}
        {user && (
          <div className="user-controls">
            {user.role === 'Consumer' && <button onClick={() => setView('portfolio')} className="nav-btn">📊 Wallet</button>}
            <button onClick={() => setView('analytics')} className="nav-btn">📈 Analytics</button>
            <button onClick={() => setView('market')} className="nav-btn">🛒 Market</button>
            <button onClick={() => setView('network')} className="nav-btn">🌐 Network</button>
            <button onClick={() => setView('map')} className="nav-btn">📍 Map</button>
            <button onClick={() => setUser(null) || setView('landing')} className="nav-btn outline">Disconnect</button>
          </div>
        )}
      </nav>

      {user && (
        <div className="ticker-wrap">
          <div className="ticker-move">
            {tickerItems.map((item, i) => <div key={i} className="ticker-item">{item}</div>)}
            {tickerItems.map((item, i) => <div key={i+10} className="ticker-item">{item}</div>)}
          </div>
        </div>
      )}

      <main className="main-content">
        {view === 'login' && (
          <div className="card login-card fade-in">
            <h1 style={{fontSize: '40px', marginBottom: '10px'}}>Access the Protocol</h1>
            <form onSubmit={handleLogin} className="form-grid mt-20">
              <input name="username" placeholder="Node Alias (e.g. Block A)" required />
              <select name="role"><option value="Consumer">Consumer</option><option value="Producer">Producer</option><option value="Investor">Investor</option></select>
              <button type="submit" className="btn-chamfer primary w-100 mt-20">Initialize Connection</button>
            </form>
          </div>
        )}

        {view === 'portfolio' && (
          <div className="dashboard fade-in">
            <h2>Decentralized Wallet</h2>
            <div className="stats-row" style={{marginBottom: '20px'}}><div className="stat-box glow-hover"><h3>Platform Fees Paid (2%)</h3><h2 style={{color: '#ffbd2e'}}>₹{impact.revenue.toFixed(2)}</h2></div></div>
            <div className="card p-0">
              <table>
                <thead><tr><th>Last Active</th><th>Source Node</th><th>Volume Held</th><th>Capital Deployed</th><th>Trades</th></tr></thead>
                <tbody>
                  {purchases.length === 0 ? ( <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>No assets secured.</td></tr> ) : (
                    Object.values(purchases.reduce((acc, tx) => {
                      if (!acc[tx.producer]) acc[tx.producer] = { producer: tx.producer, totalQty: 0, totalCost: 0, count: 0, time: tx.time };
                      acc[tx.producer].totalQty += tx.qty; acc[tx.producer].totalCost += parseFloat(tx.cost); acc[tx.producer].count += 1; acc[tx.producer].time = tx.time;
                      return acc;
                    }, {})).map((p, i) => (
                      <tr key={i} className="interactive-row"><td>{p.time}</td><td style={{fontWeight: 'bold'}}>{p.producer}</td><td style={{color: '#2196f3'}}>{p.totalQty} kWh</td><td style={{color: '#4caf50'}}>₹{p.totalCost.toFixed(2)}</td><td style={{color: '#888'}}>{p.count} Executions</td></tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'producer' && (
          <div className="dashboard fade-in">
            <div className="stats-row"><div className="stat-box glow-hover"><h3>Total Yield</h3><h2>₹{earnings}</h2></div></div>
            <div className="card mt-20">
              <h2>Deploy Capacity to Grid</h2>
              <form onSubmit={handleAddListing} className="form-row">
                <select name="type"><option>Solar</option><option>Wind</option><option>Biogas</option></select>
                <input name="units" type="number" placeholder="Capacity (kWh)" required />
                <input name="price" type="number" placeholder="Price (₹/kWh)" required />
                <input name="location" placeholder="Campus Sector" required />
                <button type="submit" className="btn-chamfer primary">Execute Listing</button>
              </form>
            </div>
          </div>
        )}

        {view === 'market' && (
          <div className="marketplace fade-in">
            <div className="filter-row"><h2>Order Book</h2><div className="filters"><button className={`filter-btn ${filterType === 'All' ? 'active' : ''}`} onClick={() => setFilterType('All')}>All</button><button className={`filter-btn ${filterType === 'Solar' ? 'active' : ''}`} onClick={() => setFilterType('Solar')}>☀️ Solar</button></div></div>
            <div className="card p-0">
              <table>
                <thead><tr><th>Origin Node</th><th>Asset</th><th>Volume</th><th>Ask Price</th><th>Sector</th><th>Action</th></tr></thead>
                <tbody>
                  {filteredListings.map(l => (
                    <tr key={l.id} className="interactive-row">
                      <td>{l.producer}</td><td>{l.type}</td><td>{l.units} kWh</td><td style={{color: '#4caf50', fontWeight: 'bold'}}>₹{l.price}</td><td>{l.location}</td>
                      <td><button className={`btn-secondary ${processingId === l.id ? 'processing' : ''}`} onClick={() => handlePurchase(l)} disabled={processingId !== null}>{processingId === l.id ? '⚡ Executing...' : 'Buy Asset'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'invest' && (
          <div className="investor-module fade-in">
            <h2>Green Yield Projects</h2>
            <div className="grid-2">
              <div className="card project-card interactive-row">
                <h3>Solar Rooftop Expansion</h3><p className="roi">Expected Yield: <strong>12.5% APY</strong></p>
                <div className="progress-bar"><div className="fill glow" style={{width: '64%'}}></div></div>
                <button className="btn-chamfer primary w-100 mt-20" onClick={() => handleInvest('Solar')}>Stake Capital</button>
              </div>
            </div>
          </div>
        )}

        {view === 'network' && (
          <div className="network-directory fade-in">
            <div className="filter-row">
              <h2>Active Protocol Nodes</h2>
              <span className="badge" style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '5px 15px', borderRadius: '20px' }}><span className="pulse-dot green" style={{ display: 'inline-block', width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%', marginRight: '8px' }}></span>All Systems Operational</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {Array.from(new Set([...listings.map(l => l.producer), user.name, 'NMIMS Admin Node', 'Hostel Block B'])).map((nodeName, index) => (
                <div key={index} className="card hover-glow" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}><h3 style={{ margin: 0, fontSize: '18px' }}>{nodeName}</h3><span style={{ fontSize: '12px', color: '#888', background: '#222', padding: '4px 8px', borderRadius: '4px' }}>ID: 0x{Math.random().toString(16).substring(2, 6).toUpperCase()}</span></div>
                  <p style={{ color: listings.some(l => l.producer === nodeName) ? '#ffbd2e' : '#4caf50', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>{listings.some(l => l.producer === nodeName) ? '⚡ Energy Producer' : '🔋 Consumer Node'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#aaa', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}><div><strong>Uptime:</strong> 99.{Math.floor(Math.random() * 9)}%</div><div><strong>Latency:</strong> {12 + (index * 3)}ms</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'analytics' && (
          <div className="analytics-module fade-in">
            <h2>System & Impact Analytics</h2>
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div className="card hover-glow">
                <h3 style={{color: '#4caf50', marginBottom: '15px'}}>🌍 Sustainability Impact Measurement</h3>
                <div style={{ lineHeight: '1.8' }}>
                  <p><strong>Quantified Carbon Reduction:</strong> <span style={{color: '#fff'}}>{impact.co2.toFixed(1)} kg CO₂</span></p>
                  <p><strong>Equivalent Trees Planted:</strong> <span style={{color: '#fff'}}>{(impact.co2 / 21).toFixed(1)} Trees</span></p>
                  <p><strong>Fossil Fuel Replaced:</strong> <span style={{color: '#fff'}}>{(impact.traded * 0.4).toFixed(1)} Liters</span></p>
                  <div className="progress-bar mt-20" style={{ background: '#222', height: '8px', borderRadius: '4px', marginTop: '20px' }}><div className="fill glow" style={{width: '78%', background: '#4caf50', height: '100%', borderRadius: '4px'}}></div></div>
                  <p style={{fontSize: '12px', color: '#888', marginTop: '8px'}}>Target: 50,000 kg CO₂ by Q4</p>
                </div>
              </div>
              <div className="card hover-glow">
                <h3 style={{color: '#ffbd2e', marginBottom: '15px'}}>💰 Financial & Business Viability</h3>
                <div style={{ lineHeight: '1.8' }}>
                  <p><strong>Average Producer ROI:</strong> <span style={{color: '#fff'}}>14.2% APY</span></p>
                  <p><strong>Cost-Benefit (Consumer):</strong> <span style={{color: '#fff'}}>18% Cheaper vs. Grid</span></p>
                  <p><strong>Platform Revenue (2% Fee):</strong> <span style={{color: '#fff'}}>₹{impact.revenue.toFixed(2)}</span></p>
                  <div className="progress-bar mt-20" style={{ background: '#222', height: '8px', borderRadius: '4px', marginTop: '20px' }}><div className="fill glow" style={{width: '42%', background: '#ffbd2e', height: '100%', borderRadius: '4px'}}></div></div>
                  <p style={{fontSize: '12px', color: '#888', marginTop: '8px'}}>Projected ARR: ₹2.4M at 10,000 Nodes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'map' && (
          <div className="map-view card fade-in">
            <h2>Live Node Topology</h2>
            <div className="fake-map">
              {filteredListings.map((l, i) => (
                <div key={l.id} className={`map-marker ${l.type.toLowerCase()}`} style={{ top: `${10 + ((i * 47) % 80)}%`, left: `${5 + ((i * 61) % 85)}%` }} onClick={() => setActiveMapNode(l)}><div className="pulse"></div></div>
              ))}
              {activeMapNode && (
                <div className="map-info-card fade-in" style={{ top: '20%', right: '10%' }}><button className="close-btn" onClick={() => setActiveMapNode(null)}>✖</button><h3>{activeMapNode.producer}</h3><p><strong>Volume:</strong> {activeMapNode.units} kWh</p><p><strong>Rate:</strong> ₹{activeMapNode.price}</p><button className="btn-chamfer primary mt-20 w-100" onClick={() => handlePurchase(activeMapNode)}>Initiate Transfer</button></div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;