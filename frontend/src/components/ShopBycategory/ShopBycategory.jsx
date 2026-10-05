"use client";

import "./ShopBycategory.css";

const categories = [
  {
    name: "Oversize T-shirts",
    products: "24 PRODUCTS",
    // image: "/images/oversize.png",
    image: "/images/tshirtwithicon.png",

  },
  {
    name: "Jerseys",
    products: "12 PRODUCTS",
    // image: "/images/jersey.png",
    image: "/images/jerseywithicon.png",

  },
  {
    name: "Pants",
    products: "18 PRODUCTS",
    // image: "/images/pants.png",
    image: "/images/pantwithicon.png",
  },
];

export default function ShopByCategory() {
  return (
    <section className="shop-category">

      {/* HEADER */}
      <div className="shop-category-header">

        <h2>
          Shop by <span>Category</span>
        </h2>

        <a href="#" className="view-all">
          <span>VIEW ALL</span>
          <b>↗</b>
        </a>

      </div>


      {/* CATEGORY CARDS */}
      <div className="category-grid">

        {categories.map((category, index) => (

          <a
            href="#"
            className={`category-card category-${index + 1}`}
            key={category.name}
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