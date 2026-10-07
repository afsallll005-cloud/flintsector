"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { PRODUCTS } from "../../data/products";
import { SearchIcon, XIcon } from "../common/Icons";
import "./SearchModal.css";

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();

  const [query, setQuery] = useState("");

  const router = useRouter();

  /* =========================================
     CLOSE WITH ESC + LOCK BODY SCROLL
  ========================================= */

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSearchOpen, setIsSearchOpen]);

  /* =========================================
     SEARCH RESULTS
  ========================================= */

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? PRODUCTS.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const category =
          product.categoryName?.toLowerCase() || "";
        const color = product.color?.toLowerCase() || "";

        return (
          name.includes(normalizedQuery) ||
          category.includes(normalizedQuery) ||
          color.includes(normalizedQuery)
        );
      })
    : PRODUCTS.slice(0, 6);

  /* =========================================
     SELECT PRODUCT
  ========================================= */

  const handleSelect = (product) => {
    setIsSearchOpen(false);
    setQuery("");

    router.push(`/product/${product.id}`);
  };

  /* =========================================
     CLOSE
  ========================================= */

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="search-backdrop"
      onClick={handleClose}
    >
      <div
        className="search-modal-box"
        onClick={(event) => event.stopPropagation()}
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="search-top">

          <div className="search-label">
            SEARCH
          </div>

          <button
            type="button"
            className="search-close"
            onClick={handleClose}
            aria-label="Close search"
          >
            <XIcon size={18} />
          </button>

        </div>

        {/* =====================================
            SEARCH INPUT
        ===================================== */}

        <div className="search-input-wrapper">

          <SearchIcon
            size={21}
            className="search-main-icon"
          />

          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search products..."
            className="search-field"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <XIcon size={14} />
            </button>
          )}

        </div>

        {/* =====================================
            SEARCH META
        ===================================== */}

        <div className="search-meta">

          <div className="search-meta-title">
            {normalizedQuery
              ? "SEARCH RESULTS"
              : "TRENDING DROPS"}
          </div>

          {normalizedQuery && (
            <div className="search-count">
              {results.length}{" "}
              {results.length === 1
                ? "RESULT"
                : "RESULTS"}
            </div>
          )}

        </div>

        {/* =====================================
            RESULTS
        ===================================== */}

        <div className="search-results-list">

          {results.length === 0 ? (
            <div className="search-empty">

              <div className="search-empty-icon">
                ×
              </div>

              <h3>
                NO MATCHES FOUND
              </h3>

              <p>
                We couldn't find anything for
                <strong> "{query}"</strong>
              </p>

              <span>
                Try searching for jackets, hoodies,
                trousers or cargo.
              </span>

            </div>
          ) : (
            results.map((product, index) => (

              <button
                key={product.id}
                type="button"
                className="search-item-card"
                onClick={() =>
                  handleSelect(product)
                }
              >

                {/* PRODUCT NUMBER */}

                <span className="search-item-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* PRODUCT IMAGE */}

                <div className="search-item-image">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.frontImage}
                    alt={product.name}
                  />

                </div>

                {/* PRODUCT INFORMATION */}

                <div className="search-item-info">

                  <h4 className="search-item-title">
                    {product.name}
                  </h4>

                  <div className="search-item-meta">
                    <span>
                      {product.categoryName}
                    </span>

                    <span className="meta-dot">
                      •
                    </span>

                    <span>
                      {product.color}
                    </span>
                  </div>

                </div>

                {/* PRICE */}

                <div className="search-item-price">

                  <strong>
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {product.discount && (
                    <span>
                      {product.discount}
                    </span>
                  )}

                </div>

                {/* ARROW */}

                <span className="search-item-arrow">
                  ↗
                </span>

              </button>

            ))
          )}

        </div>

        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="search-footer">

          <span>
            PRESS ESC TO CLOSE
          </span>

          <span>
            FLINT SECTOR / SEARCH
          </span>

        </div>

      </div>
    </div>
  );
};

export default SearchModal;