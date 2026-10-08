"use client";

import React from "react";
import Link from "next/link";
import { API_BASE } from "../../../utils/api";

export function AdminNavbar({
  backendHealth,
  runHealthCheck,
  handleLogout,
}) {
  return (
    <header className="admin-navbar">
      <div className="admin-nav-left">
        <Link href="/Admin" className="admin-nav-logo">
          FLINT<span>SECTOR</span>
          <span className="admin-nav-tag">OPS 2.0</span>
        </Link>

        {/* Connection status badge */}
        <div
          className={`admin-badge-status ${
            backendHealth.connected ? "status-connected" : "status-disconnected"
          }`}
          title={`API endpoint: ${API_BASE}`}
        >
          <span className="status-dot" />
          {backendHealth.connected
            ? backendHealth.mongodb
              ? "API + Mongo Atlas Online"
              : "API Online (MongoDB Pending)"
            : "Backend Offline (Port 5000)"}
        </div>
      </div>

      <div className="admin-nav-right">
        <button
          type="button"
          className="admin-action-btn-sm"
          onClick={runHealthCheck}
          title="Check API server ping"
        >
          🔄 Ping Test
        </button>

        <Link href="/" target="_blank" className="admin-action-btn-sm">
          👁️ Live Store
        </Link>

        <button
          type="button"
          className="admin-action-btn-sm admin-action-btn-danger"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;
