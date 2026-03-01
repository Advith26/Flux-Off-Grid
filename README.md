FLUX: DECENTRALIZED CAMPUS ENERGY PROTOCOL

Flux is a high-frequency trading protocol designed for micro-grid energy exchange. It provides the financial and data layer for campus-wide renewable energy distribution, bypassing traditional utility bottlenecks to empower local communities.

CORE FILE OPERATIONS

App.js: Logic and State Management

 State Management: Leverages React Hooks to maintain synchronized data arrays and manage distinct user permissions for Producers, Consumers, and Investors.
 Persistent Storage: Integrates a LocalStorage backup system to safeguard session data and transaction logs against network instability.
 Database Integration: Establishes a live connection to a Supabase PostgreSQL cloud ledger for real-time persistence.
 Smart Contract Simulation: Executes the `handlePurchase` function, which automates a 2% platform transaction fee and generates unique cryptographic `TxHash` identifiers.
 Impact Calculations: Provides real-time computation of $CO_2$ reduction metrics and financial ROI (14.2% Producer APY).

App.css: Interface Architecture

 Glassmorphism UI: Utilizes advanced CSS for high-fidelity visual effects, including background saturation and translucent card structures.
 Interactive Feedback: Configures terminal animations for visual confirmation of cryptographic handshakes during trades.
 Responsive Topology: Controls the grid-based scatter-math logic for node markers on the live map view.

INITIALIZATION SEQUENCE

To deploy the Flux environment and establish the full-stack connection, follow these steps:

1. Backend Server Initialization

 Navigate to the server directory: `cd hackathon/server`
 Install dependencies: `npm install`
 Launch API: `node server.js`

2. Client-Side Initialization (Frontend)

 Navigate to the client directory: `cd hackathon/client`
 Install dependencies: `npm install`
 Launch Development Server: `npm start`

3. Cloud Backend Activation (PostgreSQL)

 Environment Configuration: Ensure the `.env` file in the client folder contains valid `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
 Database Permission: Access the Supabase SQL Editor and execute: `alter table listings disable row level security;`.

SYSTEM SPECIFICATIONS

 Project Definition: High-frequency trading protocol for micro-grid energy exchange.
 Technical Stack: React.js, Supabase, and PostgreSQL.
 Operational Metrics: 2% transaction fee and dynamic carbon offset quantification.
