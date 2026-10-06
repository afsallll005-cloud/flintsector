"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { HeartIcon } from "../common/Icons";
import "./Bestsellers.css";

const CATEGORY_TABS = [
  { id: "all", label: "All Drops" },
  { id: "raglan-half", label: "Raglan Half" },
  { id: "raglan-full", label: "Raglan Full" },
  { id: "ringer", label: "Ringer Tees" },
  { id: "new-drops", label: "New Season" },
];

export const Bestsellers = ({ activeCategory = "all", onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState(activeCategory);
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const filteredProducts = PRODUCTS.filter((item) => {
    if (selectedTab === "all") return true;
    return item.category === selectedTab;
  });

  return (
    <section id="bestsellers" className="bestsellers-section">
      <div className="bestsellers-header-row">
        <h2 className="bestsellers-title">Best Sellers & Drops</h2>

        <div className="filter-tab-pill-list">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-pill ${selectedTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.some((item) => item.id === product.id);

          return (
            <div key={product.id} className="product-card">
              <Link
                href={`/product/${product.id}`}
                className="product-image-container"
                title={`View ${product.name}`}
              >
                {/* Dual Image Hover Flip */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.frontImage}
                  alt={product.name}
                  className="product-img-front"
                  loading="lazy"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.backImage}
                  alt={`${product.name} back view`}
                  className="product-img-back"
                  loading="lazy"
                />

                {/* Badge Tag */}
                {product.badge && (
                  <span className="product-badge-tag">{product.badge}</span>
                )}

                {/* Wishlist Button */}
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="product-wishlist-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                >
                  <HeartIcon size={14} filled={isWishlisted} />
                </button>

                {/* Quick Size Selector on Hover */}
                <div
                  className="quick-size-hover-bar"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "#888", marginRight: "4px" }}>
                    QUICK SIZE:
                  </span>
                  {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className="size-pill-mini"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, sz, 1);
                      }}
                      title={`Add size ${sz}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </Link>

              {/* Product Info */}
              <div className="product-info-row">
                <div style={{ minWidth: 0 }}>
                  <Link href={`/product/${product.id}`} className="product-title">
                    {product.name}
                  </Link>
                  <div className="product-price-box">
                    <span className="price-current">
                      Rs. {product.price.toFixed(2)}
                    </span>
                    <span className="price-original">
                      Rs. {product.originalPrice.toFixed(2)}
                    </span>
                    <span className="price-discount-tag">
                      {product.discount}
                    </span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <button
                  type="button"
                  aria-label={`Quick add ${product.name}`}
                  className="quick-add-btn"
                  onClick={() => addToCart(product, "L", 1)}
                  title="Quick add size L to bag"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Bestsellers;
