"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { CartDrawer } from "../CartDrawer/CartDrawer";
import { QuickViewModal } from "../QuickViewModal/QuickViewModal";
import { SearchModal } from "../SearchModal/SearchModal";
import { FloatingSocials } from "../FloatingSocials/FloatingSocials";
import { CartProvider, useCart } from "../../context/CartContext";
import "../../app/Client/Home/Home.css";

const SiteChrome = ({ children }) => {
  const { toast } = useCart();
  const pathname = usePathname();
  const isAdmin = pathname?.toLowerCase()?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="flint-admin-wrapper">
        {toast && (
          <div className="flint-toast">
            <span>{toast.message}</span>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="home-page-container">
      {toast && (
        <div className="flint-toast">
          <span>{toast.message}</span>
        </div>
      )}

      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <FloatingSocials />
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
