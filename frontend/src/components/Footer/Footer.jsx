"use client";

import React, { useState } from "react";
import "./Footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="site-footer">

      {/* =====================================
          TOP BRAND AREA
      ====================================== */}

      <div className="footer-top">

        <div className="footer-brand">

          <span className="footer-eyebrow">
            FLINT SECTOR / EST. 2026
          </span>

          <h2>
            BUILT FOR
            <br />
            <span>THE CULTURE.</span>
          </h2>

        </div>

        <p className="footer-description">
          Modern essentials designed for everyday
          movement, individuality and the culture
          that shapes us.
        </p>

      </div>


      {/* =====================================
          MAIN FOOTER
      ====================================== */}

      <div className="footer-main">


        {/* =====================================
            SOCIAL
        ====================================== */}

        <div className="footer-column footer-social-column">

          <h3>CONNECT</h3>

          <ul className="footer-social-links">

            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="social-icon" />

                <span>Instagram</span>

                <b>↗</b>
              </a>
            </li>


            <li>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="social-icon" />

                <span>WhatsApp</span>

                <b>↗</b>
              </a>
            </li>

          </ul>

        </div>


        {/* =====================================
            HELP
        ====================================== */}

        <div className="footer-column">

          <h3>HELP</h3>

          <ul>

            <li>
              <a href="#faq">
                FAQ
              </a>
            </li>

            <li>
              <a href="#shipping">
                Shipping
              </a>
            </li>

            

          </ul>

        </div>


        {/* =====================================
            NEWSLETTER
        ====================================== */}

        <div className="footer-newsletter">

          <h3>JOIN THE SECTOR</h3>

          <p>
            Get first access to new drops,
            releases and exclusive updates.
          </p>

          <form
            className="newsletter-form"
            onSubmit={handleSubmit}
          >

            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">
              ↗
            </button>

          </form>

        </div>

      </div>


      {/* =====================================
          GIANT LOGO
      ====================================== */}

      <div className="footer-giant-logo">

        <img
          src="/images/logo-white.png"
          alt="Flint Sector"
        />

      </div>


      {/* =====================================
          BOTTOM BAR
      ====================================== */}

      <div className="footer-bottom">

        <span>
          © 2026 FLINT SECTOR. ALL RIGHTS RESERVED.
        </span>


        <div className="footer-bottom-links">

          <a href="#privacy">
            PRIVACY
          </a>

          <a href="#terms">
            TERMS
          </a>

          <a href="#cookies">
            COOKIES
          </a>

        </div>


      </div>

    </footer>
  );
}

export default Footer;