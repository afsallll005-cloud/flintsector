"use client";

import React, { useState } from "react";
import { CATEGORIES } from "../../data/products";
import "./ShopBycategory.css";

// 8 ticks for the authentic iOS spinner as in reference HTML
const SPINNER_TICKS = [
  { rotate: 0, delay: -1 },
  { rotate: 45, delay: -0.875 },
  { rotate: 90, delay: -0.75 },
  { rotate: 135, delay: -0.625 },
  { rotate: 180, delay: -0.5 },
  { rotate: 225, delay: -0.375 },
  { rotate: 270, delay: -0.25 },
  { rotate: 315, delay: -0.125 },
];


export const ShopBycategory = ({ onSelectCategory }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const handleClick = (cat) => {
    if (cat.status === "coming_soon") {
      alert(`${cat.name} drop is in production. Turn on notifications on our Instagram for early access!`);
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(cat.id);
    }
    const el = document.getElementById("bestsellers");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="shop-category" className="categories-section">
      <div className="categories-scroll-wrapper">
        {CATEGORIES.map((cat) => {
          const isComingSoon = cat.status === "coming_soon";
          const isHovered = hoveredCategory === cat.id;
          const displayImage = cat.images[0];

          return (
            <button
              key={cat.id}
              type="button"
              className="category-bubble-item"
              onClick={() => handleClick(cat)}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              aria-label={`${cat.name} ${isComingSoon ? "coming soon" : "category"}`}
            >
              <div className="category-circle-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImage}
                  alt={cat.name}
                  className={`category-img ${isComingSoon ? "category-img-blur" : ""}`}
                  loading="lazy"
                />

                {isComingSoon && (
                  <div className="coming-soon-overlay">
                    <div className="ios-spinner-box">
                      {SPINNER_TICKS.map((tick, i) => (
                        <span
                          key={i}
                          className="ios-spinner-tick"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "2.8px",
                            height: "8px",
                            marginLeft: "-1.4px",
                            marginTop: "-15px",
                            borderRadius: "1.4px",
                            background: "#ffffff",
                            transformOrigin: "50% 15px",
                            transform: `rotate(${tick.rotate}deg)`,
                            animationDelay: `${tick.delay}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="category-bubble-title">{cat.name}</span>
              {isComingSoon && (
                <span className="category-coming-soon-tag">Coming Soon</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ShopBycategory;
