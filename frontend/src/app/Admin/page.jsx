"use client";

import React, { useState, useEffect } from "react";
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
  API_BASE,
} from "../../utils/api";
import "./Admin.css";
import {
  AdminLogin,
  AdminNavbar,
  AdminTabs,
  OverviewTab,
  ProductsTab,
  OrdersTab,
  DiagnosticsTab,
  ProductModal,
} from "./components";

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
    category: "outerwear",
    categoryName: "Outerwear",
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
      category: "outerwear",
      categoryName: "Outerwear",
      price: "",
      originalPrice: "",
      discount: "25% OFF",
      frontImage: "/images/Product01.png",
      backImage: "",
      color: "Mocha Brown",
      sizes: ["S", "M", "L", "XL"],
      badge: "NEW DROP",
      isBestseller: false,
      isNew: true,
      gsm: "380 GSM Heavy Suede",
      fabric: "Premium Heavyweight Fabric",
      fit: "Box-Fit Oversized",
      description: "Crafted for the culture. Heavyweight boxy silhouette.",
      stock: 30,
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
      category: prod.category || "outerwear",
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
      <AdminLogin
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        loginError={loginError}
        handleLogin={handleLogin}
        handleQuickLogin={handleQuickLogin}
      />
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="flint-admin-wrapper">
      {/* Top Navbar */}
      <AdminNavbar
        backendHealth={backendHealth}
        runHealthCheck={runHealthCheck}
        handleLogout={handleLogout}
      />

      {/* Tabs navigation */}
      <AdminTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length > 0 ? products.length : stats.totalProducts}
        orderCount={orders.length > 0 ? orders.length : stats.totalOrders}
      />

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

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            handleOpenAddProduct={handleOpenAddProduct}
            handleSeedDatabase={handleSeedDatabase}
            setActiveTab={setActiveTab}
          />
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            productCategoryFilter={productCategoryFilter}
            setProductCategoryFilter={setProductCategoryFilter}
            loadTabData={loadTabData}
            handleSeedDatabase={handleSeedDatabase}
            handleOpenAddProduct={handleOpenAddProduct}
            handleOpenEditProduct={handleOpenEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            loadTabData={loadTabData}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleDeleteOrder={handleDeleteOrder}
          />
        )}

        {/* DIAGNOSTICS TAB */}
        {activeTab === "diagnostics" && (
          <DiagnosticsTab
            backendHealth={backendHealth}
            runHealthCheck={runHealthCheck}
          />
        )}
      </main>

      {/* PRODUCT ADD/EDIT MODAL */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        productFormData={productFormData}
        setProductFormData={setProductFormData}
        frontImageMode={frontImageMode}
        setFrontImageMode={setFrontImageMode}
        backImageMode={backImageMode}
        setBackImageMode={setBackImageMode}
        handleSaveProduct={handleSaveProduct}
      />
    </div>
  );
}
