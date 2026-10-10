"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../../context/CartContext";

import {
  XIcon,
  SearchIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  InstagramIcon,
} from "../common/Icons";

import "./Navbar.css";

/* =====================================================
   NAV ITEMS CONFIGURATION
===================================================== */

const DESKTOP_NAV_ITEMS = [
  { label: "Home", id: "home", href: "/" },
  { label: "Shop", id: "shop", href: "/#shop" },
  { label: "Collections", id: "collections", href: "/#collections" },
  { label: "About", id: "about", href: "/#about" },
];

const MOBILE_NAV_ITEMS = [
  { label: "Home", id: "home", href: "/" },
  { label: "Shop", id: "shop", href: "/#shop" },
  { label: "Collections", id: "collections", href: "/#collections" },
  { label: "About", id: "about", href: "/#about" },
  { label: "Best Sellers", id: "bestsellers", href: "/#bestsellers" },
  { label: "FAQ", id: "faq", href: "/#faq" },
];

/* =====================================================
   BRAND LOGO
===================================================== */

const BrandLogo = ({ onClick }) => (
  <a
    href="/"
    className="brand-logo"
    aria-label="FLINT SECTOR Home"
    onClick={onClick}
  >
    <img
      src="/images/logo.png"
      alt="FLINT SECTOR"
      className="brand-logo-image"
    />
  </a>
);


/* =====================================================
   TWO LINE MOBILE MENU ICON
===================================================== */

const TwoLineMenuIcon = () => (
  <svg
    className="two-line-menu-icon"
    viewBox="0 0 28 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1 3H27"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    <path
      d="M1 15H27"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);


/* =====================================================
   MINIMAL SHOPPING BAG ICON
===================================================== */

const MinimalBagIcon = ({ hasItems = false }) => (
  <span
    className="minimal-bag-icon"
    aria-hidden="true"
  >

    <svg
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {/* BAG HANDLE */}

      <path
        d="
          M9.5 13V9.5
          C9.5 5.91 12.41 3 16 3
          C19.59 3 22.5 5.91 22.5 9.5
          V13
        "
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />


      {/* BAG BODY */}

      <path
        d="M6.5 12.5H25.5L28 32H4L6.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

    </svg>


    {/* GOLD CART STATUS DOT */}

    {hasItems && (
      <span className="bag-status-dot" />
    )}

  </span>
);


/* =====================================================
   NAVBAR
===================================================== */

