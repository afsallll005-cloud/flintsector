"use client";

import React from "react";

export function OverviewTab({
  stats,
  handleOpenAddProduct,
  handleSeedDatabase,
  setActiveTab,
}) {
  return (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-header">
            <span>Gross Revenue</span>
            <span>💰</span>
          </div>
          <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-desc">From WhatsApp & Store Checkouts</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span>Total Orders</span>
            <span>📦</span>
          </div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-desc">
            {stats.pendingOrders} pending fulfillment
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span>Catalog Products</span>
            <span>👕</span>
          </div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-desc">Oversized & Streetwear cuts</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <span>Low Inventory</span>
            <span>⚠️</span>
          </div>
          <div className="stat-value">{stats.lowStockCount}</div>
          <div className="stat-desc">Items with &lt; 25 units remaining</div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="admin-section-header">
        <h2 className="admin-section-title">Quick Operations</h2>
        <div className="admin-section-controls">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAddProduct}
          >
            + Add New Product
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleSeedDatabase}
          >
            ⚡ Sync Default Catalog to MongoDB
          </button>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="admin-section-header" style={{ marginTop: "2rem" }}>
        <h2 className="admin-section-title">Recent Orders</h2>
        <button
          type="button"
          className="admin-action-btn-sm"
          onClick={() => setActiveTab("orders")}
        >
          View All Orders &rarr;
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord) => (
                  <tr key={ord._id || ord.orderReference}>
                    <td>
                      <strong>{ord.orderReference}</strong>
                    </td>
                    <td>
                      <div>{ord.customer?.name || "Customer"}</div>
                      <small style={{ color: "#8b949e" }}>
                        {ord.customer?.phone}
                      </small>
                    </td>
                    <td>{ord.items?.length || 1} product(s)</td>
                    <td>
                      <strong>₹{ord.finalTotal}</strong>
                    </td>
                    <td>
                      <span
                        className={`badge-pill badge-${(
                          ord.status || "pending"
                        ).toLowerCase()}`}
                      >
                        {ord.status || "Pending"}
                      </span>
                    </td>
                    <td>{ord.paymentMethod || "COD"}</td>
                    <td>
                      {ord.customer?.phone && (
                        <a
                          href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(ord.customer.name || "")},%20regarding%20your%20Flint%20Sector%20Order%20${ord.orderReference}:`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-action-btn-sm"
                        >
                          WhatsApp
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    No orders logged yet. Orders placed on the website or via WhatsApp will appear here automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
