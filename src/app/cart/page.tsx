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
        <div className="w-8 h-8 border-3 border-[#0b57a4] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading your cart...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-6 animate-fade-in bg-white p-8 sm:p-12 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Completed
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your order is being processed for express delivery. We've sent a confirmation receipt to your email.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
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
            className="flex-1 py-2.5 px-5 bg-[#0b57a4] hover:bg-[#094a8f] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6 bg-white p-8 sm:p-12 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0b57a4] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Looks like you haven't added any products to your shopping bag yet. Explore our product catalog.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b57a4] hover:bg-[#094a8f] text-white font-semibold text-xs rounded-lg shadow-sm transition-all hover:scale-102"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Actions matching homepage header typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You have <span className="font-bold text-slate-800">{items.length}</span> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear entire cart</span>
        </button>
      </div>

      {/* Cart Grid: Left Items + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || "default"}`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50"
              >
                {/* Image & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 overflow-hidden relative flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0b57a4]">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-[#0b57a4] transition-colors line-clamp-1 block"
                    >
                      {item.product.title}
                    </Link>
                    <span className="text-xs font-bold text-slate-900 block">
                      ${item.product.price}
                    </span>
                  </div>
                </div>

                {/* Price & Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0b57a4] font-bold transition-colors cursor-pointer"
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
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0b57a4] font-bold transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-bold text-slate-900 block">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedColor)
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0b57a4]" />
              <span>Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#0b57a4]" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Order Summary Card (4 cols) matching homepage card styling */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0b57a4]" />
                <span>Promo Code</span>
              </label>

              {discountCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{discountCode} (Active)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
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
                    className="flex-1 px-3.5 py-2 text-xs uppercase bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b57a4]/30 focus:border-[#0b57a4]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#06305a] hover:bg-[#042445] text-white font-semibold text-xs rounded-lg transition-colors shadow-xs cursor-pointer"
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
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#0b57a4] block">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button styled with homepage Royal Blue */}
            <button
              onClick={handleSimulateCheckout}
              disabled={isCheckingOut}
              className="w-full py-2.5 px-6 bg-[#0b57a4] hover:bg-[#094a8f] disabled:bg-blue-300 text-white font-semibold text-sm rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Accepts Visa, Mastercard, Apple Pay, PayPal</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
