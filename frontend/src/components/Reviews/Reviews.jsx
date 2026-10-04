"use client";

import React from "react";
import { REVIEWS } from "../../data/products";
import { StarIcon, BadgeCheckIcon } from "../common/Icons";
import "./Reviews.css";

export const Reviews = () => {
  return (
    <section id="customer-love" className="reviews-section">
      <div className="reviews-inner-container">

        {/* Header */}
        <div className="reviews-header-block">
          <div className="reviews-heading-group">
            <span className="reviews-eyebrow">
              THE COMMUNITY
            </span>

            <h2 className="reviews-title">
              Customer Love
            </h2>

            <p className="reviews-subtitle">
              Real feedback from the streetwear community across India.
            </p>
          </div>

          {/* Rating Summary */}
          <div className="reviews-rating-summary">
            <div className="reviews-rating-stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  size={14}
                  filled={true}
                />
              ))}
            </div>

            <div className="reviews-rating-info">
              <strong>4.9</strong>
              <span>/ 5.0</span>
            </div>

            <span className="reviews-rating-buyers">
              2,400+ Verified Buyers
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-scroll-row">
          {REVIEWS.map((rev) => (
            <article
              key={rev.id}
              className="review-card-item"
            >
              {/* Stars */}
              <div className="review-stars-row">
                {[...Array(rev.stars)].map((_, idx) => (
                  <StarIcon
                    key={idx}
                    size={13}
                    filled={true}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="review-quote-text">
                “{rev.text}”
              </p>

              {/* Product */}
              {rev.product && (
                <span className="review-product-tag">
                  Purchased: {rev.product}
                </span>
              )}

              {/* Author */}
              <div className="review-author-footer">
                <div className="review-avatar-circle">
                  {rev.initials}
                </div>

                <div className="review-author-info">
                  <strong className="review-author-name">
                    {rev.name}
                  </strong>

                  <span className="review-verified-badge">
                    <BadgeCheckIcon size={12} />
                    <span>Verified Buyer</span>
                    <span className="review-dot">•</span>
                    <span>{rev.city}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="reviews-scroll-hint">
          <span>SWIPE TO EXPLORE</span>
          <span className="reviews-scroll-line"></span>
        </div>

      </div>
    </section>
  );
};

export default Reviews;