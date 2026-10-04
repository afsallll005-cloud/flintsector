"use client";

import React, { useState, useEffect } from "react";
import { WhatsAppIcon } from "./Icons";
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
    const { message } = generateWhatsAppOrderMessage({
      cartItems: items,
      customerDetails: details,
      subtotal,
      shippingFee,
      total,
    });

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
        <div className="customer-modal-header">
          <div>
            <h2 id="customer-details-modal-title" className="customer-modal-title">
              DELIVERY <span>DETAILS</span>
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
            &times;
          </button>
        </div>

        {/* Order Item Preview */}
        {items.length > 0 && (
          <div className="customer-modal-summary">
            {items.map((it, idx) => {
              const p = it.product || it;
              return (
                <div key={idx} className="modal-summary-item">
                  <span>
                    {it.quantity}x {p.name} ({it.size || "Free Size"})
                  </span>
                  <strong>{formatRupees((p.price || 0) * (it.quantity || 1))}</strong>
                </div>
              );
            })}
            <div className="modal-summary-total">
              <span>Final Total:</span>
              <span>{formatRupees(total)}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="customer-form-group">
            <label htmlFor="customer-name">Full Name *</label>
            <input
              id="customer-name"
              type="text"
              className={`customer-input ${errors.name ? "error" : ""}`}
              placeholder="Enter your name"
              value={details.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            {errors.name && <div className="customer-input-error">{errors.name}</div>}
          </div>

          <div className="customer-form-group">
            <label htmlFor="customer-address">Delivery Address *</label>
            <textarea
              id="customer-address"
              className={`customer-textarea ${errors.address ? "error" : ""}`}
              placeholder="Enter your complete delivery address"
              value={details.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
            {errors.address && (
              <div className="customer-input-error">{errors.address}</div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="customer-form-group">
              <label htmlFor="customer-pincode">Pincode *</label>
              <input
                id="customer-pincode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={`customer-input ${errors.pincode ? "error" : ""}`}
                placeholder="Enter 6-digit pincode"
                value={details.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                required
              />
              {errors.pincode && (
                <div className="customer-input-error">{errors.pincode}</div>
              )}
            </div>

            <div className="customer-form-group">
              <label htmlFor="customer-phone">Phone Number *</label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="tel"
                maxLength={10}
                className={`customer-input ${errors.phone ? "error" : ""}`}
                placeholder="Enter 10-digit mobile number"
                value={details.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
              {errors.phone && (
                <div className="customer-input-error">{errors.phone}</div>
              )}
            </div>
          </div>

          <button type="submit" className="customer-whatsapp-submit-btn">
            <WhatsAppIcon size={18} />
            <span>{actionTitle}</span>
          </button>

          <p className="customer-privacy-hint">
            You will be redirected to WhatsApp to send this order directly to FlintSector (+91 9526304560).
          </p>
        </form>
      </div>
    </div>
  );
};
