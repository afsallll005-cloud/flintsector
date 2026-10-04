"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { PRODUCTS } from "../../data/products";
import { SearchIcon, XIcon } from "../common/Icons";
import "./SearchModal.css";

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.color.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 4);

  const handleSelect = (product) => {
    setIsSearchOpen(false);
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="search-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <SearchIcon size={22} />
          <input
            type="text"
            autoFocus
            placeholder="Search oversized tees, raglan, ringer..."
            className="search-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            aria-label="Close search"
            className="icon-btn"
            onClick={() => setIsSearchOpen(false)}
          >
            <XIcon size={18} />
          </button>
        </div>

        <div style={{ marginTop: "14px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#888" }}>
          {query.trim() ? `Search Results (${results.length})` : "Trending Drops"}
        </div>

        <div className="search-results-list">
          {results.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", padding: "30px 0", fontSize: "13px" }}>
              No matches found for &quot;{query}&quot;. Try searching &quot;Raglan&quot; or &quot;Ringer&quot;.
            </p>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="search-item-card"
                onClick={() => handleSelect(product)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.frontImage}
                  alt={product.name}
                  className="search-item-thumb"
                />
                <div style={{ flex: 1 }}>
                  <h4 className="search-item-title">{product.name}</h4>
                  <div className="search-item-meta">
                    {product.gsm} • {product.color}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: "#111" }}>
                    Rs. {product.price}
                  </span>
                  <div style={{ fontSize: "10px", color: "#d12b2b", fontWeight: 700 }}>
                    {product.discount}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
