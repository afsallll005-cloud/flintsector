
"use client";

import React from "react";
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
          src="/images/add.jpg"
          alt="FLINT SECTOR Streetwear Editorial"
          className="editorial-banner-bg"
          loading="lazy"
        />

        <div className="editorial-banner-overlay" />

        <div className="editorial-banner-content">
          <div className="editorial-banner-eyebrow">
            <span className="eyebrow-line" />
            <span>FLINT SECTOR / 01</span>
            <span className="eyebrow-line" />
          </div>

          <h2 className="editorial-banner-heading">
            CRAFTED
            <br />
            FOR THE CULTURE
          </h2>

          <div className="editorial-banner-bottom">
            <span className="editorial-banner-description">
              HEAVYWEIGHT ESSENTIALS
              <br />
              BUILT FOR EVERYDAY MOVEMENT
            </span>

            <span className="editorial-banner-btn">
              <span>SHOP COLLECTION</span>
              <span className="editorial-arrow">↗</span>
            </span>
          </div>
        </div>
      </a>
    </section>
  );
};

export default EditorialBanner;
