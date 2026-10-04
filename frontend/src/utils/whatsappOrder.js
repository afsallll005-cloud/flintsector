// Flint Sector Official WhatsApp Ordering System
// WhatsApp Business Number: +91 9526304560
export const WHATSAPP_PHONE_NUMBER = "919526304560";

/**
 * Format price as integer or decimal rupees: e.g. ₹699, ₹1,299
 */
export const formatRupees = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
};

/**
 * Generate a unique, short, uppercase alphanumeric order reference
 * Format: FL-XXXXXXXX (8 random alphanumeric characters)
 * Example: FL-7A42K9P1
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
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://flintsector.com";
  
  const id = product?.id || product?.slug || "";
  return `${origin}/product/${id}`;
};

/**
 * Validate customer details
 * - Name: required
 * - Delivery Address: required
 * - Pincode: exactly 6 digits
 * - Phone: exactly 10 digits
 */
export const validateCustomerDetails = (details) => {
  const errors = {};

  const name = String(details?.name || "").trim();
  if (!name) {
    errors.name = "Enter your name";
  }

  const address = String(details?.address || "").trim();
  if (!address) {
    errors.address = "Enter your complete delivery address";
  }

  const cleanPincode = String(details?.pincode || "").replace(/\D/g, "");
  if (!cleanPincode || cleanPincode.length !== 6) {
    errors.pincode = "Enter 6-digit pincode";
  }

  const cleanPhone = String(details?.phone || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length !== 10) {
    errors.phone = "Enter 10-digit mobile number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate exact WhatsApp order message required by FlintSector specification
 * 
 * Structure:
 * FLINTSECTOR CART ORDER
 * 
 * Order Reference: FL-XXXXXXXX
 * Source: FLINTSECTOR Website
 * Number of Products: X
 * 
 * 1. Product Name
 *    Variant: ...
 *    Size: ...
 *    Quantity: ...
 *    Unit Price: ₹...
 *    Item Total: ₹...
 *    Product Link: ...
 * 
 * ORDER SUMMARY
 * Subtotal: ₹...
 * Shipping: ₹...
 * Total: ₹...
 * 
 * Customer Details
 * Name: ...
 * Delivery Address: ...
 * Pincode: ...
 * Phone Number: ...
 * 
 * Please confirm product availability, delivery details, payment method, and the final order total.
 */
export const generateWhatsAppOrderMessage = ({
  cartItems,
  customerDetails,
  subtotal,
  shippingFee,
  total,
  orderReference,
}) => {
  const ref = orderReference || generateOrderReference();
  const itemsCount = cartItems?.length || 0;

  const productBlocks = (cartItems || []).map((item, index) => {
    const product = item.product || item;
    const name = product.name || "Flint Sector Streetwear";
    const variant = product.color || item.variant || "N/A";
    const size = item.size || "N/A";
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(product.price) || 0;
    const itemTotal = unitPrice * quantity;
    const productLink = getProductUrl(product);

    return [
      `${index + 1}. ${name}`,
      `   Variant: ${variant}`,
      `   Size: ${size}`,
      `   Quantity: ${quantity}`,
      `   Unit Price: ${formatRupees(unitPrice)}`,
      `   Item Total: ${formatRupees(itemTotal)}`,
      `   Product Link: ${productLink}`,
    ].join("\n");
  });

  const lines = [
    "FLINTSECTOR CART ORDER",
    "",
    `Order Reference: ${ref}`,
    "Source: FLINTSECTOR Website",
    `Number of Products: ${itemsCount}`,
    "",
    productBlocks.join("\n\n"),
    "",
    "ORDER SUMMARY",
    `Subtotal: ${formatRupees(subtotal)}`,
    `Shipping: ${formatRupees(shippingFee)}`,
    `Total: ${formatRupees(total)}`,
    "",
    "Customer Details",
    `Name: ${customerDetails?.name?.trim() || ""}`,
    `Delivery Address: ${customerDetails?.address?.trim() || ""}`,
    `Pincode: ${customerDetails?.pincode?.trim() || ""}`,
    `Phone Number: ${customerDetails?.phone?.trim() || ""}`,
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
