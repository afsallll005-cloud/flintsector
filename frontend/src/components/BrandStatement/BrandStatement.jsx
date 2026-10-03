"use client";

import React from "react";
import { ArrowRightIcon } from "../common/Icons";
import "./BrandStatement.css";

export const BrandStatement = () => {
  const statement = "Built for comfort. Made for everyday.";

  return (
    <section id="brand-story" className="brand-statement-section">
      <div className="brand-statement-inner">
        <div>
          <p className="brand-number-tag">08 / Brand Statement</p>
          <div className="brand-mini-line" />
          <p className="brand-quote-desc">
            FLINT SECTOR creates everyday heavyweight essentials with clean boxy proportions, supreme comfort, and uncompromising street confidence.
          </p>
        </div>

        <div className="brand-marquee-container">
          <div className="brand-marquee-track">
            <div className="marquee-container">
              <div className="marquee-content marquee-slow">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="brand-marquee-item">
                    <span>{statement}</span>
                    <span className="brand-marquee-dot" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a href="#bestsellers" className="brand-explore-link">
            <span>Explore Collection</span>
            <ArrowRightIcon size={15} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
