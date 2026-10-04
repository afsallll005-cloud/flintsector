"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

import {
  ShoppingBagIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  HeartIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  InstagramIcon,
} from "../common/Icons";

import "./Navbar.css";

/* =====================================================
   BRAND LOGO
===================================================== */

const BrandLogo = () => (
  <a
    href="/"
    className="brand-logo"
    aria-label="FLINT SECTOR Home"
  >
    <span className="brand-logo-wordmark">
      FLINT<span className="brand-logo-dot"></span>SECTOR
    </span>

    {/* Optional tagline */}
    {/* <span className="brand-logo-tagline">
      Heavyweight Streetwear
    </span> */}
  </a>
);


/* =====================================================
   NAVBAR
===================================================== */

const Navbar = () => {
  const {
    cartTotalCount,
    wishlist,
    setIsCartOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsSearchOpen,
  } = useCart();


  /* =====================================================
     SCROLL STATE

     true  = announcement visible
     false = announcement hidden

     false = normal logo
     true  = compact logo
  ===================================================== */

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isLogoCompact, setIsLogoCompact] = useState(false);


  /* =====================================================
     SCROLL DIRECTION DETECTION

     SCROLL DOWN:
       announcement → hide
       logo → compact

     SCROLL UP:
       announcement → show
       logo → normal

     TOP:
       announcement → show
       logo → normal
  ===================================================== */

  useEffect(() => {
    const SCROLL_THRESHOLD = 10;
    const TOP_OFFSET = 8;

    let previousScrollY = window.scrollY;
    let ticking = false;

    // Local values prevent unnecessary React state updates.
    let currentAnnouncementState = true;
    let currentLogoState = false;


    const updateNavbarState = (atTop, scrollingDown) => {

      /*
       * At top:
       * announcement visible
       * logo normal
       */
      const nextAnnouncementState =
        atTop || !scrollingDown;

      /*
       * Scrolling down:
       * logo becomes compact
       *
       * Scrolling up:
       * logo returns to normal
       */
      const nextLogoState =
        !atTop && scrollingDown;


      /* ---------------------------------------------
         Announcement
      --------------------------------------------- */

      if (
        nextAnnouncementState !== currentAnnouncementState
      ) {
        currentAnnouncementState =
          nextAnnouncementState;

        setShowAnnouncement(
          nextAnnouncementState
        );
      }


      /* ---------------------------------------------
         Logo
      --------------------------------------------- */

      if (
        nextLogoState !== currentLogoState
      ) {
        currentLogoState =
          nextLogoState;

        setIsLogoCompact(
          nextLogoState
        );
      }
    };


    const updateFromScroll = () => {
      const currentScrollY = Math.max(
        0,
        window.scrollY
      );

      const delta =
        currentScrollY - previousScrollY;

      const atTop =
        currentScrollY <= TOP_OFFSET;


      /* ---------------------------------------------
         At top
      --------------------------------------------- */

      if (atTop) {

        updateNavbarState(
          true,
          false
        );

        previousScrollY =
          currentScrollY;
      }


      /* ---------------------------------------------
         Direction changed enough
      --------------------------------------------- */

      else if (
        Math.abs(delta) >= SCROLL_THRESHOLD
      ) {

        const scrollingDown =
          delta > 0;

        updateNavbarState(
          false,
          scrollingDown
        );

        previousScrollY =
          currentScrollY;
      }


      ticking = false;
    };


    const handleScroll = () => {

      /*
       * Prevent multiple animation frames
       * from being queued during fast scrolling.
       */
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(
        updateFromScroll
      );
    };


    /* Initial state */
    updateFromScroll();


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


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


  return (
    <>
      {/* =================================================
          NAVBAR STACK

          Announcement always stays above navbar.
      ================================================= */}

      <div className="navbar-stack">

        {/* ===============================================
            ANNOUNCEMENT BAR
        ================================================ */}

        <div
          className={`announcement-bar-wrapper ${
            showAnnouncement
              ? "show"
              : "hide"
          }`}
          aria-hidden={!showAnnouncement}
        >

          <div className="announcement-bar">

            <div className="announcement-track">

              {[
                ...announcementItems,
                ...announcementItems,
              ].map((item, index) => (
                <React.Fragment key={index}>

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
              ))}

            </div>

          </div>

        </div>


        {/* ===============================================
            MAIN NAVBAR
        ================================================ */}

        <header
          className={`main-header ${
            isLogoCompact
              ? "logo-compact"
              : ""
          }`}
        >

          <div className="navbar-container">


            {/* =========================================
                MOBILE LEFT

                Hamburger + Search
            ========================================== */}

            <div className="mobile-left-actions">

              <button
                type="button"
                className="mobile-icon-button"
                onClick={() =>
                  setIsMobileMenuOpen(true)
                }
                aria-label="Open Menu"
              >
                <MenuIcon size={25} />
              </button>


              <button
                type="button"
                className="mobile-icon-button"
                onClick={() =>
                  setIsSearchOpen(true)
                }
                aria-label="Search"
              >
                <SearchIcon size={22} />
              </button>

            </div>


            {/* =========================================
                DESKTOP NAVIGATION
            ========================================== */}

            <nav className="desktop-navigation">

              <a
                href="/"
                className="desktop-nav-link active"
              >
                Home
              </a>

              <a
                href="/#bestsellers"
                className="desktop-nav-link"
              >
                Shop
              </a>

              <a
                href="/#bestsellers"
                className="desktop-nav-link"
              >
                Collections
              </a>

              <a
                href="/#faq"
                className="desktop-nav-link"
              >
                About
              </a>

            </nav>


            {/* =========================================
                CENTER LOGO
            ========================================== */}

            <div className="center-logo">
              <BrandLogo />
            </div>


            {/* =========================================
                RIGHT ACTIONS
            ========================================== */}

            <div className="navbar-actions">

              {/* Search */}

              <button
                type="button"
                className="navbar-action desktop-search"
                onClick={() =>
                  setIsSearchOpen(true)
                }
                aria-label="Search"
                title="Search"
              >
                <SearchIcon size={20} />
              </button>


              {/* Wishlist */}

              <a
                href="#wishlist"
                className="navbar-action wishlist-action"
                aria-label="Wishlist"
                title="Wishlist"
              >

                <HeartIcon
                  size={20}
                  filled={
                    wishlist.length > 0
                  }
                />

                {wishlist.length > 0 && (
                  <span className="action-badge number-badge">
                    {wishlist.length}
                  </span>
                )}

              </a>


              {/* Account */}

              <button
                type="button"
                className="navbar-action account-action"
                aria-label="Account"
                title="Account"
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.4"
                  stroke="currentColor"
                  className="account-icon"
                >

                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20c.7-3.5 3.2-5.5 7.5-5.5s6.8 2 7.5 5.5"
                  />

                </svg>

              </button>


              {/* Shopping Bag */}

              <button
                type="button"
                className="navbar-action bag-action"
                onClick={() =>
                  setIsCartOpen(true)
                }
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >

                <ShoppingBagIcon size={21} />

                {cartTotalCount > 0 && (
                  <span className="action-badge number-badge">
                    {cartTotalCount}
                  </span>
                )}

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

        {/* Backdrop */}

        <div
          className="mobile-menu-backdrop"
          onClick={closeMobileMenu}
        />


        {/* Drawer */}

        <aside className="mobile-menu-drawer">

          {/* Header */}

          <div className="mobile-menu-header">

            <div className="mobile-logo">
              <BrandLogo />
            </div>

            <button
              type="button"
              className="mobile-close-button"
              onClick={closeMobileMenu}
              aria-label="Close Menu"
            >
              <XIcon size={23} />
            </button>

          </div>


          {/* Navigation */}

          <nav className="mobile-navigation">

            <a
              href="/"
              className="mobile-nav-link active"
              onClick={closeMobileMenu}
            >
              <span>Home</span>
            </a>


            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span>Shop</span>
              <ArrowRightIcon size={15} />
            </a>


            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span>Collections</span>
              <ArrowRightIcon size={15} />
            </a>


            <a
              href="/#faq"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span>About</span>
              <ArrowRightIcon size={15} />
            </a>


            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span>Best Sellers</span>
              <ArrowRightIcon size={15} />
            </a>


            <a
              href="/#faq"
              className="mobile-nav-link"
              onClick={closeMobileMenu}
            >
              <span>FAQ</span>
              <ArrowRightIcon size={15} />
            </a>

          </nav>


          {/* Footer */}

          <div className="mobile-menu-footer">

            <div className="mobile-footer-title">
              Sustainable Luxury Studio
            </div>

            <div className="mobile-social-links">

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon size={14} />
                Instagram
              </a>

              <span>·</span>

              <a
                href="https://wa.me/919605300701"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={14} />
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