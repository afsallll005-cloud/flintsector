// Flint Sector Unified API Client

import { PRODUCTS } from "../data/products";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

export const API_BASE = getApiBaseUrl();

// Safe fetch wrapper with timeout
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if exists
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("flint_admin_token");
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ---------------- Backend Health ----------------
export async function checkBackendHealth() {
  try {
    const res = await request("/health", { timeout: 3500 });
    return {
      connected: true,
      mongodb: res?.mongodb === "connected",
      status: res?.status || "ok",
      details: res,
    };
  } catch (err) {
    return {
      connected: false,
      mongodb: false,
      status: "offline",
      error: err.message,
    };
  }
}

// ---------------- Products API ----------------
export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.bestseller) query.set("bestseller", "true");
    if (params.newDrop) query.set("newDrop", "true");

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await request(`/products${qs}`);
    return {
      products: res?.data || [],
      count: res?.count || 0,
      isLive: true,
    };
  } catch (err) {
    console.warn("Backend products fetch failed, using local fallback:", err.message);
    // Graceful fallback to static product catalog
    let fallbackList = [...PRODUCTS];
    if (params.category && params.category !== "all") {
      fallbackList = fallbackList.filter((p) => p.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      fallbackList = fallbackList.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.color?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return {
      products: fallbackList,
      count: fallbackList.length,
      isLive: false,
      error: err.message,
    };
  }
}

export async function fetchProductById(id) {
  try {
    const res = await request(`/products/${id}`);
    return res?.data || null;
  } catch (err) {
    const local = PRODUCTS.find((p) => p.id === id);
    return local || null;
  }
}

export async function createProduct(productData) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function updateProduct(id, productData) {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
}

export async function seedCatalog() {
  return request("/admin/seed-catalog", {
    method: "POST",
  });
}

// ---------------- Image Upload API ----------------
export async function uploadProductImage(fileOrBase64, filename = "product") {
  // If already base64 string
  let base64 = "";
  if (typeof fileOrBase64 === "string") {
    base64 = fileOrBase64;
  } else if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
    base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(fileOrBase64);
    });
  }

  // Attempt backend upload to store on server disk
  try {
    const res = await request("/upload", {
      method: "POST",
      body: JSON.stringify({ image: base64, filename }),
    });
    if (res?.url) {
      return { url: res.url, filename: res.filename, isServerUrl: true };
    }
  } catch (err) {
    console.warn("Backend /upload endpoint unavailable, using inline base64:", err.message);
  }

  // Fallback: return base64 Data URL directly
  return { url: base64, filename, isServerUrl: false };
}

// ---------------- Orders API ----------------
export async function fetchOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.search) query.set("search", params.search);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return request(`/orders${qs}`);
}

export async function fetchOrderById(id) {
  return request(`/orders/${id}`);
}

export async function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function updateOrderStatus(id, status, notes = "") {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
}

export async function deleteOrder(id) {
  return request(`/orders/${id}`, {
    method: "DELETE",
  });
}

// ---------------- Admin Auth & Stats ----------------
export async function adminLogin(username, password) {
  const res = await request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (res?.token && typeof window !== "undefined") {
    localStorage.setItem("flint_admin_token", res.token);
    localStorage.setItem("flint_admin_user", JSON.stringify(res.user));
  }

  return res;
}

export async function adminVerify() {
  return request("/admin/verify");
}

export async function fetchAdminStats() {
  return request("/admin/stats");
}

export function adminLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("flint_admin_token");
    localStorage.removeItem("flint_admin_user");
  }
}
