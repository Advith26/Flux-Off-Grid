Technical Documentation and File Operations

The Flux project is architected as a decentralized energy trading protocol. The system operations are distributed across the following core files to ensure technical implementation, sustainability measurement, and financial viability.

1. App.js (Core Logic and State)

This is the primary file containing the React functional component that manages the application lifecycle and peer-to-peer logic.

State Management: Utilizes React Hooks to manage user roles (Producer, Consumer, Investor) and synchronized data arrays.
Persistent Storage**: Implements a LocalStorage backup system to maintain session data and transaction history during network instability.
Database Integration: Connects to a Supabase PostgreSQL cloud ledger for real-time data persistence and multi-node synchronization.
Smart Contract Simulation: Contains the `handlePurchase` function which executes a 2% platform transaction fee, generates a unique cryptographic `TxHash`, and updates the global energy ledger.
Impact Calculations: Dynamically computes $CO_2$ reduction metrics and financial ROI based on the volume of energy traded through the protocol.

2. App.css (Interface Architecture)

This file defines the visual framework and interactive feedback systems of the protocol.

Glassmorphism UI: Implements high-fidelity visual effects including background blurs and translucent card layouts for a professional financial dashboard.
Interactive Feedback: Contains the CSS animations for the Smart Contract Terminal, providing real-time visual confirmation of cryptographic handshakes.
Responsive Layouts: Manages the grid-based node topology and the scatter-math positioning for the live map view.

3. README.md (System Specification)

This document serves as the technical overview and deployment guide for the repository.

Project Definition: Outlines the system as a high-frequency trading protocol for micro-grid energy exchange.
Technical Stack: Documents the use of React.js, Supabase, and PostgreSQL.
Operational Metrics: Explicitly details the business model (2% transaction fee) and the environmental quantification methods (kg $CO_2$ offset).
Peer Communication: Provides instructions for local environment setup and dependency installation.
