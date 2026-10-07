"use client";

import React, { useState, useEffect } from "react";
import { WhatsAppIcon, XIcon } from "./Icons";
import { createOrder } from "../../utils/api";
import {
  generateWhatsAppOrderMessage,
  openWhatsAppOrder,
  validateCustomerDetails,
  formatRupees,
} from "../../utils/whatsappOrder";
import "./CustomerDetailsModal.css";

export const CustomerDetailsModal = ({
  isOpen,
  onClose,
  items = [],
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  actionTitle = "Buy on WhatsApp",
  onSuccess,
}) => {
  const [details, setDetails] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  // Load saved details from localStorage if previously entered
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("flint_customer_info");
        if (saved) {
          const parsed = JSON.parse(saved);
          setDetails({
            name: parsed.name || "",
            address: parsed.address || "",
            pincode: parsed.pincode || "",
            phone: parsed.phone || "",
          });
        }
      } catch (err) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    let cleanVal = value;
    if (field === "pincode") {
      cleanVal = value.replace(/\D/g, "").slice(0, 6);
    } else if (field === "phone") {
      cleanVal = value.replace(/\D/g, "").slice(0, 10);
    }

    setDetails((prev) => ({ ...prev, [field]: cleanVal }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateCustomerDetails(details);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Save for customer convenience next time
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flint_customer_info", JSON.stringify(details));
      } catch (err) {
        // ignore
      }
    }

    // Generate exact WhatsApp message
    const { orderReference, message } = generateWhatsAppOrderMessage({
      cartItems: items,
      customerDetails: details,
      subtotal,
      shippingFee,
      total,
    });

    // Asynchronously record order to backend database for admin tracking (non-blocking)
    try {
      createOrder({
        orderReference,
        customer: {
          name: details.name,
          phone: details.phone,
          address: details.address,
          pincode: details.pincode,
        },
        items: items.map((it) => {
          const p = it.product || it;
          return {
            product: p._id || p.id,
            name: p.name,
            quantity: it.quantity || 1,
            price: p.price,
            size: it.size || "Free Size",
            color: p.color || it.variant || "",
          };
        }),
        subtotal,
        shippingFee,
        finalTotal: total,
        source: "FLINTSECTOR Website",
        paymentMethod: "WhatsApp Checkout",
      }).catch((err) => {
        console.warn("Backend order recording skipped:", err.message);
      });
    } catch (err) {
      // non-blocking
    }

    // Open WhatsApp
    openWhatsAppOrder(message);

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="customer-modal-backdrop" onClick={onClose}>
      <div
        className="customer-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-modal-title"
      >
        <div className="customer-modal-pull-bar" aria-hidden="true" />

        <div className="customer-modal-header">
          <div>
            <div className="customer-modal-eyebrow">
              <span className="eyebrow-dot" />
              <span>Direct WhatsApp Order</span>
            </div>
            <h2 id="customer-details-modal-title" className="customer-modal-title">
              Delivery Details
            </h2>
            <p className="customer-modal-subtitle">
              Enter your shipping info to complete your order on WhatsApp.
            </p>
          </div>
          <button
            type="button"
            className="customer-modal-close"
            onClick={onClose}
            aria-label="Close delivery details modal"
          >
            <XIcon size={15} />
          </button>
        </div>

        {/* Order Item Preview */}
        {items.length > 0 && (
          <div className="customer-modal-summary">
            <div className="modal-summary-header">
              <span>Order Summary</span>
              <span className="modal-summary-count">
                {items.reduce((acc, it) => acc + (it.quantity || 1), 0)}{" "}
                {items.length === 1 && (items[0].quantity || 1) === 1
                  ? "item"
                  : "items"}
              </span>
            </div>
            <div className="modal-summary-items">
              {items.map((it, idx) => {
                const p = it.product || it;
                return (
                  <div key={idx} className="modal-summary-item">
                    <div className="modal-summary-item-info">
                      <span className="summary-qty-badge">{it.quantity || 1}×</span>
                      <span className="summary-item-name">{p.name}</span>
                      {it.size && (
                        <span className="summary-size-badge">{it.size}</span>
                      )}
                    </div>
                    <strong>
                      {formatRupees((p.price || 0) * (it.quantity || 1))}
                    </strong>
                  </div>
                );
              })}
            </div>
            <div className="modal-summary-total">
              <div className="modal-total-label-wrap">
                <span className="modal-total-label">Final Total</span>
                <span className="modal-total-sublabel">Inclusive of all taxes</span>
              </div>
              <span className="modal-total-price">{formatRupees(total)}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="customer-form-group">
            <label htmlFor="customer-name">
              Full Name <span className="field-required">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              className={`customer-input ${errors.name ? "error" : ""}`}
              placeholder="e.g. Rahul Sharma"
              value={details.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            {errors.name && <div className="customer-input-error">{errors.name}</div>}
          </div>

          <div className="customer-form-group">
            <label htmlFor="customer-address">
              Delivery Address <span className="field-required">*</span>
            </label>
            <textarea
              id="customer-address"
              className={`customer-textarea ${errors.address ? "error" : ""}`}
              placeholder="House/Flat no, Street, Landmark, City..."
              value={details.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
            {errors.address && (
              <div className="customer-input-error">{errors.address}</div>
            )}
          </div>

          <div className="customer-form-row">
            <div className="customer-form-group">
              <label htmlFor="customer-pincode">
                Pincode <span className="field-required">*</span>
              </label>
              <input
                id="customer-pincode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={`customer-input ${errors.pincode ? "error" : ""}`}
                placeholder="6-digit PIN"
                value={details.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                required
              />
              {errors.pincode && (
                <div className="customer-input-error">{errors.pincode}</div>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="customer-phone">
                Phone Number <span className="field-required">*</span>
              </label>
              <div className={`customer-phone-group ${errors.phone ? "error" : ""}`}>
                <span className="customer-phone-code">+91</span>
                <input
                  id="customer-phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={10}
                  className="customer-phone-input"
                  placeholder="10-digit mobile"
                  value={details.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              {errors.phone && (
                <div className="customer-input-error">{errors.phone}</div>
              )}
            </div>
          </div>

          <button type="submit" className="customer-whatsapp-submit-btn">
            <WhatsAppIcon size={19} />
            <span>{actionTitle}</span>
            <span className="customer-btn-arrow">→</span>
          </button>

          <p className="customer-privacy-hint">
            <span className="privacy-badge-icon">🔒</span> Direct WhatsApp checkout • Sent securely to <strong>FlintSector</strong> (+91 9526304560).
          </p>
        </form>
      </div>
    </div>
  );
};
