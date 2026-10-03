"use client";

import React from "react";
import { ACCESSORIES } from "../../data/products";
import { useCart } from "../../context/CartContext";
import "./Accessories.css";

export const Accessories = () => {
  const { showToast } = useCart();

  const handleAccessoryClick = (item) => {
    showToast(`${item.name} capsule drop coming soon!`, "info");
  };

  return (
    <section className="accessories-section">
      <h2 className="accessories-heading">Accessories</h2>

      <div className="accessories-grid">
        {ACCESSORIES.map((item) => (
          <div
            key={item.id}
            className="accessory-card"
            onClick={() => handleAccessoryClick(item)}
            title={`View ${item.name}`}
          >
            <div className="accessory-img-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="accessory-img"
                loading="lazy"
              />
            </div>
            <span className="accessory-label">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accessories;
