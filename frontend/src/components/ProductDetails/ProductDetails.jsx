"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { PRODUCTS } from "../../data/products";
import { CustomerDetailsModal } from "../common/CustomerDetailsModal";
import {
  generateWhatsAppOrderMessage,
  openWhatsAppOrder,
} from "../../utils/whatsappOrder";
import "./ProductDetails.css";

// Official Flint Sector WhatsApp number
const WHATSAPP_NUMBER = "919526304560";

const formatPrice = (val) => {
  if (typeof val === "number") return `₹${val.toLocaleString("en-IN")}`;
  if (typeof val === "string") {
    if (val.startsWith("₹") || val.startsWith("Rs") || val.startsWith("$")) return val;
    return `₹${val}`;
  }
  return "₹0";
};

const getProductImages = (prod) => {
  if (!prod) return ["/images/Product01.png"];
  if (Array.isArray(prod.images) && prod.images.length > 0) return prod.images;
  const list = [prod.frontImage, prod.backImage, prod.image].filter(Boolean);
  return list.length > 0 ? list : ["/images/Product01.png"];
};

export function ProductDetails({ product: initialProduct }) {
  const product = initialProduct || PRODUCTS[0];
  const { addToCart, setQuickViewProduct } = useCart();

  const images = getProductImages(product);
  const [selectedImage, setSelectedImage] = useState(0);

  const availableSizes =
    Array.isArray(product?.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L", "XL", "XXL"];

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "L");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const activeImage = images[Math.min(selectedImage, images.length - 1)] || images[0];

  const numPrice =
    typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;

  const directSubtotal = numPrice * quantity;
  const directShipping = directSubtotal >= 999 || directSubtotal === 0 ? 0 : 99;
  const directTotal = directSubtotal + directShipping;

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const cartItemProduct = {
      ...product,
      id: product.id,
      name: product.name,
      price: numPrice,
      frontImage: activeImage || images[0],
      color: product.color || "Standard",
    };

    addToCart(cartItemProduct, selectedSize, quantity);
    setCartMessage("ADDED TO CART");

    setTimeout(() => {
      setCartMessage("");
    }, 2200);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert("Please select a size before ordering.");
      return;
    }
    setIsCustomerModalOpen(true);
  };

  // Build specifications list
  const detailsList =
    Array.isArray(product?.details) && product.details.length > 0
      ? product.details
      : [
          ["Material", product?.fabric || "100% Combed Heavy Cotton, Bio-washed"],
          ["Silhouette", product?.fit || "Box-Fit Oversized"],
          ["GSM / Weight", product?.gsm || "240+ GSM Heavyweight"],
          ["Colorway", product?.color || "Heritage Streetwear Dye"],
          ["Category", product?.categoryName || product?.category || "Streetwear"],
          ["Care", "Cold machine wash inside-out, tumble dry low, do not iron on print"],
        ];

  // Related products from catalog
  const relatedProducts = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <main className="product-details-page">
      {/* BREADCRUMB */}
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/#shop" className="breadcrumb-back">
          <span>←</span> Back to All Products
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span>{product.categoryName || product.category || "Collection"}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-details-container">
        {/* =================================================
            PRODUCT GALLERY
        ================================================= */}
        <div className="product-gallery">
          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* MAIN IMAGE */}
          <div className="product-main-image">
            <img src={activeImage} alt={product.name} />

            {product.badge && (
              <span className="product-badge-overlay">{product.badge}</span>
            )}

            <span className="product-image-label">FLINT SECTOR</span>
          </div>
        </div>

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}
        <div className="product-info">
          {/* CATEGORY & BADGE ROW */}
          <div className="product-category-row">
            <span className="product-category">
              FLINT SECTOR / {product.categoryName || product.category || "COLLECTION"}
            </span>
            {product.gsm && <span className="product-gsm-pill">{product.gsm}</span>}
          </div>

          {/* NAME */}
          <h1 className="product-name">{product.name}</h1>

          {/* PRICE & DISCOUNT */}
          <div className="product-price-row">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="product-old-price">{formatPrice(product.originalPrice)}</span>
            ) : null}
            {product.discount && (
              <span className="product-discount-pill">{product.discount}</span>
            )}
          </div>

          <p className="product-taxes-note">
            Inclusive of all taxes. Free express shipping on prepaid orders over ₹999.
          </p>

          <div className="product-divider" />

          {/* DESCRIPTION */}
          <p className="product-description">{product.description}</p>

          {/* =================================================
              SIZE SELECTOR
          ================================================= */}
          <div className="product-option">
            <div className="option-header">
              <span>SELECT SIZE</span>
              {selectedSize && (
                <span className="selected-size">
                  SIZE: {selectedSize} (True to Box-Fit)
                </span>
              )}
            </div>

            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              QUANTITY SELECTOR
          ================================================= */}
          <div className="product-option quantity-option">
            <div className="option-header">
              <span>QUANTITY</span>
            </div>

            <div className="quantity-selector">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}
          <div className="product-actions">
            {/* ADD TO CART */}
            <button
              type="button"
              className={`add-to-cart-button ${
                cartMessage ? "added" : ""
              }`}
              onClick={handleAddToCart}
            >
              <span>{cartMessage || `ADD TO BAG • ${formatPrice(product.price)}`}</span>
              <span className="cart-arrow">
                {cartMessage ? "✓" : "+"}
              </span>
            </button>

            {/* WHATSAPP */}
            <button
              type="button"
              className="whatsapp-order-button"
              onClick={handleWhatsAppOrder}
            >
              <span>BUY ON WHATSAPP</span>
              <span className="whatsapp-order-arrow">↗</span>
            </button>
          </div>

          <p className="order-note">
            Select your size and quantity before adding to cart or ordering on WhatsApp.
          </p>

          {/* =================================================
              PERKS & GUARANTEES
          ================================================= */}
          <div className="product-perks-box">
            <div className="product-perk-item">
              <span className="perk-icon">⚡</span>
              <div>
                <strong>Dispatched in 24 Hours</strong>
                <p>Fast track fulfillment across India</p>
              </div>
            </div>
            <div className="product-perk-item">
              <span className="perk-icon">📦</span>
              <div>
                <strong>Free Express Shipping</strong>
                <p>On all prepaid orders over ₹999</p>
              </div>
            </div>
            <div className="product-perk-item">
              <span className="perk-icon">🔄</span>
              <div>
                <strong>7-Day Size Exchange</strong>
                <p>Hassle-free fit guarantee</p>
              </div>
            </div>
            <div className="product-perk-item">
              <span className="perk-icon">💵</span>
              <div>
                <strong>Cash on Delivery (COD)</strong>
                <p>Available on 25,000+ pin codes</p>
              </div>
            </div>
          </div>

          {/* =================================================
              PRODUCT DETAILS SPECIFICATIONS
          ================================================= */}
          <div className="product-details-section">
            <div className="details-heading">PRODUCT SPECIFICATIONS</div>

            <div className="details-list">
              {detailsList.map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          RELATED PRODUCTS SECTION
      ================================================= */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-header">
            <div>
              <span className="related-eyebrow">COMPLETE THE LOOK</span>
              <h2 className="related-title">More From Flint Sector</h2>
            </div>
            <Link href="/#shop" className="related-view-all">
              VIEW ALL ITEMS ↗
            </Link>
          </div>

          <div className="related-grid">
            {relatedProducts.map((rel) => (
              <article className="related-card" key={rel.id}>
                <div className="related-image-wrapper">
                  <Link href={`/product/${rel.id}`} className="related-image-link">
                    <img
                      src={rel.frontImage || rel.image}
                      alt={rel.name}
                      className="related-image"
                      loading="lazy"
                    />
                  </Link>

                  {rel.badge && (
                    <span className="product-badge">{rel.badge}</span>
                  )}

                  <button
                    type="button"
                    className="quick-view"
                    aria-label={`Quick view ${rel.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(rel);
                    }}
                  >
                    ↗
                  </button>
                </div>

                <Link href={`/product/${rel.id}`} className="related-details-link">
                  <div className="product-details">
                    <span className="product-category">
                      {rel.categoryName || rel.category?.toUpperCase()}
                    </span>
                    <h3>{rel.name}</h3>
                    <p className="product-price">{formatPrice(rel.price)}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CUSTOMER DETAILS MODAL FOR WHATSAPP ORDER */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        items={[
          {
            product,
            size: selectedSize,
            quantity,
          },
        ]}
        subtotal={directSubtotal}
        shippingFee={directShipping}
        total={directTotal}
        actionTitle="Buy on WhatsApp"
      />
    </main>
  );
}

export default ProductDetails;