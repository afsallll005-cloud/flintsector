"use client";

import React from "react";
import { CATEGORIES } from "./constants";

export function ProductsTab({
  products,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  loadTabData,
  handleSeedDatabase,
  handleOpenAddProduct,
  handleOpenEditProduct,
  handleDeleteProduct,
}) {
  return (
    <>
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Products Management</h2>
          <div style={{ fontSize: "0.8rem", color: "#8b949e", marginTop: "4px" }}>
            Manage streetwear drops, GSM details, pricing, and stock levels.
          </div>
        </div>

        <div className="admin-section-controls">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleSeedDatabase}
            title="Populates MongoDB with all 12 default Flint Sector tees"
          >
            ⚡ Seed 12 Streetwear Drops
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAddProduct}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          type="text"
          className="admin-input"
          style={{ maxWidth: "320px" }}
          placeholder="Search products by name or color..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadTabData()}
        />

        <select
          className="admin-select"
          style={{ maxWidth: "220px" }}
          value={productCategoryFilter}
          onChange={(e) => {
            setProductCategoryFilter(e.target.value);
            setTimeout(loadTabData, 50);
          }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="button" className="admin-btn-secondary" onClick={loadTabData}>
          Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="admin-table-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Original</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id || item._id}>
                    <td>
                      <div className="product-cell">
                        <img
                          src={item.frontImage}
                          alt={item.name}
                          className="product-thumb"
                        />
                        <div>
                          <div className="product-info-name">{item.name}</div>
                          <div className="product-info-cat">
                            {item.color} • {item.gsm || "240 GSM"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-tag">{item.categoryName || item.category}</span>
                    </td>
                    <td>
                      <strong>₹{item.price}</strong>
                    </td>
                    <td>₹{item.originalPrice || "—"}</td>
                    <td>{item.discount || "—"}</td>
                    <td>
                      <span
                        style={{
                          color: (item.stock || 50) < 20 ? "#ef4444" : "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        {item.stock !== undefined ? item.stock : 50} units
                      </span>
                    </td>
                    <td>
                      <div className="admin-tag-list">
                        {item.isBestseller && (
                          <span className="badge-pill badge-bestseller">BESTSELLER</span>
                        )}
                        {item.isNew && (
                          <span className="badge-pill badge-hotdrop">NEW DROP</span>
                        )}
                        {item.badge && !item.isBestseller && !item.isNew && (
                          <span className="admin-tag">{item.badge}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          className="admin-action-btn-sm"
                          onClick={() => handleOpenEditProduct(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn-sm admin-action-btn-danger"
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2.5rem" }}>
                    No products found. Click &quot;⚡ Seed 12 Streetwear Drops&quot; to load default products into MongoDB!
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

export default ProductsTab;