const Navbar = () => {

  const {
    cartTotalCount,
    setIsCartOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsSearchOpen,
  } = useCart();


  /* =====================================================
     SCROLL & ACTIVE NAVIGATION STATE
  ===================================================== */

  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const isScrollingToSectionRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const currentSectionRef = useRef("home");

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isLogoCompact, setIsLogoCompact] = useState(false);

  /* Helper to evaluate active state */
  const isDesktopActive = (itemId) => {
    if (pathname === "/") {
      if (itemId === "shop") {
        return activeSection === "shop" || activeSection === "bestsellers";
      }
      return activeSection === itemId;
    }
    if (pathname && pathname.startsWith("/product")) {
      return itemId === "shop";
    }
    return false;
  };

  const isMobileActive = (itemId) => {
    if (pathname === "/") {
      if (itemId === "shop") {
        return activeSection === "shop";
      }
      if (itemId === "bestsellers") {
        return activeSection === "bestsellers";
      }
      return activeSection === itemId;
    }
    if (pathname && pathname.startsWith("/product")) {
      return itemId === "shop";
    }
    return false;
  };

  /* Navigation click handler */
  const handleNavClick = (e, targetId, href) => {
    if (pathname === "/") {
      e.preventDefault();

      isScrollingToSectionRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      currentSectionRef.current = targetId;
      setActiveSection(targetId);

      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          try {
            history.pushState(null, "", window.location.pathname);
          } catch (_) {}
        }
      } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          try {
            history.pushState(null, "", `#${targetId}`);
          } catch (_) {}
        } else {
          window.location.href = href;
        }
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingToSectionRef.current = false;
      }, 850);

      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    } else {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      window.location.href = href;
    }
  };

  /* Route & Hash sync */
  useEffect(() => {
    if (pathname !== "/") {
      if (pathname && pathname.startsWith("/product")) {
        currentSectionRef.current = "shop";
        setActiveSection("shop");
      } else {
        currentSectionRef.current = "";
        setActiveSection("");
      }
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      currentSectionRef.current = hash;
      setActiveSection(hash);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    } else {
      if (window.scrollY < 220) {
        currentSectionRef.current = "home";
        setActiveSection("home");
      }
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      if (currentHash) {
        currentSectionRef.current = currentHash;
        setActiveSection(currentHash);
      } else if (window.scrollY < 220) {
        currentSectionRef.current = "home";
        setActiveSection("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname]);

  /* =====================================================
     SCROLL LISTENER (ANNOUNCEMENT + LOGO + SCROLLSPY)
  ===================================================== */

  useEffect(() => {
    const SCROLL_THRESHOLD = 10;
    const TOP_OFFSET = 8;
    let previousScrollY = window.scrollY;
    let ticking = false;
    let currentAnnouncementState = true;
    let currentLogoState = false;

    const updateNavbarState = (atTop, scrollingDown) => {
      const nextAnnouncementState = atTop || !scrollingDown;
      const nextLogoState = !atTop && scrollingDown;

      if (nextAnnouncementState !== currentAnnouncementState) {
        currentAnnouncementState = nextAnnouncementState;
        setShowAnnouncement(nextAnnouncementState);
      }

      if (nextLogoState !== currentLogoState) {
        currentLogoState = nextLogoState;
        setIsLogoCompact(nextLogoState);
      }
    };

    const updateActiveSectionFromScroll = () => {
      if (pathname !== "/" || isScrollingToSectionRef.current) return;

      const scrollY = window.scrollY;

      // 1. Top of page
      if (scrollY < 220) {
        if (currentSectionRef.current !== "home") {
          currentSectionRef.current = "home";
          setActiveSection("home");
        }
        return;
      }

      // 2. Near bottom of page
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 70
      ) {
        if (currentSectionRef.current !== "faq") {
          currentSectionRef.current = "faq";
          setActiveSection("faq");
        }
        return;
      }

      // 3. Focal line check across sections
      const focalLine = 220;
      const tracked = [
        { id: "faq", el: document.getElementById("faq") },
        { id: "about", el: document.getElementById("about") },
        { id: "shop", el: document.getElementById("shop") },
        { id: "collections", el: document.getElementById("collections") },
        { id: "home", el: document.getElementById("home") },
      ];

      let candidate = null;
      let maxTop = -Infinity;

      for (const item of tracked) {
        if (!item.el) continue;
        const rect = item.el.getBoundingClientRect();
        if (rect.top <= focalLine && rect.top > maxTop) {
          maxTop = rect.top;
          candidate = item.id;
        }
      }

      if (candidate && currentSectionRef.current !== candidate) {
        currentSectionRef.current = candidate;
        setActiveSection(candidate);
      }
    };

    const updateFromScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - previousScrollY;
      const atTop = currentScrollY <= TOP_OFFSET;

      if (atTop) {
        updateNavbarState(true, false);
        previousScrollY = currentScrollY;
      } else if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        const scrollingDown = delta > 0;
        updateNavbarState(false, scrollingDown);
        previousScrollY = currentScrollY;
      }

      updateActiveSectionFromScroll();

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);


  /* =====================================================
     ANNOUNCEMENT CONTENT
  ===================================================== */

  const announcementItems = [

    "NEW ARRIVALS EVERY THURSDAY",

    "SUSTAINABLY CRAFTED COLLECTIONS",

    "FREE SHIPPING ON ORDERS OVER $150",

    "EXPRESS WORLDWIDE DELIVERY",

  ];


  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMobileMenu = () => {

    setIsMobileMenuOpen(false);

  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>

      {/* =================================================
          NAVBAR STACK
      ================================================= */}

      <div className="navbar-stack">


        {/* =================================================
            ANNOUNCEMENT BAR
        ================================================= */}

        <div
          className={`announcement-bar-wrapper ${
            showAnnouncement
              ? "show"
              : "hide"
          }`}
          aria-hidden={
            !showAnnouncement
          }
        >

          <div className="announcement-bar">

            <div className="announcement-track">

              {[
                ...announcementItems,
                ...announcementItems,
              ].map(
                (item, index) => (

                  <React.Fragment
                    key={index}
                  >

                    <span className="announcement-item">
                      {item}
                    </span>


                    <span
                      className="announcement-diamond"
                      aria-hidden="true"
                    >
                      ◆
                    </span>

                  </React.Fragment>

                )
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            MAIN NAVBAR
        ================================================= */}

        <header
          className={`main-header ${
            isLogoCompact
              ? "logo-compact"
              : ""
          }`}
        >

          <div className="navbar-container">


            {/* =================================================
                LEFT
            ================================================= */}

            <div className="navbar-left">


              {/* =============================================
                  MOBILE MENU
              ============================================== */}

              <button
                type="button"
                className="menu-button"
                onClick={() =>
                  setIsMobileMenuOpen(true)
                }
                aria-label="Open Menu"
              >

                <TwoLineMenuIcon />

              </button>


              {/* =============================================
                  DESKTOP NAVIGATION
              ============================================== */}

              <nav className="desktop-navigation">
                {DESKTOP_NAV_ITEMS.map((item) => {
                  const active = isDesktopActive(item.id);
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`desktop-nav-link ${active ? "active" : ""}`}
                      onClick={(e) => handleNavClick(e, item.id, item.href)}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

            </div>


            {/* =================================================
                CENTER LOGO
            ================================================= */}

            <div className="center-logo">

              <BrandLogo onClick={(e) => handleNavClick(e, "home", "/")} />

            </div>


            {/* =================================================
                RIGHT ACTIONS
            ================================================= */}

            <div className="navbar-actions">


              {/* =============================================
                  SEARCH
              ============================================== */}

              <button
                type="button"
                className="navbar-action search-action"
                onClick={() =>
                  setIsSearchOpen(true)
                }
                aria-label="Search"
                title="Search"
              >

                <SearchIcon
                  size={21}
                />

              </button>


              {/* =============================================
                  SHOPPING BAG
              ============================================== */}

              <button
                type="button"
                className="navbar-action bag-action"
                onClick={() =>
                  setIsCartOpen(true)
                }
                aria-label={`Shopping Bag${
                  cartTotalCount > 0
                    ? `, ${cartTotalCount} items`
                    : ""
                }`}
                title="Shopping Bag"
              >

                <MinimalBagIcon
                  hasItems={
                    cartTotalCount > 0
                  }
                />

              </button>


            </div>

          </div>

        </header>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <div
        className={`mobile-menu ${
          isMobileMenuOpen
            ? "open"
            : ""
        }`}
      >


        {/* =================================================
            BACKDROP
        ================================================= */}

        <div
          className="mobile-menu-backdrop"
          onClick={closeMobileMenu}
        />


        {/* =================================================
            DRAWER
        ================================================= */}

        <aside className="mobile-menu-drawer">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mobile-menu-header">


            <div className="mobile-logo">

              <BrandLogo onClick={(e) => handleNavClick(e, "home", "/")} />

            </div>


            <button
              type="button"
              className="mobile-close-button"
              onClick={closeMobileMenu}
              aria-label="Close Menu"
            >

              <XIcon
                size={23}
              />

            </button>


          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="mobile-navigation">
            {MOBILE_NAV_ITEMS.map((item) => {
              const active = isMobileActive(item.id);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mobile-nav-link ${active ? "active" : ""}`}
                  onClick={(e) => handleNavClick(e, item.id, item.href)}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {item.id !== "home" && <ArrowRightIcon size={15} />}
                </a>
              );
            })}
          </nav>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mobile-menu-footer">


            <div className="mobile-footer-title">
              Sustainable Luxury Studio
            </div>


            <div className="mobile-social-links">


              {/* INSTAGRAM */}

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >

                <InstagramIcon
                  size={14}
                />

                Instagram

              </a>


              <span>
                ·
              </span>


              {/* WHATSAPP */}

              <a
                href="https://wa.me/919605300701"
                target="_blank"
                rel="noopener noreferrer"
              >

                <WhatsAppIcon
                  size={14}
                />

                WhatsApp

              </a>


            </div>

          </div>


        </aside>

      </div>

    </>
  );
};


export default Navbar;