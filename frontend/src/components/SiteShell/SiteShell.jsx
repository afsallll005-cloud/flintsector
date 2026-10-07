"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { CartDrawer } from "../CartDrawer/CartDrawer";
import { QuickViewModal } from "../QuickViewModal/QuickViewModal";
import { SearchModal } from "../SearchModal/SearchModal";
import { FloatingSocials } from "../FloatingSocials/FloatingSocials";
import { CartProvider, useCart } from "../../context/CartContext";
import "./SiteShell.css";
import "../../app/Client/Home/Home.css";

/* Modern Global Toast Component */
const SiteToast = ({ toast }) => {
  if (!toast) return null;
  const type = toast.type || "success";

  return (
    <div
      className={`flint-toast flint-toast-${type}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast-icon-wrap" aria-hidden="true">
        {type === "success" && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {type === "error" && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
        {type === "info" && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
      </span>
      <span className="toast-message-text">{toast.message}</span>
    </div>
  );
};

/* Modern Scroll to Top Button */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="site-scroll-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
      <span className="scroll-top-tooltip">Back to top</span>
    </button>
  );
};

const SiteChrome = ({ children }) => {
  const { toast } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname?.toLowerCase()?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="flint-admin-wrapper">
        <SiteToast toast={toast} />
        {children}
      </div>
    );
  }

  return (
    <div className="home-page-container site-shell-root">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="site-skip-link">
        Skip to main content
      </a>

      {/* Global Toast */}
      <SiteToast toast={toast} />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Primary Content Flow */}
      <div id="main-content" className="site-main-flow">
        {children}
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Global Overlays & Floating Actions */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <FloatingSocials />
      <ScrollToTop />
    </div>
  );
};

export const SiteShell = ({ children }) => {
  return (
    <CartProvider>
      <SiteChrome>{children}</SiteChrome>
    </CartProvider>
  );
};

export default SiteShell;
