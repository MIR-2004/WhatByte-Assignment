"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  Sparkles,
  Truck,
  RotateCcw,
  CreditCard,
  Lock,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
    tax,
    shipping,
    total,
    isHydrated,
  } = useCart();

  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyDiscountCode(promoInput);
    if (ok) {
      setPromoInput("");
    }
  };

  const handleSimulateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      clearCart();
      showToast("Order placed successfully! Order ID #WB-" + Math.floor(100000 + Math.random() * 900000), "success", 6000);
    }, 1500);
  };

  if (!isHydrated) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading your cart...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-6 animate-fade-in bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Your high-performance tech gear is being prepared for express delivery. We've sent a confirmation receipt to your email.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Tracking Number:</span>
            <span className="font-mono font-bold text-slate-900">WB-TRK-982145</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Delivery:</span>
            <span className="font-semibold text-slate-900">Within 2 Business Days</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            onClick={() => setOrderSuccess(false)}
            className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Looks like you haven't added any products to your shopping bag yet. Explore our featured tech products and exclusive discounts.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-102"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <span className="font-bold text-slate-800">{items.length}</span> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear entire cart</span>
        </button>
      </div>

      {/* Cart Grid: Left Items + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || "default"}`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50"
              >
                {/* Image & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden relative">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {item.product.brand} • {item.product.category}
                    </span>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    {item.selectedColor && (
                      <span className="text-xs text-slate-500 block">
                        Color: <span className="font-medium text-slate-700">{item.selectedColor}</span>
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-900 sm:hidden block pt-1">
                      ${item.product.price.toFixed(2)} each
                    </span>
                  </div>
                </div>

                {/* Price & Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedColor
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-black text-slate-900 block">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:block">
                      ${item.product.price.toFixed(2)} / ea
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedColor)
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Express Shipping over $150</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Promo Code</span>
              </label>

              {discountCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{discountCode} (Active)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-emerald-700 hover:text-emerald-900 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Try WHATBYTES10 or SAVE20"
                    className="flex-1 px-3.5 py-2 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Apply
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations Breakdown */}
            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (7.5%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 block">
                    ${total.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">USD Currency</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleSimulateCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-102 active:scale-98 cursor-pointer"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Accepts Visa, Mastercard, Apple Pay, PayPal</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
