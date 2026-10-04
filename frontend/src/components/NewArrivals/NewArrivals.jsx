"use client";

import React from "react";
import Link from "next/link";
import { PRODUCTS } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { HeartIcon } from "../common/Icons";
import "./NewArrivals.css";

export const NewArrivals = () => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
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
                <Link
                  href={`/product/${product.id}`}
                  className="product-image-container"
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
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                  >
                    <HeartIcon size={14} filled={isWishlisted} />
                  </button>
                </Link>

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
