"use client";

import React, { useState } from "react";
import { Hero } from "../../../components/Hero/Hero";
import { ShopBycategory } from "../../../components/ShopBycategory/ShopBycategory";
import { Bestsellers } from "../../../components/Bestsellers/Bestsellers";
import { EditorialBanner } from "../../../components/EditorialBanner/EditorialBanner";
import { Accessories } from "../../../components/Accessories/Accessories";
import { NewArrivals } from "../../../components/NewArrivals/NewArrivals";
import { Reviews } from "../../../components/Reviews/Reviews";
import { FAQ } from "../../../components/FAQ/FAQ";
import "./Home.css";

export const Hme = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
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
      <Reviews />
      <FAQ />
    </main>
  );
};

export default Hme;
