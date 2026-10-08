"use client";

import React from "react";
import { API_BASE } from "../../../utils/api";

export function DiagnosticsTab({
  backendHealth,
  runHealthCheck,
}) {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h2 className="admin-section-title" style={{ marginBottom: "1.25rem" }}>
        Backend Connection & Infrastructure
      </h2>

      <div className="admin-stat-card" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-header">
          <span>Frontend Target API Endpoint</span>
          <span className="admin-tag">NEXT_PUBLIC_API_URL</span>
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", margin: "0.5rem 0" }}>
          <code>{API_BASE}</code>
        </div>
        <div className="stat-desc">
          Configured in <code>frontend/.env</code> & <code>frontend/.env.local</code>
        </div>
      </div>

      <div className="admin-stat-card" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-header">
          <span>Database Status</span>
          <span className="admin-tag">MONGODB ATLAS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.75rem 0" }}>
          <div
            className={`admin-badge-status ${
              backendHealth.mongodb ? "status-connected" : "status-disconnected"
            }`}
          >
            <span className="status-dot" />
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              {backendHealth.mongodb
                ? "Atlas Connected Successfully"
                : "Database Disconnected / Connecting"}
            </span>
          </div>
        </div>
        <div className="stat-desc">
          Connection string defined in <code>backend/.env</code> (Atlas Cluster)
        </div>
      </div>

      <div className="admin-alert-box">
        <div>
          <div className="admin-alert-title">How to Run Backend Locally:</div>
          <div className="admin-alert-text" style={{ marginTop: "0.5rem" }}>
            1. Open your terminal in the <code>backend</code> directory:<br />
            <code>cd backend</code><br />
            2. Start the Express server:<br />
            <code>npm run dev</code> (or <code>node src/server.js</code>)<br />
            3. The server will run on <code>http://localhost:5000</code> and connect to MongoDB Atlas automatically.
          </div>
        </div>
        <button type="button" className="admin-btn-secondary" onClick={runHealthCheck}>
          Test Connection
        </button>
      </div>
    </div>
  );
}

export default DiagnosticsTab;
