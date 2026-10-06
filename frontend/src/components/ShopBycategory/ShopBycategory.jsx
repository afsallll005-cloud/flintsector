"use client";

import "./ShopBycategory.css";

const categories = [
  {
    name: "Outerwear",
    slug: "outerwear",
    products: "2 STYLES",
    image: "/images/tshirtwithicon.png",
  },
  {
    name: "Tops & Hoodies",
    slug: "tops",
    products: "1 STYLE",
    image: "/images/jerseywithicon.png",
  },
  {
    name: "Pants & Bottoms",
    slug: "bottoms",
    products: "5 STYLES",
    image: "/images/pantwithicon.png",
  },
];

export default function ShopByCategory({ onSelectCategory }) {
  return (
    <section id="shop-category" className="shop-category">

      {/* HEADER */}
      <div className="shop-category-header">

        <h2>
          Shop by <span>Category</span>
        </h2>

        <a
          href="#shop"
          className="view-all"
          onClick={() => onSelectCategory && onSelectCategory("all")}
        >
          <span>VIEW ALL</span>
          <b>↗</b>
        </a>

      </div>


      {/* CATEGORY CARDS */}
      <div className="category-grid">

        {categories.map((category, index) => (

          <a
            href="#shop"
            className={`category-card category-${index + 1}`}
            key={category.name}
            onClick={() => onSelectCategory && onSelectCategory(category.slug)}
          >

            {/* IMAGE */}
            <img
              src={category.image}
              alt={category.name}
              className="category-card-image"
            />


            {/* DARK GRADIENT */}
            <div className="category-overlay"></div>


            {/* CARD CONTENT */}
            <div className="category-info">

              <div className="category-text">

                <h3>{category.name}</h3>

                <p>{category.products}</p>

              </div>


              {/* ARROW */}
              <div className="category-arrow">
                ↗
              </div>

            </div>

          </a>

        ))}

      </div>

    </section>
  );
}