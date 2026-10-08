"use client";

import React from "react";
import { ORDER_STATUSES } from "./constants";

export function OrdersTab({
  orders,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  loadTabData,
  handleUpdateOrderStatus,
  handleDeleteOrder,
}) {
  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Orders Management</h2>
          <div style={{ fontSize: "0.8rem", color: "#8b949e", marginTop: "4px" }}>
            All orders received through website WhatsApp checkout and direct orders.
          </div>
        </div>

        <div className="admin-section-controls">
          <button type="button" className="admin-btn-secondary" onClick={loadTabData}>
            🔄 Refresh Orders
          </button>
        </div>
      </div>

      {/* Order Filters */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          type="text"
          className="admin-input"
          style={{ maxWidth: "320px" }}
          placeholder="Search by order ref, phone, name..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadTabData()}
        />

        <select
          className="admin-select"
          style={{ maxWidth: "200px" }}
          value={orderStatusFilter}
          onChange={(e) => {
            setOrderStatusFilter(e.target.value);
            setTimeout(loadTabData, 50);
          }}
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <button type="button" className="admin-btn-secondary" onClick={loadTabData}>
          Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref & Date</th>
                <th>Customer Details</th>
                <th>Items Ordered</th>
                <th>Final Total</th>
                <th>Status Selector</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id || ord.orderReference}>
                    <td>
                      <strong>{ord.orderReference}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#8b949e", marginTop: "2px" }}>
                        {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#fff" }}>
                        {ord.customer?.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#8b949e" }}>
                        📞 {ord.customer?.phone}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        📍 {ord.customer?.city ? `${ord.customer.city}, ` : ""}
                        {ord.customer?.pincode}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "260px" }}>
                        {ord.items && ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: "0.8rem",
                              marginBottom: "4px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>
                              {item.quantity}x {item.name} ({item.size})
                            </span>
                            <span style={{ color: "#9ca3af" }}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: "1rem", color: "#10b981" }}>
                        ₹{ord.finalTotal}
                      </strong>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        style={{
                          padding: "0.35rem 0.6rem",
                          fontSize: "0.8rem",
                          width: "130px",
                        }}
                        value={ord.status || "Pending"}
                        onChange={(e) =>
                          handleUpdateOrderStatus(
                            ord.orderReference || ord._id,
                            e.target.value
                          )
                        }
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="admin-tag">{ord.paymentMethod || "COD"}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {ord.customer?.phone && (
                          <a
                            href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(ord.customer.name || "")},%20we%20have%20received%20your%20FLINT%20SECTOR%20order%20(${ord.orderReference})!`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-action-btn-sm"
                            title="Contact customer on WhatsApp"
                          >
                            WA
                          </a>
                        )}
                        <button
                          type="button"
                          className="admin-action-btn-sm admin-action-btn-danger"
                          onClick={() =>
                            handleDeleteOrder(ord._id || ord.orderReference, ord.orderReference)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem" }}>
                    No orders recorded yet. Any order submitted via WhatsApp checkout will appear here in real-time.
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

export default OrdersTab;
