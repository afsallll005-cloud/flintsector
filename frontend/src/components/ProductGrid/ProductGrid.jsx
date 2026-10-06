"use client";

import React from "react";
import "./ProductGrid.css";

const products = [
  {
    badge: "LIMITED",
    category: "OUTERWEAR",
    name: "Suede Moto Jacket",
    price: "$490",
    image: "/images/Product01.png",
  },
  {
    badge: "NEW",
    category: "OUTERWEAR",
    name: "Elevation Oversized Jacket",
    price: "$285",
    image: "/images/Product02.png",
  },
  {
    badge: "BEST SELLER",
    category: "TOPS",
    name: "Kinetic Hoodie",
    price: "$195",
    image: "/images/Product03.png",
  },
  {
    badge: "LIMITED",
    category: "BOTTOMS",
    name: "Shadow Slim Trouser",
    price: "$165",
    image: "/images/Product04.png",
  },
   {
    badge: "LIMITED",
    category: "BOTTOMS",
    name: "Shadow Slim Trouser",
    price: "$165",
    image: "/images/Product05.png",
  },
   {
    badge: "LIMITED",
    category: "BOTTOMS",
    name: "Shadow Slim Trouser",
    price: "$165",
    image: "/images/Product06.png",
  },
  {
    badge: "LIMITED",
    category: "BOTTOMS",
    name: "Shadow Slim Trouser",
    price: "$165",
    image: "/images/Product07.png",
  },
   {
    badge: "LIMITED",
    category: "BOTTOMS",
    name: "Shadow Slim Trouser",
    price: "$165",
    image: "/images/Product08.png",
  },
];

export default function ProductGrid() {
  return (
    <section className="product-section">

      {/* HEADER */}
      <div className="product-header">
        <h2>All Products</h2>

        <span className="product-count">
          {products.length} ITEMS
        </span>
      </div>


      {/* PRODUCTS */}
      <div className="product-grid">

        {products.map((product, index) => (
          <article className="product-card" key={`${product.name}-${index}`}>

            {/* IMAGE */}
            <div className="product-image-wrapper">

              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />

              {/* BADGE */}
              <span className="product-badge">
                {product.badge}
              </span>

              {/* QUICK VIEW */}
              <button
                className="quick-view"
                aria-label={`Quick view ${product.name}`}
              >
                ↗
              </button>

            </div>


            {/* DETAILS */}
            <div className="product-details">

              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <p className="product-price">
                {product.price}
              </p>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}