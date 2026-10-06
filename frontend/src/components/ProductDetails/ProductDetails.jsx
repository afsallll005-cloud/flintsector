"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { SIZE_GUIDE, getProductGallery } from "../../data/products";
import { WhatsAppIcon } from "../common/Icons";
import { CustomerDetailsModal } from "../common/CustomerDetailsModal";
import "./ProductDetails.css";

const formatInr = (value) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ACCORDIONS = [
  {
    id: "shipping",
    title: "Shipping & Returns",
    body: "Free shipping on prepaid orders. Cash on Delivery is available across most Indian pin codes. Orders dispatch within 24 hours. Easy 7-day size exchange on unworn items with original tags.",
  },
  {
    id: "care",
    title: "Material & Care",
  },
  {
    id: "size",
    title: "Size Guide",
  },
];

export const ProductDetails = ({ product }) => {
  const { addToCart } = useCart();
  const gallery = useMemo(() => getProductGallery(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "L");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);

  if (!product) {
    return (
      <main className="pdp-page" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <p style={{ marginTop: "16px" }}>
          <Link href="/#bestsellers">← Back to shop</Link>
        </p>
      </main>
    );
  }

  const savings = Math.max(0, (product.originalPrice || 0) - (product.price || 0));
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const directSubtotal = (product.price || 0) * quantity;
  const directShipping = directSubtotal >= 999 || directSubtotal === 0 ? 0 : 99;
  const directTotal = directSubtotal + directShipping;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const openSizeGuide = () => {
    setOpenAccordion("size");
    document.getElementById("pdp-size-guide")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];

  return (
    <main className="pdp-page">
      <div className="pdp-layout">
        <section className="pdp-gallery" aria-label="Product images">
          <div className="pdp-main-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[activeImage]}
              alt={`${product.name} view ${activeImage + 1}`}
              className="pdp-main-image"
            />
            <span className="pdp-image-counter">
              {String(activeImage + 1).padStart(2, "0")} /{" "}
              {String(gallery.length).padStart(2, "0")}
            </span>
          </div>

          <div className="pdp-thumbs" role="list">
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                role="listitem"
                className={`pdp-thumb ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </section>

        <aside className="pdp-buybox">
          <p className="pdp-collection">
            {product.categoryName} Collection
          </p>
          <h1 className="pdp-title">{product.name}</h1>
          <p className="pdp-color">{product.color}</p>

          <div className="pdp-price-row">
            <span className="pdp-price-old">{formatInr(product.originalPrice)}</span>
            <span className="pdp-price-now">{formatInr(product.price)}</span>
            {savings > 0 && (
              <span className="pdp-save-badge">SAVE {formatInr(savings)}</span>
            )}
          </div>

          <p className="pdp-description">{product.description}</p>

          <div className="pdp-size-header">
            <span>Select Size</span>
            <button type="button" className="pdp-size-guide-link" onClick={openSizeGuide}>
              Size Guide →
            </button>
          </div>

          <div className="pdp-sizes" role="group" aria-label="Select size">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`pdp-size-btn ${selectedSize === size ? "active" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="pdp-cart-row">
            <div className="pdp-qty" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((qty) => qty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button type="button" className="pdp-btn-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <button
            type="button"
            className="pdp-btn-buy"
            onClick={() => setIsCustomerModalOpen(true)}
          >
            <WhatsAppIcon size={18} />
            Buy on WhatsApp
          </button>

          <div className="pdp-perks">
            <div>
              <strong>Free Shipping</strong>
              <span>On prepaid orders</span>
            </div>
            <div>
              <strong>COD Available</strong>
              <span>Pay on delivery</span>
            </div>
            <div>
              <strong>Easy Size Exchange</strong>
              <span>7-day window</span>
            </div>
            <div>
              <strong>Dispatch within 24 Hours</strong>
              <span>Priority packing</span>
            </div>
          </div>

          <div className="pdp-accordions">
            {ACCORDIONS.map((item) => {
              const isOpen = openAccordion === item.id;
              return (
                <div
                  key={item.id}
                  id={item.id === "size" ? "pdp-size-guide" : undefined}
                  className="pdp-accordion"
                >
                  <button
                    type="button"
                    className="pdp-accordion-trigger"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenAccordion((current) =>
                        current === item.id ? null : item.id
                      )
                    }
                  >
                    <span>{item.title}</span>
                    <span className="pdp-accordion-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="pdp-accordion-body">
                      {item.id === "care" && (
                        <>
                          <p>
                            <strong>Fabric:</strong> {product.fabric}
                          </p>
                          <p>
                            <strong>Weight:</strong> {product.gsm} · {product.fit}
                          </p>
                          <p>
                            Cold machine wash inside-out. Do not bleach. Tumble
                            dry low or hang dry in shade.
                          </p>
                        </>
                      )}
                      {item.id === "shipping" && <p>{item.body}</p>}
                      {item.id === "size" && (
                        <table className="pdp-size-table">
                          <thead>
                            <tr>
                              <th>Size</th>
                              <th>Chest</th>
                              <th>Length</th>
                              <th>Shoulder</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SIZE_GUIDE.filter((row) =>
                              availableSizes.includes(row.size)
                            ).map((row) => (
                              <tr key={row.size}>
                                <td>{row.size}</td>
                                <td>{row.chest}&quot;</td>
                                <td>{row.length}&quot;</td>
                                <td>{row.shoulder}&quot;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <p className="pdp-back-link">
        <Link href="/#bestsellers">← Back to shop</Link>
      </p>

      {/* WhatsApp Purchase Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        items={[
          {
            product,
            size: selectedSize,
            quantity,
            variant: product.color || "N/A",
          },
        ]}
        subtotal={directSubtotal}
        shippingFee={directShipping}
        total={directTotal}
        actionTitle="Buy on WhatsApp"
      />
    </main>
  );
};

export default ProductDetails;
