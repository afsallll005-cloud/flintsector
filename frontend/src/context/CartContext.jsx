"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Initialize from localStorage safely
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("flint_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("flint_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (err) {
      console.error("Failed to load local storage state:", err);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("flint_cart", JSON.stringify(cart));
    } catch (err) {
      console.error(err);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("flint_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.error(err);
    }
  }, [wishlist]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, size = "L", quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, size, quantity }];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
    showToast("Item removed from bag", "info");
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`, "info");
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to wishlist`);
        return [...prev, product];
      }
    });
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "FLINT10") {
      setAppliedDiscount({ code: "FLINT10", percent: 10, label: "10% Streetwear Drop Discount" });
      showToast("Coupon 'FLINT10' applied! 10% OFF");
      return true;
    } else if (clean === "FIRSTDROP") {
      setAppliedDiscount({ code: "FIRSTDROP", flat: 150, label: "₹150 OFF Welcome Perk" });
      showToast("Coupon 'FIRSTDROP' applied! ₹150 OFF");
      return true;
    } else {
      showToast("Invalid discount coupon code", "error");
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    showToast("Coupon removed", "info");
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedDiscount?.percent) {
    discountAmount = Math.round((subtotal * appliedDiscount.percent) / 100);
  } else if (appliedDiscount?.flat) {
    discountAmount = Math.min(appliedDiscount.flat, subtotal);
  }

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        toast,
        showToast,
        cartTotalCount,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
