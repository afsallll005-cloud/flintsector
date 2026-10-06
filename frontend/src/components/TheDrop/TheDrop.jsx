"use client";

import "./TheDrop.css";

const collections = [
  {
    label: " COLLECTIONS",
    title: "Bestsellers",
    button: "SHOP NOW",
    image: "/images/Bestsellers.png",
    className: "drop-large",
  },
  {
    label: "EXCLUSIVE DROP",
    title: "New",
    button: "EXPLORE",
    image: "/images/Neww.jpg",
    className: "drop-small",
  },
];

export default function TheDrop() {
  return (
    <section className="the-drop">

      {/* HEADER */}
      <div className="drop-header">
        <h2>The Drop</h2>

        <a href="#" className="drop-view-all">
          VIEW ALL COLLECTIONS
        </a>
      </div>

      {/* COLLECTIONS */}
      <div className="drop-grid">

        {collections.map((collection) => (
          <a
            href="#"
            className={`drop-card ${collection.className}`}
            key={collection.title}
          >
            {/* IMAGE */}
            <img
              src={collection.image}
              alt={collection.title}
              className="drop-image"
            />

            {/* DARK GRADIENT */}
            <div className="drop-overlay"></div>

            {/* CONTENT */}
            <div className="drop-content">

              <span className="drop-label">
                {collection.label}
              </span>

              <h3>{collection.title}</h3>

              <button className="drop-button">
                {collection.button}
              </button>

            </div>
          </a>
        ))}

      </div>

    </section>
  );
}