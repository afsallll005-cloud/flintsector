"use client";

import React, { useState, useRef } from "react";
import { REELS } from "../../data/products";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InstagramIcon,
  VolumeMuteIcon,
  VolumeUpIcon,
  ArrowRightIcon,
} from "../common/Icons";
import "./WatchTheDrop.css";

export const WatchTheDrop = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REELS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REELS.length) % REELS.length);
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const nextVal = !prev;
      Object.values(videoRefs.current).forEach((v) => {
        if (v) v.muted = nextVal;
      });
      return nextVal;
    });
  };

  return (
    <section id="reels" className="reels-section">
      <header className="reels-header">
        <p className="reels-category-tag">FLINT SECTOR Social Edit</p>
        <h2 className="reels-heading">Watch The Drop</h2>
        <div className="reels-divider" aria-hidden="true" />
        <p className="reels-description">
          Looks, movement, and behind-the-scenes moments from the FLINT SECTOR world.
        </p>
      </header>

      {/* 3D Perspective Stage */}
      <div className="reels-stage">
        <div className="reels-shadow-floor" aria-hidden="true" />

        {REELS.map((reel, index) => {
          let position = "hidden";
          if (index === currentIndex) {
            position = "active";
          } else if (
            index === (currentIndex - 1 + REELS.length) % REELS.length
          ) {
            position = "prev";
          } else if (index === (currentIndex + 1) % REELS.length) {
            position = "next";
          }

          const isActive = index === currentIndex;

          return (
            <div
              key={reel.id}
              className={`reels-card-wrapper ${position}`}
              onClick={() => {
                if (!isActive) setCurrentIndex(index);
              }}
            >
              <article className="reel-card">
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={reel.videoUrl}
                  loop
                  playsInline
                  autoPlay={isActive}
                  muted={isMuted}
                  poster={reel.poster}
                  className="reel-video"
                />

                <div className="reel-gradient-overlay" />

                {/* Reel Pill Badge */}
                <div className="reel-pill-badge">
                  <InstagramIcon size={13} />
                  <span>{reel.label}</span>
                </div>

                {/* Audio toggle button */}
                {isActive && (
                  <button
                    type="button"
                    aria-label={isMuted ? "Unmute reel" : "Mute reel"}
                    className="reel-audio-btn"
                    onClick={toggleAudio}
                  >
                    {isMuted ? (
                      <VolumeMuteIcon size={15} />
                    ) : (
                      <VolumeUpIcon size={15} />
                    )}
                  </button>
                )}

                {/* Bottom info */}
                <div className="reel-bottom-info">
                  <p className="reel-bottom-title">{reel.title}</p>
                  <div className="reel-bottom-sub">
                    <span>{reel.subtitle}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* Carousel Controls */}
      <div className="reels-controls-row">
        <button
          type="button"
          aria-label="Previous reel"
          className="reel-arrow-btn"
          onClick={handlePrev}
        >
          <ChevronLeftIcon size={17} />
        </button>

        <div className="reel-dots-container">
          {REELS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              aria-label={`Show reel ${dotIdx + 1}`}
              className={`reel-dot ${dotIdx === currentIndex ? "active" : "inactive"}`}
              onClick={() => setCurrentIndex(dotIdx)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next reel"
          className="reel-arrow-btn"
          onClick={handleNext}
        >
          <ChevronRightIcon size={17} />
        </button>
      </div>

      <div className="reels-cta-wrap">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="reels-instagram-link"
        >
          <InstagramIcon size={15} />
          <span>Follow @flintsector</span>
        </a>
      </div>
    </section>
  );
};

export default WatchTheDrop;
