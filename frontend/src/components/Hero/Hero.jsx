"use client";

import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "../common/Icons";
import "./Hero.css";

const HERO_SLIDES = [
  {
    id: 1,
    title: "HEAVYWEIGHT OVERSIZED",
    tagline: "CRAFTED FOR THE CULTURE // 240+ GSM",
    description:
      "Structured boxy silhouettes engineered with heavy combed compact cotton and retro contrast finishes.",
    image:
      "./images/bg02.png",
    badge: "DROP 04 / ACTIVE",
    linkText: "SHOP THE DROP",
    target: "#bestsellers",
  },
  {
    id: 2,
    title: "TWO-TONE RAGLAN EDIT",
    tagline: "VINTAGE BASEBALL PROPORTIONS // BIO-WASHED",
    description:
      "Contrasting sleeves, reinforced collar ribbing, and relaxed shoulder drape for an effortless street look.",
    image:
      "./images/bg04.png",
    badge: "TRENDING NOW",
    linkText: "EXPLORE RAGLAN",
    target: "#shop-category",
  },
  {
    id: 3,
    title: "ARCHIVE RINGER TEES",
    tagline: "90s TRACK HERITAGE // CRISP COLLAR FIT",
    description:
      "Thick ribbing that maintains its structure wash after wash. Made in India for the modern streetwear era.",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1800&auto=format&fit=crop&q=85",
    badge: "LIMITED EDITION",
    linkText: "VIEW COLLECTION",
    target: "#bestsellers",
  },
];

const SUB_TICKER_ITEMS = [
  "FLINT SECTOR",
  "240+ GSM HEAVYWEIGHT",
  "BOX-FIT OVERSIZED",
  "MADE FOR THE CULTURE",
  "LIMITED DROPS",
  "NATIONWIDE SHIPPING",
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <>
      <section className="hero-section">
        {/* Background Slides */}
        <div className="hero-background">
          {HERO_SLIDES.map((item, index) => (
            <div
              key={item.id}
              className={`hero-slide ${
                index === currentSlide ? "active" : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="hero-image"
                loading={index === 0 ? "eager" : "lazy"}
              />

              <div className="hero-image-overlay" />
            </div>
          ))}
        </div>

        {/* Top Meta */}
        {/* <div className="hero-top-meta">
          <span>01 — 03</span>

          <span className="hero-top-line" />

          <span>NEW SEASON / 2026</span>
        </div> */}

        {/* Main Content */}
        <div className="hero-content">
          <div className="hero-copy">
            {/* <div className="hero-drop-badge">
              <span className="hero-badge-dot" />
              <span>{slide.badge}</span>
            </div> */}

            <div className="hero-title-wrap">
              <span className="hero-eyebrow">{slide.tagline}</span>

              <h1 className="hero-title">{slide.title}</h1>
            </div>

            <p className="hero-description">{slide.description}</p>

            <div className="hero-btn-group">
              <a href={slide.target} className="hero-primary-btn">
                <span>{slide.linkText}</span>

                <span className="hero-arrow">
                  <ArrowRightIcon size={15} />
                </span>
              </a>

              <a href="#shop-category" className="hero-secondary-btn">
                BROWSE CATEGORIES
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Information */}
        {/* <div className="hero-bottom">
          <div className="hero-scroll">
            <span className="scroll-line" />
            <span>SCROLL TO EXPLORE</span>
          </div>

          <div className="hero-slide-counter">
            <span className="counter-current">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>

            <span className="counter-divider">/</span>

            <span>03</span>
          </div>
        </div> */}

        {/* Slide Navigation */}
        <div className="hero-indicators">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`hero-indicator ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <span>0{index + 1}</span>
              <span className="indicator-line" />
            </button>
          ))}
        </div>
      </section>

      {/* Modern Ticker */}
      <div className="sub-ticker-bar">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...SUB_TICKER_ITEMS, ...SUB_TICKER_ITEMS].map(
              (text, index) => (
                <span className="sub-ticker-item" key={index}>
                  {text}

                  <span className="ticker-star">✦</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;