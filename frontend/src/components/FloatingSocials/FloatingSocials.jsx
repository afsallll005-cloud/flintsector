"use client";

import React from "react";
import { InstagramIcon, WhatsAppIcon } from "../common/Icons";
import "./FloatingSocials.css";

export const FloatingSocials = () => {
  return (
    <div aria-label="FLINT SECTOR social links" className="floating-socials-container">
      <a
        href="https://www.instagram.com/flintsector.in?stkn=MXc0dDV3bGtoYTY1Mg%3D%3D&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open FLINT SECTOR on Instagram"
        className="floating-social-button floating-instagram"
      >
        <InstagramIcon size={21} />
        <span className="floating-tooltip">Instagram</span>
      </a>

      <a
        href="https://wa.me/919526304560?text=Hi%20FLINT%20SECTOR%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FLINT SECTOR on WhatsApp"
        className="floating-social-button floating-whatsapp"
      >
        <WhatsAppIcon size={21} />
        <span className="floating-tooltip">WhatsApp</span>
      </a>
    </div>
  );
};

export default FloatingSocials;
