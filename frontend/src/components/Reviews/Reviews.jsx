"use client";

import React from "react";
import "./Reviews.css";

const reviews = [
  {
    rating: "★★★★★",
    review:
      "The fit is exactly what I was looking for. The quality feels premium and the details are really clean.",
    name: "Afsal",
    verified: "VERIFIED BUYER",
    product: "Oversized Essential Tee",
  },
  {
    rating: "★★★★★",
    review:
      "Really impressed with the fabric and overall finish. Looks even better in person.",
    name: "Rihan K.",
    verified: "VERIFIED BUYER",
    product: "Shadow Cargo Trouser",
  },
  {
    rating: "★★★★★",
    review:
      "Minimal, comfortable and stylish. Definitely one of my favourite pieces right now.",
    name: "sahan",
    verified: "VERIFIED BUYER",
    product: "Obsidian Hoodie",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="reviews-section">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="reviews-header">

        <div className="reviews-heading-wrap">

          <span className="reviews-eyebrow">
            FLINT SECTOR / COMMUNITY
          </span>

          <h2>
            What they’re
            <br />
            <span>saying.</span>
          </h2>

        </div>


        {/* RATING SUMMARY */}

        <div className="reviews-summary">

          <strong>4.9</strong>

          <div className="reviews-summary-info">

            <div className="summary-stars">
              ★★★★★
            </div>

            <span>
              BASED ON 120+ REVIEWS
            </span>

          </div>

        </div>

      </div>


      {/* =====================================
          REVIEWS
      ====================================== */}

      <div className="reviews-grid">

        {reviews.map((review, index) => (

          <article
            className="review-card"
            key={review.name}
          >

            {/* TOP */}

            <div className="review-top">

              <div className="review-stars">
                {review.rating}
              </div>

              <span className="review-number">
                0{index + 1}
              </span>

            </div>


            {/* REVIEW */}

            <p className="review-text">
              “{review.review}”
            </p>


            {/* FOOTER */}

            <div className="review-footer">

              <div className="review-author">

                <div className="review-avatar">
                  {review.name.charAt(0)}
                </div>

                <div className="review-author-info">

                  <h3>
                    {review.name}
                  </h3>

                  <span>
                    {review.verified}
                  </span>

                </div>

              </div>


              <div className="review-product">
                {review.product}
              </div>

            </div>

          </article>

        ))}

      </div>


      {/* =====================================
          BOTTOM
      ====================================== */}

      <div className="reviews-bottom">

        <span>
          YOUR STYLE. YOUR STORY.
        </span>

        <a href="#reviews">
          <span>READ ALL REVIEWS</span>
          <b>↗</b>
        </a>

      </div>

    </section>
  );
}