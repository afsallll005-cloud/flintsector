"use client";

import React from "react";
import { REVIEWS } from "../../data/products";
import { StarIcon, BadgeCheckIcon } from "../common/Icons";
import "./Reviews.css";

export const Reviews = () => {
  return (
    <section id="customer-love" className="reviews-section">
      <div className="reviews-inner-container">
        <div className="reviews-header-block">
          <div>
            <h2 className="reviews-title">Customer Love</h2>
            <p style={{ margin: "4px 0 0", color: "#777", fontSize: "12px" }}>
              Real feedback from the streetwear community across India
            </p>
          </div>

          <div className="reviews-rating-summary">
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={14} filled={true} />
              ))}
            </div>
            <span>4.9 / 5.0 Rating (2,400+ Verified Buyers)</span>
          </div>
        </div>

        <div className="reviews-scroll-row">
          {REVIEWS.map((rev) => (
            <article key={rev.id} className="review-card-item">
              <div className="review-stars-row">
                {[...Array(rev.stars)].map((_, idx) => (
                  <StarIcon key={idx} size={14} filled={true} />
                ))}
              </div>

              <p className="review-quote-text">“{rev.text}”</p>

              {rev.product && (
                <span className="review-product-tag">Purchased: {rev.product}</span>
              )}

              <div className="review-author-footer">
                <div className="review-avatar-circle">{rev.initials}</div>
                <div>
                  <strong className="review-author-name">{rev.name}</strong>
                  <span className="review-verified-badge">
                    <BadgeCheckIcon size={12} />
                    Verified Buyer • {rev.city}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
