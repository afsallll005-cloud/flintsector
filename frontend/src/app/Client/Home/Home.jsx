"use client";

import React, { useState } from "react";
import { Hero } from "../../../components/Hero/Hero";
import { ShopBycategory } from "../../../components/ShopBycategory/ShopBycategory";
import { Bestsellers } from "../../../components/Bestsellers/Bestsellers";
import { EditorialBanner } from "../../../components/EditorialBanner/EditorialBanner";
import { Accessories } from "../../../components/Accessories/Accessories";
import { NewArrivals } from "../../../components/NewArrivals/NewArrivals";
import { WatchTheDrop } from "../../../components/WatchTheDrop/WatchTheDrop";
import { Reviews } from "../../../components/Reviews/Reviews";
import { FAQ } from "../../../components/FAQ/FAQ";
import { BrandStatement } from "../../../components/BrandStatement/BrandStatement";
import { Perks } from "../../../components/Perks/Perks";
import { Footer } from "../../../components/Footer/Footer";
import { CartDrawer } from "../../../components/CartDrawer/CartDrawer";
import { QuickViewModal } from "../../../components/QuickViewModal/QuickViewModal";
import { SearchModal } from "../../../components/SearchModal/SearchModal";
import { FloatingSocials } from "../../../components/FloatingSocials/FloatingSocials";
import { useCart } from "../../../context/CartContext";
import "./Home.css";
import Navbar from "@/components/Navbar/Navbar";

export const Hme = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useCart();

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="home-page-container">
      {/* Toast Notification */}
      {toast && (
        <div className="flint-toast">
          <span>{toast.message}</span>
        </div>
      )}

      {/* Floating Pill Header & Announcement Ticker */}
      <Navbar />

      <main className="main-content">
        <Hero />
        <ShopBycategory onSelectCategory={handleCategorySelect} />
        <Bestsellers
          activeCategory={activeCategory}
          onTabChange={setActiveCategory}
        />
        <EditorialBanner />
        <Accessories />
        <NewArrivals />

        {/* <WatchTheDrop /> */}

        <Reviews />
        <FAQ />
        {/* <BrandStatement /> */}

        <Perks />
      </main>

      <Footer />

      {/* Slide-out Cart Drawer with Live Calculator */}
      <CartDrawer />

      {/* Interactive Quick View / Size Modal */}
      <QuickViewModal />

      {/* Instant Search Dialog */}
      <SearchModal />

      {/* Floating Instagram & WhatsApp Action Buttons */}
      <FloatingSocials />
    </div>
  );
};

export default Hme;
