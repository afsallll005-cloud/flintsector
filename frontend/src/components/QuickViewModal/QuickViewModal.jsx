"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { XIcon, ShoppingBagIcon } from "../common/Icons";
import "./QuickViewModal.css";

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("L");
  const [activeView, setActiveView] = useState("front"); // 'front' or 'back'

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedSize, 1);
    setQuickViewProduct(null);
  };

  const imageSrc =
    activeView === "front"
      ? quickViewProduct.frontImage
      : quickViewProduct.backImage;

  return (
    <div
      className="quickview-backdrop"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="quickview-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close product preview"
          className="quickview-close-btn"
          onClick={() => setQuickViewProduct(null)}
        >
          <XIcon size={16} />
        </button>

        {/* Gallery Column */}
        <div className="quickview-gallery-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={quickViewProduct.name}
            className="quickview-main-img"
          />

          <div className="quickview-view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${activeView === "front" ? "active" : ""}`}
              onClick={() => setActiveView("front")}
            >
              Front
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${activeView === "back" ? "active" : ""}`}
              onClick={() => setActiveView("back")}
            >
              Back
            </button>
          </div>
        </div>

        {/* Details Column */}
        <div className="quickview-details-side">
          <div className="quickview-badge-bar">
            {quickViewProduct.badge && (
              <span className="quickview-badge">{quickViewProduct.badge}</span>
            )}
            <span className="quickview-gsm-badge">{quickViewProduct.gsm}</span>
            <span className="quickview-gsm-badge">{quickViewProduct.color}</span>
          </div>

          <h2 className="quickview-title">{quickViewProduct.name}</h2>

          <div className="quickview-price-row">
            <span className="quickview-current-price">
              Rs. {quickViewProduct.price.toFixed(2)}
            </span>
            <span className="quickview-old-price">
              Rs. {quickViewProduct.originalPrice.toFixed(2)}
            </span>
            <span className="quickview-discount">
              {quickViewProduct.discount}
            </span>
          </div>

          <p className="quickview-desc">{quickViewProduct.description}</p>

          <div className="quickview-section-label">
            <span>Select Size (Box-Fit)</span>
            <span style={{ color: "#777", textTransform: "none", fontSize: "11px" }}>
              True to Streetwear Size
            </span>
          </div>

          <div className="quickview-size-selector">
            {(quickViewProduct.sizes || ["S", "M", "L", "XL"]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`quickview-size-btn ${selectedSize === sz ? "active" : ""}`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="quickview-specs-box">
            <div>
              <strong>Fabric:</strong> {quickViewProduct.fabric}
            </div>
            <div>
              <strong>Silhouette:</strong> {quickViewProduct.fit}
            </div>
            <div>
              <strong>Care:</strong> Cold machine wash inside-out, tumble dry low
            </div>
          </div>

          <button
            type="button"
            className="quickview-add-btn"
            onClick={handleAdd}
          >
            <ShoppingBagIcon size={16} />
            <span>ADD TO BAG • RS. {quickViewProduct.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
