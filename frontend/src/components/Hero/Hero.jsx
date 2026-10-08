"use client";

import React, { useEffect, useState } from "react";
import "./Hero.css";

const slides = [
  {
    desktop: "/images/laptop-hero01.png",
    mobile: "/images/hero-mob01.png",
    eyebrow: "FLINT SECTOR / 01",
    title: (
      <>
        WEAR
        <br />
        <span>YOUR</span>
        <br />
        IDENTITY.
      </>
    ),
    description:
      "Modern essentials built for movement, individuality and everyday expression.",
    button: "SHOP COLLECTION",
  },
  {
    desktop: "/images/laptop-hero02.png",
    mobile: "/images/hero-mob02.png",
    eyebrow: "FLINT SECTOR / 02",
    title: (
      <>
        BUILT
        <br />
        <span>FOR</span>
        <br />
        MOTION.
      </>
    ),
    description:
      "Designed with purpose. Crafted for everyday movement and effortless style.",
    button: "EXPLORE DROP",
  },
  {
    desktop: "/images/laptop-hero03.png",
    mobile: "/images/hero-mob03.png",
    eyebrow: "FLINT SECTOR / 03",
    title: (
      <>
        DEFINE
        <br />
        <span>YOUR</span>
        <br />
        STYLE.
      </>
    ),
    description:
      "Essential pieces made to become part of your everyday uniform.",
    button: "VIEW COLLECTION",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* =====================================
     AUTO SLIDE
  ====================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================
     NEXT
  ====================================== */

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  /* =====================================
     PREVIOUS
  ====================================== */

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const slide = slides[currentSlide];

  return (
    <section className="hero-section">

      {/* =====================================
          SLIDES
      ====================================== */}

      {slides.map((item, index) => (
        <picture
          key={index}
          className={`hero-slide ${
            index === currentSlide ? "active" : ""
          }`}
        >

          {/* Mobile Image */}
          <source
            media="(max-width: 650px)"
            srcSet={item.mobile}
          />

          {/* Desktop / Laptop Image */}
          <img
            src={item.desktop}
            alt={`Flint Sector collection ${index + 1}`}
            className="hero-image"
          />

        </picture>
      ))}


      {/* =====================================
          OVERLAY
      ====================================== */}

      <div className="hero-overlay" />


      {/* =====================================
          TOP INFORMATION
      ====================================== */}

    


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="hero-content">

        <div className="hero-eyebrow">

          <span className="hero-line" />

          <span>
            {slide.eyebrow}
          </span>

        </div>


        <h1 className="hero-title">
          {slide.title}
        </h1>


        <div className="hero-bottom">

          <p className="hero-description">
            {slide.description}
          </p>


          <a
            href="#shop"
            className="hero-cta"
          >

            <span>
              {slide.button}
            </span>

            <span className="hero-arrow">
              ↗
            </span>

          </a>

        </div>

      </div>



    </section>
  );
}