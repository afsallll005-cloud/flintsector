"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import {
  XIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
} from "../common/Icons";

import { createOrder } from "../../utils/api";

import {
  generateWhatsAppOrderMessage,
  openWhatsAppOrder,
  generateOrderReference,
  validateCustomerDetails,
  WHATSAPP_PHONE_NUMBER,
} from "../../utils/whatsappOrder";

import "./CartDrawer.css";

const WHATSAPP_ORDER_NUMBER = WHATSAPP_PHONE_NUMBER;

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    appliedDiscount,
    discountCode,
    setDiscountCode,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    isFreeShipping,
    shippingFee,
    finalTotal,
    showToast,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("prepaid");

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  /* --------------------------------
     LOAD SAVED CUSTOMER INFORMATION
  -------------------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("flint_customer_info");

      if (saved) {
        const parsed = JSON.parse(saved);

        setCustomerInfo({
          name: parsed.name || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
          pincode: parsed.pincode || "",
        });
      }
    } catch (error) {
      console.warn("Could not load customer information");
    }
  }, [isCheckingOut]);

  /* --------------------------------
     ESCAPE KEY
  -------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (isCheckingOut) {
          setIsCheckingOut(false);
        } else if (isCartOpen) {
          setIsCartOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCartOpen, isCheckingOut, setIsCartOpen]);

  /* --------------------------------
     BODY SCROLL LOCK
  -------------------------------- */

  useEffect(() => {
    if (!isCartOpen && !isCheckingOut) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen, isCheckingOut]);

  /* --------------------------------
     SHIPPING PROGRESS
  -------------------------------- */

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );

  const shippingProgressPct =
    freeShippingThreshold > 0
      ? Math.min(
          100,
          Math.round(
            (subtotal / freeShippingThreshold) * 100
          )
        )
      : 0;

  /* --------------------------------
     CART COUNT
  -------------------------------- */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* --------------------------------
     PROMO
  -------------------------------- */

  const handleApplyCode = (event) => {
    event.preventDefault();

    if (!discountCode?.trim()) return;

    applyPromoCode(discountCode);
  };

  /* --------------------------------
     CUSTOMER INPUT
  -------------------------------- */

  const updateCustomerInfo = (field, value) => {
    setCustomerInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* --------------------------------
     PLACE ORDER
  -------------------------------- */

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    const validation =
      validateCustomerDetails(customerInfo);

    if (!validation.isValid) {
      const firstError =
        Object.values(validation.errors)[0];

      showToast(
        firstError ||
          "Please fill in your delivery details",
        "error"
      );

      return;
    }

    if (!cart.length) {
      showToast("Your bag is empty", "error");
      return;
    }

    /* Save customer information */

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "flint_customer_info",
          JSON.stringify(customerInfo)
        );
      } catch (error) {
        // Ignore storage errors
      }
    }

    const orderReference =
      generateOrderReference();

    const { message } =
      generateWhatsAppOrderMessage({
        cartItems: cart,
        customerDetails: customerInfo,
        subtotal,
        shippingFee,
        total: finalTotal,
        orderReference,
      });

    const paymentMethod =
      deliveryMethod === "cod"
        ? "Cash on Delivery"
        : "UPI / Prepaid";

    /* --------------------------------
       BACKEND ORDER
    -------------------------------- */

    createOrder({
      orderReference,
      customer: customerInfo,

      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.product.color || "",
        image: item.product.frontImage || "",
      })),

      subtotal,
      shippingFee,
      discountAmount,
      finalTotal,
      paymentMethod,
      source: "WhatsApp Checkout",
    }).catch((error) => {
      console.warn(
        "Could not sync order to backend:",
        error.message
      );
    });

    /* --------------------------------
       WHATSAPP
    -------------------------------- */

    openWhatsAppOrder(message);

    setCheckoutStep(2);

    showToast(
      "Opening WhatsApp with your order details...",
      "success"
    );
  };

  /* --------------------------------
     CLOSE EVERYTHING
  -------------------------------- */

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const closeCheckout = () => {
    setIsCheckingOut(false);
    setCheckoutStep(1);
  };

  /* --------------------------------
     RENDER
  -------------------------------- */

  return (
    <>
      {/* ==========================================
          CART BACKDROP
      ========================================== */}

      <div
        className={`cart-backdrop ${
          isCartOpen ? "open" : ""
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ==========================================
          CART DRAWER
      ========================================== */}

      <aside
        className={`cart-drawer-panel ${
          isCartOpen ? "open" : ""
        }`}
        aria-label="Shopping cart"
      >
        {/* HEADER */}

        <header className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <ShoppingBagIcon size={17} />
            </div>

            <div>
              <span className="cart-header-eyebrow">
                FLINTSECTOR
              </span>

              <h2 className="cart-title">
                YOUR BAG
                <span className="cart-count">
                  {String(cartCount).padStart(2, "0")}
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close cart"
            className="cart-close-btn"
            onClick={closeCart}
          >
            <XIcon size={17} />
          </button>
        </header>

        {/* ==========================================
            FREE SHIPPING
        ========================================== */}

        {cart.length > 0 && (
          <div className="shipping-progress-box">
            <div className="shipping-progress-top">
              <span>
                {isFreeShipping
                  ? "FREE SHIPPING UNLOCKED"
                  : "FREE SHIPPING"}
              </span>

              <span>
                {shippingProgressPct}%
              </span>
            </div>

            <div className="shipping-progress-track">
              <div
                className="shipping-progress-fill"
                style={{
                  width: `${shippingProgressPct}%`,
                }}
              />
            </div>

            <p className="shipping-progress-message">
              {isFreeShipping
                ? "Your order qualifies for free express shipping."
                : `Add ₹${remainingForFreeShipping.toLocaleString(
                    "en-IN"
                  )} more to unlock free shipping.`}
            </p>
          </div>
        )}

        {/* ==========================================
            CART ITEMS
        ========================================== */}

        <div className="cart-items-scroll">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-bag-icon">
                <ShoppingBagIcon size={34} />
              </div>

              <span className="empty-eyebrow">
                FLINTSECTOR / BAG
              </span>

              <h3 className="cart-empty-title">
                YOUR BAG IS EMPTY
              </h3>

              <p className="cart-empty-desc">
                Your next essential piece is waiting.
                Explore the latest Flint Sector drops.
              </p>

              <button
                type="button"
                className="empty-shop-btn"
                onClick={closeCart}
              >
                <span>EXPLORE DROPS</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <article
                key={`${item.product.id}-${item.size}`}
                className="cart-item-row"
              >
                {/* NUMBER */}

                <span className="cart-item-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* IMAGE */}

                <div className="cart-item-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.frontImage}
                    alt={item.product.name}
                    className="cart-item-thumb"
                  />
                </div>

                {/* INFORMATION */}

                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-category">
                        {item.product.categoryName ||
                          "FLINT SECTOR"}
                      </span>

                      <h4 className="cart-item-name">
                        {item.product.name}
                      </h4>
                    </div>

                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.size
                        )
                      }
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <XIcon size={13} />
                    </button>
                  </div>

                  <div className="cart-item-tags">
                    <span>
                      SIZE / {item.size}
                    </span>

                    {item.product.color && (
                      <span>
                        {item.product.color}
                      </span>
                    )}
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            -1
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <strong className="cart-item-price">
                      ₹
                      {item.product.price.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* ==========================================
            COUPON
        ========================================== */}

        {cart.length > 0 && (
          <div className="cart-coupon-box">
            {appliedDiscount ? (
              <div className="applied-discount">
                <div>
                  <span className="discount-success">
                    ✓ {appliedDiscount.label}
                  </span>

                  <span className="discount-code">
                    {appliedDiscount.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={removePromoCode}
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleApplyCode}
                className="cart-coupon-form"
              >
                <div className="coupon-label">
                  PROMO CODE
                </div>

                <div className="coupon-input-row">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    value={discountCode}
                    onChange={(event) =>
                      setDiscountCode(
                        event.target.value
                      )
                    }
                    className="cart-coupon-input"
                  />

                  <button
                    type="submit"
                    className="cart-coupon-btn"
                  >
                    APPLY
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==========================================
            SUMMARY
        ========================================== */}

        {cart.length > 0 && (
          <div className="cart-footer-summary">
            <div className="summary-heading">
              <span>ORDER SUMMARY</span>
              <span>FLINT / 2026</span>
            </div>

            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line discount-line">
                <span>Discount</span>

                <span>
                  −₹
                  {discountAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Shipping</span>

              <span>
                {isFreeShipping
                  ? "FREE"
                  : `₹${shippingFee}`}
              </span>
            </div>

            <div className="cart-summary-total">
              <div>
                <span>TOTAL</span>
                <small>INCL. APPLICABLE CHARGES</small>
              </div>

              <strong>
                ₹{finalTotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => {
                setCheckoutStep(1);
                setIsCheckingOut(true);
              }}
            >
              <span>BUY ON WHATSAPP</span>

              <span className="checkout-arrow">
                <ArrowRightIcon size={15} />
              </span>
            </button>

            <p className="cart-secure-note">
              SECURE CHECKOUT · WHATSAPP ORDER CONFIRMATION
            </p>
          </div>
        )}
      </aside>

      {/* ==========================================
          CHECKOUT MODAL
      ========================================== */}

      {isCheckingOut && (
        <div
          className="checkout-overlay"
          onClick={closeCheckout}
        >
          <div
            className="checkout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {checkoutStep === 1 ? (
              <>
                {/* CHECKOUT HEADER */}

                <div className="checkout-header">
                  <div>
                    <span className="checkout-eyebrow">
                      FLINT SECTOR / CHECKOUT
                    </span>

                    <h3>
                      DELIVERY DETAILS
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="checkout-close"
                    onClick={closeCheckout}
                    aria-label="Close checkout"
                  >
                    <XIcon size={17} />
                  </button>
                </div>

                {/* FORM */}

                <form
                  onSubmit={handlePlaceOrder}
                  className="checkout-form"
                >
                  {/* NAME */}

                  <div className="checkout-field">
                    <label>
                      01 / FULL NAME
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={customerInfo.name}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "name",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  {/* PHONE */}

                  <div className="checkout-field">
                    <label>
                      02 / MOBILE NUMBER
                    </label>

                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      value={customerInfo.phone}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "phone",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="checkout-field">
                    <label>
                      03 / DELIVERY ADDRESS
                    </label>

                    <textarea
                      required
                      rows={3}
                      placeholder="Flat, street, area, city"
                      value={customerInfo.address}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "address",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  {/* PINCODE */}

                  <div className="checkout-field">
                    <label>
                      04 / PINCODE
                    </label>

                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter pincode"
                      value={customerInfo.pincode}
                      onChange={(event) =>
                        updateCustomerInfo(
                          "pincode",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  {/* PAYMENT */}

                  {/* <div className="checkout-field">
                    <label>
                      05 / PAYMENT METHOD
                    </label>

                    <div className="payment-options">
                      <button
                        type="button"
                        className={`payment-option ${
                          deliveryMethod ===
                          "prepaid"
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setDeliveryMethod(
                            "prepaid"
                          )
                        }
                      >
                        <span>
                          UPI / PREPAID
                        </span>

                        <small>
                          FREE SHIPPING
                        </small>
                      </button>

                      <button
                        type="button"
                        className={`payment-option ${
                          deliveryMethod ===
                          "cod"
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setDeliveryMethod("cod")
                        }
                      >
                        <span>
                          CASH ON DELIVERY
                        </span>

                        <small>
                          PAY AT DELIVERY
                        </small>
                      </button>
                    </div>
                  </div> */}

                  {/* TOTAL */}

                  <div className="checkout-total">
                    <span>PAYABLE TOTAL</span>

                    <strong>
                      ₹
                      {finalTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="checkout-submit"
                  >
                    <span>
                      CONFIRM & BUY ON WHATSAPP
                    </span>

                    <ArrowRightIcon size={15} />
                  </button>

                  <p className="checkout-note">
                    Your order details will be sent
                    securely to Flint Sector via
                    WhatsApp.
                  </p>
                </form>
              </>
            ) : (
              /* =====================================
                 SUCCESS
              ===================================== */

              <div className="checkout-success">
                <div className="success-icon">
                  <BadgeCheckIcon size={32} />
                </div>

                <span className="checkout-eyebrow">
                  FLINT SECTOR / ORDER
                </span>

                <h3>
                  ORDER REQUEST SENT
                </h3>

                <p>
                  Thank you,{" "}
                  <strong>
                    {customerInfo.name}
                  </strong>
                  . Your order details have been
                  sent to our WhatsApp team.
                </p>

                <button
                  type="button"
                  className="checkout-success-btn"
                  onClick={() => {
                    setIsCheckingOut(false);
                    setCheckoutStep(1);
                    setIsCartOpen(false);
                  }}
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRightIcon size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;