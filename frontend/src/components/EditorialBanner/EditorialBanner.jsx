"use client";

import React from "react";
import { ArrowRightIcon } from "../common/Icons";
import "./EditorialBanner.css";

export const EditorialBanner = () => {
  return (
    <section className="editorial-banner-section">
      <a
        href="#bestsellers"
        className="editorial-banner-link"
        aria-label="Shop the Flint Sector collection"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&auto=format&fit=crop&q=85"
          alt="FLINT SECTOR Streetwear Editorial"
          className="editorial-banner-bg"
          loading="lazy"
        />

        <div className="editorial-banner-content">
          <span className="editorial-banner-tag">LIMITED DROP // HEAVYWEIGHT 280 GSM</span>
          <h2 className="editorial-banner-heading">CRAFTED FOR THE CULTURE</h2>
          <span className="editorial-banner-btn">
            <span>SHOP THE COLLECTION</span>
            <ArrowRightIcon size={14} />
          </span>
        </div>
      </a>
    </section>
  );
};

export default EditorialBanner;
