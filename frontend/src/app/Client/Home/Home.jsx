"use client";

import React, { useState } from "react";
import { EditorialBanner } from "../../../components/EditorialBanner/EditorialBanner";
import "./Home.css";
import ShopByCategory from "@/components/ShopBycategory/ShopBycategory";
import TheDrop from "@/components/TheDrop/TheDrop";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import Reviews from "@/components/Reviews/Reviews";
import FAQ from "@/components/FAQ/FAQ";
import Hero from "@/components/Hero/Hero";

export const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <main className="main-content">
      <Hero />
      <ShopByCategory onSelectCategory={handleCategorySelect} />
      <TheDrop />

      

      <ProductGrid />
      <EditorialBanner />

      <Reviews />
      <FAQ />
    </main>
  );
};

export default Home;
