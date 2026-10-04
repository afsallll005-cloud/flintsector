"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  checkBackendHealth,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedCatalog,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
  adminLogin,
  adminLogout,
  fetchAdminStats,
  uploadProductImage,
  API_BASE,
} from "../../utils/api";
import "./Admin.css";

const CATEGORIES = [
  { id: "raglan-half", name: "Raglan Half" },
  { id: "raglan-full", name: "Raglan Full" },
  { id: "ringer", name: "Ringer Tees" },
  { id: "new-drops", name: "New Drops" },
  { id: "accessories", name: "Accessories" },
];

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// Dual-Mode Image Control: URL input or Local File Upload
function ImageInputControl({
  label,
  required,
  value,
  onChange,
  mode,
  setMode,
  helperText,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = React.useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP, AVIF).");
      return;
    }
    setUploading(true);
    setFileName(file.name);
    try {
      const result = await uploadProductImage(file, file.name);
      onChange(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="image-option-card">
      <div className="image-option-header">
        <div className="image-option-label">
          <span>{label}</span>
          {required && <span style={{ color: "#e63946" }}>*</span>}
        </div>
        <div className="image-mode-toggle">
          <button
            type="button"
            className={`image-mode-btn ${mode === "url" ? "active" : ""}`}
            onClick={() => setMode("url")}
          >
            🔗 Image URL
          </button>
          <button
            type="button"
            className={`image-mode-btn ${mode === "file" ? "active" : ""}`}
            onClick={() => setMode("file")}
          >
            📁 Upload File
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input
              type="url"
              className="admin-input"
              required={required && !value}
              placeholder="https://images.unsplash.com/... or image link"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            {value && (
              <img
                src={value}
                alt="Preview"
                className="image-preview-box"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>
          {helperText && <div className="stat-desc">{helperText}</div>}
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden-file-input"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />

          {!value ? (
            <div
              className={`image-dropzone ${dragOver ? "dragover" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="dropzone-icon">
                {uploading ? "⏳" : "☁️"}
              </div>
              <div className="dropzone-title">
                {uploading ? "Uploading image..." : "Click to browse or drag & drop image"}
              </div>
              <div className="dropzone-subtitle">
                Supports PNG, JPG, WEBP, AVIF up to 10MB
              </div>
            </div>
          ) : (
            <div className="image-preview-detail">
              <img
                src={value}
                alt="Uploaded Preview"
                className="image-preview-detail-img"
              />
              <div className="image-preview-info">
                <div className="image-preview-name">
                  {fileName || "Image attached"}
                </div>
                <div className="image-preview-source">
                  ✓ Ready for product catalog
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="admin-action-btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => {
                    onChange("");
                    setFileName("");
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation
  const [activeTab, setActiveTab] = useState("overview");

  // Dual Image Upload Modes
  const [frontImageMode, setFrontImageMode] = useState("url");
  const [backImageMode, setBackImageMode] = useState("url");

  // Live Backend & DB Health
  const [backendHealth, setBackendHealth] = useState({
    connected: false,
    mongodb: false,
    checking: true,
  });

  // Data states
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Filter states
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    category: "raglan-half",
    categoryName: "Raglan Half",
    price: "",
    originalPrice: "",
    discount: "30% OFF",
    frontImage: "",
    backImage: "",
    color: "",
    sizes: ["S", "M", "L", "XL"],
    badge: "BESTSELLER",
    isBestseller: true,
    isNew: false,
    gsm: "240 GSM",
    fabric: "100% Combed Cotton",
    fit: "Box-Fit Oversized",
    description: "",
    stock: 50,
  });

  // Verify Auth on mount
  useEffect(() => {
    const token = localStorage.getItem("flint_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
    runHealthCheck();
  }, []);

  // Fetch data when authenticated or active tab changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTabData();
    }
  }, [isAuthenticated, activeTab]);

  const showNotification = (text, type = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const runHealthCheck = async () => {
    setBackendHealth((prev) => ({ ...prev, checking: true }));
    const health = await checkBackendHealth();
    setBackendHealth({
      connected: health.connected,
      mongodb: health.mongodb,
      checking: false,
      error: health.error,
    });
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const statsRes = await fetchAdminStats().catch(() => null);
        if (statsRes?.data) {
          setStats(statsRes.data);
        } else {
          // Calculate from products & orders
          const prodData = await fetchProducts();
          const ordData = await fetchOrders().catch(() => ({ data: [] }));
          const ords = ordData?.data || [];
          const rev = ords.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
          setStats({
            totalProducts: prodData.count || 0,
            totalOrders: ords.length,
            pendingOrders: ords.filter((o) => o.status === "Pending").length,
            totalRevenue: rev,
            lowStockCount: (prodData.products || []).filter((p) => (p.stock || 50) < 25).length,
            recentOrders: ords.slice(0, 5),
          });
        }
      } else if (activeTab === "products") {
        const res = await fetchProducts({
          category: productCategoryFilter,
          search: productSearch,
        });
        setProducts(res.products || []);
      } else if (activeTab === "orders") {
        const res = await fetchOrders({
          status: orderStatusFilter,
          search: orderSearch,
        }).catch(() => ({ data: [] }));
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error("Tab data loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await adminLogin(usernameInput, passwordInput);
      setIsAuthenticated(true);
      showNotification("Welcome back, Admin!");
      runHealthCheck();
    } catch (err) {
      setLoginError(err.message || "Invalid admin credentials");
    }
  };

  const handleQuickLogin = () => {
    setUsernameInput("admin");
    setPasswordInput("flintsector2025");
    adminLogin("admin", "flintsector2025")
      .then(() => {
        setIsAuthenticated(true);
        showNotification("Logged in with default admin credentials");
        runHealthCheck();
      })
      .catch((err) => {
        setLoginError(err.message);
      });
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    showNotification("Logged out successfully", "info");
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFrontImageMode("url");
    setBackImageMode("url");
    setProductFormData({
      name: "",
      category: "raglan-half",
      categoryName: "Raglan Half",
      price: "",
      originalPrice: "",
      discount: "30% OFF",
      frontImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      backImage: "",
      color: "Black & Cream",
      sizes: ["S", "M", "L", "XL"],
      badge: "NEW DROP",
      isBestseller: false,
      isNew: true,
      gsm: "240 GSM",
      fabric: "100% Combed Cotton",
      fit: "Box-Fit Oversized",
      description: "Crafted for the culture. Heavyweight boxy silhouette.",
      stock: 50,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setFrontImageMode(
      prod.frontImage?.startsWith("data:") || prod.frontImage?.includes("/uploads")
        ? "file"
        : "url"
    );
    setBackImageMode(
      prod.backImage?.startsWith("data:") || prod.backImage?.includes("/uploads")
        ? "file"
        : "url"
    );
    setProductFormData({
      name: prod.name || "",
      category: prod.category || "raglan-half",
      categoryName: prod.categoryName || "",
      price: prod.price || "",
      originalPrice: prod.originalPrice || "",
      discount: prod.discount || "",
      frontImage: prod.frontImage || "",
      backImage: prod.backImage || "",
      color: prod.color || "",
      sizes: prod.sizes || ["S", "M", "L", "XL"],
      badge: prod.badge || "",
      isBestseller: Boolean(prod.isBestseller),
      isNew: Boolean(prod.isNew),
      gsm: prod.gsm || "240 GSM",
      fabric: prod.fabric || "100% Combed Cotton",
      fit: prod.fit || "Box-Fit Oversized",
      description: prod.description || "",
      stock: prod.stock !== undefined ? prod.stock : 50,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productFormData);
        showNotification(`Updated "${productFormData.name}" successfully!`);
      } else {
        await createProduct(productFormData);
        showNotification(`Created "${productFormData.name}" successfully!`);
      }
      setIsProductModalOpen(false);
      loadTabData();
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      showNotification(`Deleted "${name}"`, "info");
      loadTabData();
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleSeedDatabase = async () => {
    if (
      !window.confirm(
        "This will import / reset all 12 core Flint Sector streetwear tees into MongoDB Atlas. Proceed?"
      )
    ) {
      return;
    }

    try {
      const res = await seedCatalog();
      showNotification(res.message || "Catalog successfully synced to MongoDB!");
      loadTabData();
      runHealthCheck();
    } catch (err) {
      alert(`Seeding failed: ${err.message}. Make sure backend is running on port 5000.`);
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotification(`Order status updated to ${newStatus}`);
      loadTabData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId, orderRef) => {
    if (!window.confirm(`Delete order ${orderRef}?`)) return;
    try {
      await deleteOrder(orderId);
      showNotification(`Deleted order ${orderRef}`, "info");
      loadTabData();
    } catch (err) {
      alert(`Failed to delete order: ${err.message}`);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-login-screen">
        <div style={{ color: "#fff", letterSpacing: "2px" }}>LOADING ADMIN OPS...</div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-logo">
            FLINT<span>SECTOR</span>
          </div>
          <div className="admin-login-subtitle">
            Operations & Control Portal
          </div>

          {loginError && <div className="admin-error-banner">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="admin-form-group">
              <label>Admin Username</label>
              <input
                type="text"
                className="admin-input"
                placeholder="admin"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Secret Password</label>
              <input
                type="password"
                className="admin-input"
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-login-btn">
              Authenticate
            </button>
          </form>

          <button
            type="button"
            className="admin-quick-fill-btn"
            onClick={handleQuickLogin}
          >
            ⚡ Quick Demo Login (admin / flintsector2025)
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="flint-admin-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <Link href="/Admin" className="admin-nav-logo">
            FLINT<span>SECTOR</span> // OPS
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

      {/* Tabs navigation */}
      <nav className="admin-tabs-bar">
        <button
          type="button"
          className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          👕 Products ({products.length > 0 ? products.length : stats.totalProducts})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders ({orders.length > 0 ? orders.length : stats.totalOrders})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "diagnostics" ? "active" : ""}`}
          onClick={() => setActiveTab("diagnostics")}
        >
          ⚡ Connection & API
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="admin-container">
        {feedbackMsg && (
          <div
            className={`admin-alert-box ${
              feedbackMsg.type === "info" ? "" : "alert-success"
            }`}
          >
            <div>
              <div className="admin-alert-title">System Notification</div>
              <div className="admin-alert-text">{feedbackMsg.text}</div>
            </div>
          </div>
        )}

        {/* Offline Warning Banner */}
        {!backendHealth.connected && (
          <div className="admin-alert-box alert-warning">
            <div>
              <div className="admin-alert-title">
                ⚠️ Backend Server is Not Connected
              </div>
              <div className="admin-alert-text">
                Your frontend is trying to connect to <code>{API_BASE}</code>.
                To start the backend, open a terminal in <code>backend/</code> and run:{" "}
                <strong><code>npm run dev</code></strong>. Data is currently displayed via fallback.
              </div>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={runHealthCheck}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === "overview" && (
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
        )}

        {/* ================= TAB: PRODUCTS ================= */}
        {activeTab === "products" && (
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
        )}

        {/* ================= TAB: ORDERS ================= */}
        {activeTab === "orders" && (
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
        )}

        {/* ================= TAB: DIAGNOSTICS ================= */}
        {activeTab === "diagnostics" && (
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" }}>
                <span
                  className="status-dot"
                  style={{
                    background: backendHealth.mongodb ? "#10b981" : "#ef4444",
                    boxShadow: backendHealth.mongodb ? "0 0 10px #10b981" : "0 0 10px #ef4444",
                  }}
                />
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
                  {backendHealth.mongodb ? "Atlas Connected Successfully" : "Database Disconnected / Connecting"}
                </span>
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
        )}
      </main>

      {/* ================= PRODUCT ADD/EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Streetwear Drop"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsProductModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="admin-form-group">
                <label>Product Title / Name</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="e.g. Raglan Half Sleeve Forest Green"
                  value={productFormData.name}
                  onChange={(e) =>
                    setProductFormData({ ...productFormData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select
                    className="admin-select"
                    value={productFormData.category}
                    onChange={(e) => {
                      const found = CATEGORIES.find((c) => c.id === e.target.value);
                      setProductFormData({
                        ...productFormData,
                        category: e.target.value,
                        categoryName: found ? found.name : e.target.value,
                      });
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Color Accent</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Green & Cream"
                    value={productFormData.color}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Selling Price (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    required
                    placeholder="699"
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="999"
                    value={productFormData.originalPrice}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Discount Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="30% OFF"
                    value={productFormData.discount}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        discount: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Stock Units</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="50"
                    value={productFormData.stock}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Fabric / GSM</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="240 GSM Combed Cotton"
                    value={productFormData.gsm}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, gsm: e.target.value })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Silhouette / Fit</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Box-Fit Oversized"
                    value={productFormData.fit}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, fit: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Dual-Option Front Image (URL / File Upload) */}
              <ImageInputControl
                label="Front Image"
                required={true}
                value={productFormData.frontImage}
                mode={frontImageMode}
                setMode={setFrontImageMode}
                onChange={(val) =>
                  setProductFormData({ ...productFormData, frontImage: val })
                }
                helperText="Select 'Image URL' to link an image or 'Upload File' to upload from your PC."
              />

              {/* Dual-Option Back Image (URL / File Upload) */}
              <ImageInputControl
                label="Back Image (Optional)"
                required={false}
                value={productFormData.backImage}
                mode={backImageMode}
                setMode={setBackImageMode}
                onChange={(val) =>
                  setProductFormData({ ...productFormData, backImage: val })
                }
                helperText="Secondary angle or back design shot."
              />

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  className="admin-textarea"
                  placeholder="Signature two-tone Raglan cut featuring heavy ribbed collar..."
                  value={productFormData.description}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isBestseller}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        isBestseller: e.target.checked,
                      })
                    }
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={productFormData.isNew}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        isNew: e.target.checked,
                      })
                    }
                  />
                  <span>Mark as New Drop</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
