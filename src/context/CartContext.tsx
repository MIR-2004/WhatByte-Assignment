"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { CartItem, Product } from "@/types/product";
import { useToast } from "./ToastContext";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, selectedColor?: string) => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  discountCode: string;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  tax: number;
  shipping: number;
  total: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "whatbytes_cart_v1";
const DISCOUNT_STORAGE_KEY = "whatbytes_discount_v1";

const VALID_PROMO_CODES: Record<string, number> = {
  WHATBYTES10: 0.1, // 10% off
  SAVE20: 0.2,      // 20% off
  SPECIAL50: 0.5,   // 50% off
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const { showToast } = useToast();

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      const storedDiscount = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      if (storedDiscount) {
        setDiscountCode(storedDiscount);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isHydrated]);

  // Save discount code to LocalStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        if (discountCode) {
          localStorage.setItem(DISCOUNT_STORAGE_KEY, discountCode);
        } else {
          localStorage.removeItem(DISCOUNT_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to save discount code to localStorage", e);
      }
    }
  }, [discountCode, isHydrated]);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1, selectedColor?: string) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            (selectedColor ? item.selectedColor === selectedColor : true)
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              product,
              quantity,
              selectedColor: selectedColor || product.colors?.[0]?.name,
            },
          ];
        }
      });

      showToast(`Added "${product.title.slice(0, 30)}..." to your cart!`, "success");
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string, selectedColor?: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find(
          (item) =>
            item.product.id === productId &&
            (selectedColor ? item.selectedColor === selectedColor : true)
        );
        if (itemToRemove) {
          showToast(`Removed "${itemToRemove.product.title.slice(0, 25)}..." from cart`, "info");
        }
        return prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              (selectedColor ? item.selectedColor === selectedColor : true)
            )
        );
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedColor?: string) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedColor);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (
            item.product.id === productId &&
            (selectedColor ? item.selectedColor === selectedColor : true)
          ) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode("");
    showToast("Cart has been cleared", "info");
  }, [showToast]);

  const getItemQuantity = useCallback(
    (productId: string, selectedColor?: string) => {
      const item = items.find(
        (i) =>
          i.product.id === productId &&
          (selectedColor ? i.selectedColor === selectedColor : true)
      );
      return item ? item.quantity : 0;
    },
    [items]
  );

  const applyDiscountCode = useCallback(
    (code: string) => {
      const upper = code.trim().toUpperCase();
      if (VALID_PROMO_CODES[upper]) {
        setDiscountCode(upper);
        showToast(`Promo code "${upper}" applied (${VALID_PROMO_CODES[upper] * 100}% off)!`, "success");
        return true;
      } else {
        showToast(`Invalid promo code "${code}". Try WHATBYTES10`, "error");
        return false;
      }
    },
    [showToast]
  );

  const removeDiscountCode = useCallback(() => {
    setDiscountCode("");
    showToast("Promo code removed", "info");
  }, [showToast]);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  const discountRate = useMemo(
    () => (discountCode ? VALID_PROMO_CODES[discountCode] || 0 : 0),
    [discountCode]
  );

  const discount = useMemo(() => subtotal * discountRate, [subtotal, discountRate]);

  // Shipping is free if subtotal > $150 or empty, else $15
  const shipping = useMemo(() => {
    if (items.length === 0 || subtotal >= 150) return 0;
    return 15;
  }, [items.length, subtotal]);

  // Estimated tax (7.5%)
  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return taxableAmount * 0.075;
  }, [subtotal, discount]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - discount) + tax + shipping;
  }, [items.length, subtotal, discount, tax, shipping]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        discount,
        discountCode,
        applyDiscountCode,
        removeDiscountCode,
        tax,
        shipping,
        total,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
