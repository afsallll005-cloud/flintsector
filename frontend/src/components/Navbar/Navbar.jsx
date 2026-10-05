"use client";

import React, { useEffect, useState } from "react";
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
   BRAND LOGO
===================================================== */

const BrandLogo = () => (
  <a
    href="/"
    className="brand-logo"
    aria-label="FLINT SECTOR Home"
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
     SCROLL STATE
  ===================================================== */

  const [showAnnouncement, setShowAnnouncement] =
    useState(true);

  const [isLogoCompact, setIsLogoCompact] =
    useState(false);


  /* =====================================================
     SCROLL DIRECTION
  ===================================================== */

  useEffect(() => {

    const SCROLL_THRESHOLD = 10;

    const TOP_OFFSET = 8;

    let previousScrollY = window.scrollY;

    let ticking = false;

    let currentAnnouncementState = true;

    let currentLogoState = false;


    const updateNavbarState = (
      atTop,
      scrollingDown
    ) => {

      /* ---------------------------------------------
         ANNOUNCEMENT
      --------------------------------------------- */

      const nextAnnouncementState =
        atTop || !scrollingDown;


      /* ---------------------------------------------
         LOGO
      --------------------------------------------- */

      const nextLogoState =
        !atTop && scrollingDown;


      /* ---------------------------------------------
         UPDATE ANNOUNCEMENT
      --------------------------------------------- */

      if (
        nextAnnouncementState !==
        currentAnnouncementState
      ) {

        currentAnnouncementState =
          nextAnnouncementState;

        setShowAnnouncement(
          nextAnnouncementState
        );
      }


      /* ---------------------------------------------
         UPDATE LOGO
      --------------------------------------------- */

      if (
        nextLogoState !==
        currentLogoState
      ) {

        currentLogoState =
          nextLogoState;

        setIsLogoCompact(
          nextLogoState
        );
      }

    };


    /* =================================================
       SCROLL UPDATE
    ================================================= */

    const updateFromScroll = () => {

      const currentScrollY =
        Math.max(
          0,
          window.scrollY
        );


      const delta =
        currentScrollY -
        previousScrollY;


      const atTop =
        currentScrollY <=
        TOP_OFFSET;


      /* ---------------------------------------------
         AT TOP
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
         DIRECTION CHANGED
      --------------------------------------------- */

      else if (
        Math.abs(delta) >=
        SCROLL_THRESHOLD
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


    /* =================================================
       SCROLL HANDLER
    ================================================= */

    const handleScroll = () => {

      if (ticking) {
        return;
      }


      ticking = true;


      window.requestAnimationFrame(
        updateFromScroll
      );

    };


    /* =================================================
       INITIAL STATE
    ================================================= */

    updateFromScroll();


    /* =================================================
       EVENT
    ================================================= */

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    /* =================================================
       CLEANUP
    ================================================= */

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

            </div>


            {/* =================================================
                CENTER LOGO
            ================================================= */}

            <div className="center-logo">

              <BrandLogo />

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

              <BrandLogo />

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


            {/* HOME */}

            <a
              href="/"
              className="mobile-nav-link active"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                Home
              </span>

            </a>


            {/* SHOP */}

            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                Shop
              </span>

              <ArrowRightIcon
                size={15}
              />

            </a>


            {/* COLLECTIONS */}

            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                Collections
              </span>

              <ArrowRightIcon
                size={15}
              />

            </a>


            {/* ABOUT */}

            <a
              href="/#faq"
              className="mobile-nav-link"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                About
              </span>

              <ArrowRightIcon
                size={15}
              />

            </a>


            {/* BEST SELLERS */}

            <a
              href="/#bestsellers"
              className="mobile-nav-link"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                Best Sellers
              </span>

              <ArrowRightIcon
                size={15}
              />

            </a>


            {/* FAQ */}

            <a
              href="/#faq"
              className="mobile-nav-link"
              onClick={
                closeMobileMenu
              }
            >

              <span>
                FAQ
              </span>

              <ArrowRightIcon
                size={15}
              />

            </a>


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