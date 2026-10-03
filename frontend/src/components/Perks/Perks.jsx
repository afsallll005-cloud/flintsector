"use client";

import React from "react";
import {
  BadgeCheckIcon,
  TruckIcon,
  MessageCircleIcon,
  PackageCheckIcon,
} from "../common/Icons";
import "./Perks.css";

export const Perks = () => {
  return (
    <section aria-label="Why shop with Flint Sector" className="perks-section">
      <div className="perks-grid">
        {/* Quality Checked */}
        <div className="perk-item">
          <span className="perk-icon-circle" aria-hidden="true">
            <BadgeCheckIcon size={18} />
          </span>
          <span className="perk-text-content">
            <strong className="perk-title">Quality Checked</strong>
            <span className="perk-description">
              Every FLINT SECTOR piece is individually reviewed before dispatch.
            </span>
          </span>
        </div>

        {/* Shipping Across India */}
        <div className="perk-item">
          <span className="perk-icon-circle" aria-hidden="true">
            <TruckIcon size={18} />
          </span>
          <span className="perk-text-content">
            <strong className="perk-title">Shipping Across India</strong>
            <span className="perk-description">
              Orders are prepared carefully for express nationwide delivery.
            </span>
          </span>
        </div>

        {/* WhatsApp Support */}
        <a
          href="https://wa.me/919605300701"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Support: Get quick help with products, sizes and your order."
          className="perk-item"
        >
          <span className="perk-icon-circle" aria-hidden="true">
            <MessageCircleIcon size={18} />
          </span>
          <span className="perk-text-content">
            <strong className="perk-title">WhatsApp Support</strong>
            <span className="perk-description">
              Get quick help with styling, sizes and your order status.
            </span>
          </span>
        </a>

        {/* Careful Packaging */}
        <div className="perk-item">
          <span className="perk-icon-circle" aria-hidden="true">
            <PackageCheckIcon size={18} />
          </span>
          <span className="perk-text-content">
            <strong className="perk-title">Careful Packaging</strong>
            <span className="perk-description">
              Your order is packed securely in custom zip-lock streetwear pouches.
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default Perks;
