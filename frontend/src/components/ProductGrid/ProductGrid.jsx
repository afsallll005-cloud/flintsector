"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { PRODUCTS } from "../../data/products";
import { fetchProducts } from "../../utils/api";
import "./ProductGrid.css";

const formatPrice = (val) => {
  if (typeof val === "number") return `₹${val.toLocaleString("en-IN")}`;
  if (typeof val === "string") {
    if (val.startsWith("₹") || val.startsWith("Rs") || val.startsWith("$")) return val;
    return `₹${val}`;
  }
  return "₹0";
};

// Filter tabs available for fast browsing
const CATEGORY_TABS = [
  { id: "all", label: "ALL ITEMS" },
  { id: "outerwear", label: "OUTERWEAR" },
  { id: "tops", label: "TOPS" },
  { id: "bottoms", label: "BOTTOMS" },
];

export default function ProductGrid({ activeCategory: initialCategory = "all" }) {
  const { setQuickViewProduct } = useCart();
  const [productList, setProductList] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");

  // Keep selected category synced if parent passes new prop
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Load backend live catalog if available, fallback smoothly to PRODUCTS
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const res = await fetchProducts();
        if (isMounted && res?.products && res.products.length > 0) {
          // Merge live backend products with static products to guarantee all IDs resolve
          const backendIds = new Set(res.products.map((p) => p.id));
          const missingStatic = PRODUCTS.filter((p) => !backendIds.has(p.id));
          setProductList([...res.products, ...missingStatic]);
        }
      } catch (err) {
        // Ignore, fallback is already PRODUCTS
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products based on selected tab or active category
  const filteredProducts =
    selectedCategory === "all"
      ? productList
      : productList.filter((product) => {
          const cat = (product.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          return cat === target || cat.includes(target) || target.includes(cat);
        });

  return (
    <section id="shop" className="product-section">
      <div id="bestsellers" />

      {/* HEADER */}
      <div className="product-header">
        <div>
          <h2>All Products</h2>
          <span className="product-count">
            {filteredProducts.length} ITEMS AVAILABLE
          </span>
        </div>

        {/* CATEGORY TABS */}
        <div className="product-tabs" role="tablist" aria-label="Product categories">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === tab.id}
              className={`product-tab-btn ${
                selectedCategory === tab.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const imageSrc = product.frontImage || product.image || "/images/Product01.png";
          const productHref = `/product/${product.id}`;

          return (
            <article className="product-card" key={product.id}>
              {/* IMAGE WRAPPER */}
              <div className="product-image-wrapper">
                <Link
                  href={productHref}
                  className="product-image-link"
                  aria-label={`View details for ${product.name}`}
                >
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                </Link>

                {/* BADGE */}
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}

                {/* QUICK VIEW BUTTON */}
                <button
                  type="button"
                  className="quick-view"
                  aria-label={`Quick view ${product.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                >
                  ↗
                </button>
              </div>

              {/* DETAILS LINK */}
              <Link href={productHref} className="product-details-link">
                <div className="product-details">
                  <span className="product-category">
                    {product.categoryName || product.category?.toUpperCase()}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="product-price">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}