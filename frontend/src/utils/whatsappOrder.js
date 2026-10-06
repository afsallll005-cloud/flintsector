// Flint Sector Official WhatsApp Ordering System
// WhatsApp Business Number: +91 9526304560
export const WHATSAPP_PHONE_NUMBER = "919526304560";

/**
 * Format price as rupees: e.g. ₹699, ₹1650
 */
export const formatRupees = (val) => {
  const num = Math.round(Number(String(val).replace(/[^0-9.]/g, "")) || 0);
  return `₹${num}`;
};

/**
 * Generate a unique, short, uppercase alphanumeric order reference
 * Format: FL-XXXXXXXX (8 random alphanumeric characters)
 * Example: FL-Z4GRTD7A
 */
export const generateOrderReference = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 8; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return `FL-${token}`;
};

/**
 * Get dynamic product URL resolving origin in browser / fallback
 */
export const getProductUrl = (product) => {
  let origin = "https://flintsector-1eqj.vercel.app";
  if (typeof window !== "undefined" && window.location.origin) {
    const cur = window.location.origin;
    if (!cur.includes("localhost") && !cur.includes("127.0.0.1") && !cur.includes("0.0.0.0")) {
      origin = cur;
    }
  }
  const id = product?.id || product?.slug || "";
  return `${origin}/product/${id}`;
};

/**
 * Validate customer details
 * - Name: required
 * - Delivery Address: required
 * - Pincode: exactly 6 digits
 * - Phone: at least 10 digits
 */
export const validateCustomerDetails = (details) => {
  const errors = {};

  const name = String(details?.name || "").trim();
  if (!name) {
    errors.name = "Enter your full name";
  }

  const address = String(details?.address || "").trim();
  if (!address) {
    errors.address = "Enter your complete delivery address";
  }

  const cleanPincode = String(details?.pincode || "").replace(/\D/g, "");
  if (!cleanPincode || cleanPincode.length !== 6) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  const cleanPhone = String(details?.phone || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate exact WhatsApp order message required by FlintSector specification
 *
 * Visual format:
 * FLINTSECTOR CART ORDER
 * Order Reference: FL-Z4GRTD7A
 * Source: FLINTSECTOR Website
 * Number of Products: 1
 *
 * Raglan Half Sleeve Olive Green
 * Variant: Green & Cream
 * Size: S
 * Quantity: 1
 * Unit Price: ₹699
 * Item Total: ₹699
 * Product Link: https://flintsector-1eqj.vercel.app/product/raglan-half-green
 *
 * *ORDER SUMMARY*
 * Subtotal: ₹699
 * Shipping: ₹99
 * Total: ₹798
 *
 * *Customer Details*
 * Name: ...
 * Delivery Address: ...
 * Pincode: ...
 * Phone Number: ...
 *
 * Please confirm product availability, delivery details, payment method, and the final order total.
 */
export const generateWhatsAppOrderMessage = ({
  cartItems = [],
  customerDetails = {},
  subtotal = 0,
  shippingFee = 0,
  total = 0,
  orderReference,
}) => {
  const ref = orderReference || generateOrderReference();
  const items = Array.isArray(cartItems) ? cartItems : [];
  const numberOfProducts = items.length;

  const productBlocks = items.map((item) => {
    const product = item.product || item;
    const name = product.name || "Flint Sector Product";
    const variant = product.color || item.variant || "Standard";
    const size = item.size || "Free Size";
    const quantity = Number(item.quantity) || 1;
    const rawPrice =
      typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
    const unitPrice = Math.round(rawPrice);
    const itemTotal = unitPrice * quantity;
    const productLink = getProductUrl(product);

    return [
      name,
      `Variant: ${variant}`,
      `Size: ${size}`,
      `Quantity: ${quantity}`,
      `Unit Price: ${formatRupees(unitPrice)}`,
      `Item Total: ${formatRupees(itemTotal)}`,
      `Product Link: ${productLink}`,
    ].join("\n");
  });

  const lines = [
    "FLINTSECTOR CART ORDER",
    `Order Reference: ${ref}`,
    "Source: FLINTSECTOR Website",
    `Number of Products: ${numberOfProducts}`,
    "",
    productBlocks.join("\n\n"),
    "",
    "*ORDER SUMMARY*",
    `Subtotal: ${formatRupees(subtotal)}`,
    `Shipping: ${formatRupees(shippingFee)}`,
    `Total: ${formatRupees(total)}`,
    "",
    "*Customer Details*",
    `Name: ${customerDetails?.name ? String(customerDetails.name).trim() : ""}`,
    `Delivery Address: ${customerDetails?.address ? String(customerDetails.address).trim() : ""}`,
    `Pincode: ${customerDetails?.pincode ? String(customerDetails.pincode).trim() : ""}`,
    `Phone Number: ${customerDetails?.phone ? String(customerDetails.phone).trim() : ""}`,
    "",
    "Please confirm product availability, delivery details, payment method, and the final order total.",
  ];

  return {
    orderReference: ref,
    message: lines.join("\n"),
  };
};

/**
 * Open WhatsApp with encoded message
 */
export const openWhatsAppOrder = (message) => {
  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encoded}`;

  if (typeof window !== "undefined") {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return whatsappUrl;
};
