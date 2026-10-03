"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import {
  XIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
} from "../common/Icons";
import "./CartDrawer.css";

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

  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const shippingProgressPct = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!discountCode) return;
    applyPromoCode(discountCode);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showToast("Please fill in your delivery details", "error");
      return;
    }
    setCheckoutStep(2);
    showToast("🎉 Order placed successfully! Confirmation SMS dispatched.", "success");
  };

  return (
    <>
      <div
        className={`cart-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside className={`cart-drawer-panel ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBagIcon size={18} />
            <h2 className="cart-title">
              Your Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            className="icon-btn"
            onClick={() => setIsCartOpen(false)}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-text">
            <span>
              {isFreeShipping && subtotal > 0
                ? "🎉 You've unlocked FREE EXPRESS SHIPPING!"
                : `Add ₹${remainingForFreeShipping} more for FREE shipping`}
            </span>
            <span>{shippingProgressPct}%</span>
          </div>
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${shippingProgressPct}%` }}
            />
          </div>
        </div>

        {/* Cart Items or Empty State */}
        <div className="cart-items-scroll">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBagIcon size={44} />
              <h3 className="cart-empty-title">Your bag is empty</h3>
              <p className="cart-empty-desc">
                Looks like you haven&apos;t added any heavyweight pieces to your collection yet.
              </p>
              <button
                type="button"
                className="cart-checkout-btn"
                onClick={() => setIsCartOpen(false)}
                style={{ width: "auto", padding: "12px 28px", marginTop: "12px" }}
              >
                <span>Explore Drops</span>
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="cart-item-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.product.frontImage}
                  alt={item.product.name}
                  className="cart-item-thumb"
                />

                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <span className="cart-item-size-tag">Size: {item.size}</span>
                  <div>
                    <span className="cart-item-price">
                      ₹{item.product.price}
                    </span>
                  </div>

                  <div className="cart-qty-controls">
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product.id, item.size, -1)}
                    >
                      -
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item.product.id, item.size, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="cart-item-remove-btn"
                  onClick={() => removeFromCart(item.product.id, item.size)}
                  title="Remove item"
                >
                  <XIcon size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Coupon Code Section */}
        {cart.length > 0 && (
          <div className="cart-coupon-box">
            {appliedDiscount ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                <span style={{ color: "#25d366", fontWeight: 800 }}>
                  ✓ {appliedDiscount.label} ({appliedDiscount.code})
                </span>
                <button
                  type="button"
                  onClick={removePromoCode}
                  style={{ color: "#d12b2b", fontSize: "11px", fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCode} className="cart-coupon-form">
                <input
                  type="text"
                  placeholder="Promo Code (try FLINT10)"
                  className="cart-coupon-input"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button type="submit" className="cart-coupon-btn">
                  Apply
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="cart-footer-summary">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: "#25d366" }}>
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Shipping</span>
              <span>{isFreeShipping ? "FREE" : `₹${shippingFee}`}</span>
            </div>

            <div className="cart-summary-line total">
              <span>Total Amount</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => setIsCheckingOut(true)}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRightIcon size={14} />
            </button>
          </div>
        )}
      </aside>

      {/* Mock Checkout Modal */}
      {isCheckingOut && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setIsCheckingOut(false)}
        >
          <div
            style={{
              width: "min(92vw, 460px)",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {checkoutStep === 1 ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 900, textTransform: "uppercase" }}>
                    Express Delivery Checkout
                  </h3>
                  <button type="button" onClick={() => setIsCheckingOut(false)}>
                    <XIcon size={18} />
                  </button>
                </div>

                <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Sharma"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                      Mobile Number (for Order Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                      Delivery Address & City
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat, Street, Area, City"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "6px" }}>
                      Payment Method
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("prepaid")}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: deliveryMethod === "prepaid" ? "2px solid #111" : "1px solid #ddd",
                          background: deliveryMethod === "prepaid" ? "#f6f6f6" : "#fff",
                          fontWeight: 800,
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        UPI / Prepaid (Free Ship)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod("cod")}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: deliveryMethod === "cod" ? "2px solid #111" : "1px solid #ddd",
                          background: deliveryMethod === "cod" ? "#f6f6f6" : "#fff",
                          fontWeight: 800,
                          fontSize: "11px",
                          textTransform: "uppercase",
                        }}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>

                  <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginTop: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 800 }}>
                      <span>Payable Total:</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="cart-checkout-btn"
                    style={{ marginTop: "10px" }}
                  >
                    <span>PLACE ORDER (MOCK)</span>
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: "60px", height: "60px", background: "#e6f8ed", color: "#25d366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <BadgeCheckIcon size={32} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, textTransform: "uppercase", marginBottom: "8px" }}>
                  Order Confirmed!
                </h3>
                <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px" }}>
                  Thank you, <strong>{customerInfo.name}</strong>! Your streetwear drop has been queued for 24hr express dispatch.
                </p>
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={() => {
                    setIsCheckingOut(false);
                    setCheckoutStep(1);
                    setIsCartOpen(false);
                  }}
                >
                  <span>Continue Shopping</span>
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
