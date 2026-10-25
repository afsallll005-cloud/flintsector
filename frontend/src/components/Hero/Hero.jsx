"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Hero.css";

/* =========================================================
   PUBLIC IMAGES CONFIGURATION
   Files located in frontend/public/images/ are referenced as "/images/filename.png"
   (e.g., "/images/hero03.png", "/images/hero01.png", "/images/hero02.png")
   ========================================================= */
export const DEFAULT_WALK_FRAMES = [
  "/images/HeroMove01.png",
  "/images/HeroMove02.png",
  "/images/HeroMove03.png",
  "/images/HeroMove05.png",
   "/images/HeroMove04.png",
 
];

// Helper to safely format image paths whether given as "./image/...", "image/...", or "/images/..."
export const normalizeImagePath = (src) => {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  let cleaned = src.replace(/^\.\//, "").replace(/^\//, "");
  if (cleaned.startsWith("image/")) {
    cleaned = cleaned.replace(/^image\//, "images/");
  } else if (!cleaned.startsWith("images/")) {
    cleaned = `images/${cleaned}`;
  }
  return `/${cleaned}`;
};

/* Default wordmark: change to "TIDELABEL" if literal name from the file is preferred */
const DEFAULT_WORDMARK = "FLINT SECTOR";

export default function Hero({
  wordmark = DEFAULT_WORDMARK,
  season = "FLINT SECTOR / SS27",
  kicker = "FLINT SECTOR / 01",
  line = "Heavyweight essentials, crafted for culture and movement.",
  ctaText = "SHOP COLLECTION",
  ctaHref = "#shop",
  frames = DEFAULT_WALK_FRAMES,
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);

  const [walkProgress, setWalkProgress] = useState(0);
  const [stageWidth, setStageWidth] = useState(1200);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalize image paths so relative or public paths work seamlessly
  const activeFrames = (
    frames && frames.length > 0 ? frames : DEFAULT_WALK_FRAMES
  ).map(normalizeImagePath);

  /* =======================================================
     PRELOAD WALK FRAMES (FOR ZERO FLICKER)
     ======================================================= */
  useEffect(() => {
    setIsLoaded(true);
    activeFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [activeFrames]);

  /* =======================================================
     STAGE RESIZE TRACKING
     ======================================================= */
  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  /* =======================================================
     SCROLL LISTENER (CALCULATES 0..1 WALK PROGRESS)
     ======================================================= */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = null;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = track.getBoundingClientRect();
        const windowH = window.innerHeight;
        const scrollDist = rect.height - windowH;

        if (scrollDist <= 0) return;

        // When rect.top is 0, user is at the start of Hero
        // When rect.top is -scrollDist, Hero sticky scroll finishes
        let p = -rect.top / scrollDist;
        p = Math.max(0, Math.min(1, p));
        setWalkProgress(p);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* =======================================================
     ACTIVE LOOK & FRAME CALCULATIONS (NO REPEATS)
     ======================================================= */
  const frameCount = activeFrames.length;
  const totalLooks = frameCount > 0 ? frameCount : 4;
  const activeLookIndex = Math.min(
    totalLooks - 1,
    Math.floor(walkProgress * totalLooks)
  );
  const lookNumber = String(activeLookIndex + 1).padStart(2, "0");
  const totalLooksNumber = String(totalLooks).padStart(2, "0");

  // Linear progression: each frame shows ONCE across the scroll (NO REPEAT)
  const currentFrameIndex =
    frameCount > 1
      ? Math.min(frameCount - 1, Math.floor(walkProgress * frameCount))
      : 0;

  // Figure horizontal translation: Start on the RIGHT, walk towards the LEFT
  const isMobile = stageWidth < 810;
  // Increase figure width appropriately for responsive so it matches the larger CSS height
  const figWidth = isMobile
    ? Math.min(stageWidth * 0.75, 360)
    : Math.min(stageWidth * 0.48, 540);

  const startX = isMobile
    ? Math.max(0, stageWidth - figWidth - 10)
    : stageWidth - figWidth - 40;
  const endX = isMobile ? 10 : -30;
  const currentX = startX + (endX - startX) * walkProgress;

  /* =======================================================
     SMOOTH SCROLL TO LOOK MILESTONES
     ======================================================= */
  const scrollToLook = useCallback(
    (targetLookIdx) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const currentScroll = window.scrollY;
      const trackTop = currentScroll + rect.top;
      const scrollableDist = rect.height - window.innerHeight;
      const divisor = Math.max(1, totalLooks - 1);
      const targetScroll = trackTop + (targetLookIdx / divisor) * scrollableDist;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [totalLooks]
  );

  const isTidelabel = wordmark.toUpperCase() === "TIDELABEL";

  return (
    <section
      id="home"
      ref={trackRef}
      className="hero-track"
      aria-label="Editorial Hero Section"
    >
      <header
        ref={stageRef}
        className="hero-stage"
        style={{
          "--walk-p": walkProgress.toFixed(3),
        }}
      >
        {/* Floor runway strip */}
        <div className="hero-floor" aria-hidden="true" />

        {/* Top left season badge */}
        <div className={`hero-season ${isLoaded ? "tl-fade-in" : "tl-fade-pre"}`}>
          {/* <p>{season}</p> */}
        </div>

        {/* Top right look counter */}
        {/* <div
          className={`hero-look-counter ${isLoaded ? "tl-fade-in" : "tl-fade-pre"}`}
          onClick={() => scrollToLook((activeLookIndex + 1) % totalLooks)}
          title="Click to advance look"
        >
          Look <span>{lookNumber}</span> / {totalLooksNumber}
        </div> */}

        {/* Top spacer */}
        <div className="hero-spacer-top" aria-hidden="true" />

        {/* Massive architectural Wordmark in background */}
        <div className="hero-wordmark-wrap">
          <svg
            className={`hero-wordmark-svg ${
              isLoaded ? "tl-rise-in" : "tl-rise-pre"
            }`}
            viewBox={isTidelabel ? "0 0 810 130" : "0 0 1040 130"}
            preserveAspectRatio="xMidYMid meet"
            aria-label={wordmark}
          >
            <text
              x="50%"
              y="70%"
              textAnchor="middle"
              className="hero-wordmark-text"
            >
              {wordmark}
            </text>
          </svg>
        </div>

        {/* Bottom spacer */}
        <div className="hero-spacer-bottom" aria-hidden="true" />

        {/* Interactive Walk Component with 10 cutout gait frames */}
        <div className="hero-walk-container" aria-hidden="true">
          <div className="hero-walk-stage">
            <div
              className="hero-walk-fig"
              style={{
                transform: `translate3d(${currentX.toFixed(1)}px, 0px, 0px)`,
              }}
            >
              {activeFrames.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={
                    idx === 0
                      ? "Model in tailored collection walking across the page"
                      : ""
                  }
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  className="hero-walk-img"
                  style={{
                    opacity: idx === currentFrameIndex ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating caption (bottom-left) */}
        <div
          className={`hero-caption tl-aside ${
            isLoaded ? "tl-up-in" : "tl-up-pre"
          }`}
        >
          <div className="hero-kicker">
            <span className="hero-kicker-line" />
            <span>{kicker}</span>
          </div>

          <div className="hero-line">
            <p>{line}</p>
          </div>

          <div className="hero-cta-wrap">
            <a href={ctaHref} className="hero-cta-btn">
              <span>{ctaText}</span>
              <span className="hero-cta-arrow">↗</span>
            </a>
          </div>
        </div>

        {/* Scroll guide & progress dashes (bottom-right) */}
        {/* <div
          className={`hero-scroll-guide ${
            isLoaded ? "tl-fade-in" : "tl-fade-pre"
          }`}
          onClick={() =>
            scrollToLook(Math.min(totalLooks - 1, activeLookIndex + 1))
          }
          title="Scroll or click to walk the look"
        >
          <div className="hero-scroll-bars">
            {Array.from({ length: totalLooks }).map((_, idx) => (
              <span
                key={idx}
                className={`hero-bar ${idx <= activeLookIndex ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToLook(idx);
                }}
                aria-label={`Jump to look ${idx + 1}`}
              />
            ))}
          </div>
          <div className="hero-scroll-text">Scroll to walk the look</div>
        </div> */}
      </header>
    </section>
  );
}