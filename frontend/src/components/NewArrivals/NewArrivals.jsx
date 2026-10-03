"use client";

import React from "react";
import { PRODUCTS } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { HeartIcon } from "../common/Icons";
import "./NewArrivals.css";

export const NewArrivals = () => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct } = useCart();
  const newProducts = PRODUCTS.filter((p) => p.isNew);

  return (
    <section className="new-arrivals-section">
      <div className="new-arrivals-inner">
        <div className="new-arrivals-header">
          <div>
            <h2 className="new-arrivals-title">New Season Drops</h2>
            <p style={{ margin: "4px 0 0", color: "#777", fontSize: "12px" }}>
              280 GSM French Terry & Limited Heavy Box Silhouettes
            </p>
          </div>
          <a
            href="#bestsellers"
            style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#111" }}
          >
            View All →
          </a>
        </div>

        <div className="product-grid">
          {newProducts.map((product) => {
            const isWishlisted = wishlist.some((item) => item.id === product.id);

            return (
              <div key={product.id} className="product-card">
                <div
                  className="product-image-container"
                  onClick={() => setQuickViewProduct(product)}
                >
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
                    alt={product.name}
                    className="product-img-back"
                    loading="lazy"
                  />
                  <span className="product-badge-tag">{product.badge}</span>

                  <button
                    type="button"
                    aria-label="Wishlist"
                    className="product-wishlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                  >
                    <HeartIcon size={14} filled={isWishlisted} />
                  </button>
                </div>

                <div className="product-info-row">
                  <div style={{ minWidth: 0 }}>
                    <p
                      className="product-title"
                      onClick={() => setQuickViewProduct(product)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </p>
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

                  <button
                    type="button"
                    className="quick-add-btn"
                    onClick={() => addToCart(product, "L", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
