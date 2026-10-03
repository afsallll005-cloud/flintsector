"use client";

import React, { useState } from "react";
import {
  ArrowRightIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "../common/Icons";
import { useCart } from "../../context/CartContext";
import "./Footer.css";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { showToast, setIsCartOpen } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    showToast("Subscribed! Use code FLINT10 for 10% off your first drop.", "success");
    setEmail("");
  };

  return (
    <footer className="footer-section">
      <div className="footer-inner">
        {/* Top 3-Column Grid */}
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div>
            <a href="#home" className="footer-brand-logo" aria-label="FLINT SECTOR Home">
              <span className="footer-brand-wordmark">
                FLINT<span className="footer-brand-dot">.</span>SECTOR
              </span>
              <span className="footer-brand-tagline">Heavyweight Streetwear</span>
            </a>
            <p className="footer-brand-desc">
              FLINT SECTOR creates everyday heavyweight essentials with clean boxy design, supreme comfort, and street confidence.
            </p>
          </div>

          {/* Shop & Support Subgrid */}
          <div className="footer-nav-subgrid">
            <div>
              <h3 className="footer-column-title">Shop</h3>
              <a href="#bestsellers" className="footer-nav-link">All Products</a>
              <button
                type="button"
                className="footer-nav-link"
                onClick={() => setIsCartOpen(true)}
                style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
              >
                Shopping Bag
              </button>
              <a href="#brand-story" className="footer-nav-link">About Brand</a>
              <a href="#reels" className="footer-nav-link">Watch Reels</a>
            </div>

            <div>
              <h3 className="footer-column-title">Support</h3>
              <a href="#faq" className="footer-nav-link">Contact Us</a>
              <a href="#faq" className="footer-nav-link">Track Orders</a>
              <a href="#faq" className="footer-nav-link">Size Guide</a>
              <a href="#faq" className="footer-nav-link">Shipping & Returns</a>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="footer-column-title">Stay Connected</h3>
            <p className="footer-newsletter-text">
              Get secret drops, exclusive discount codes, and styling edits delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Email address"
                className="footer-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="footer-newsletter-submit"
              >
                <ArrowRightIcon size={18} />
              </button>
            </form>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-link"
            >
              <InstagramIcon size={15} />
              <span>@flintsector</span>
            </a>

            <a
              href="mailto:contact@flintsector.com"
              className="footer-contact-link"
            >
              <MailIcon size={15} />
              <span>contact@flintsector.com</span>
            </a>

            <a
              href="tel:+919605300701"
              className="footer-contact-link"
            >
              <PhoneIcon size={15} />
              <span>+91 96053 00701</span>
            </a>
          </div>
        </div>

        {/* Center Giant Wordmark */}
        <div className="footer-center-logo-bar">
          <span className="footer-giant-logo">
            FLINT<span style={{ color: "#d12b2b" }}>.</span>SECTOR
          </span>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 FLINT SECTOR. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#faq" className="footer-legal-link">Privacy Policy</a>
            <a href="#faq" className="footer-legal-link">Terms & Conditions</a>
            <a href="#faq" className="footer-legal-link">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
