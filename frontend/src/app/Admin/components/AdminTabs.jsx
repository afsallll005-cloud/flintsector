"use client";

import React from "react";

export function AdminTabs({
  activeTab,
  setActiveTab,
  productCount = 0,
  orderCount = 0,
}) {
  return (
    <nav className="admin-tabs-bar">
      <button
        type="button"
        className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
        onClick={() => setActiveTab("overview")}
      >
        <span>📊 Overview</span>
      </button>
      <button
        type="button"
        className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
        onClick={() => setActiveTab("products")}
      >
        <span>👕 Products</span>
        <span className="admin-tab-badge">{productCount}</span>
      </button>
      <button
        type="button"
        className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
        onClick={() => setActiveTab("orders")}
      >
        <span>📦 Orders</span>
        <span className="admin-tab-badge">{orderCount}</span>
      </button>
      <button
        type="button"
        className={`admin-tab ${activeTab === "diagnostics" ? "active" : ""}`}
        onClick={() => setActiveTab("diagnostics")}
      >
        <span>⚡ Connection & API</span>
      </button>
    </nav>
  );
}

export default AdminTabs;
