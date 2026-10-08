"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { X, Star, ShoppingBag, Check, ShieldCheck, ArrowRight, Eye } from "lucide-react";

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart, getItemQuantity } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedRecently, setAddedRecently] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors?.[0]?.name || "");
      setQuantity(1);
      setAddedRecently(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id, selectedColor);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-slate-100">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Image Section */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-sm relative group">
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-600 text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? "border-blue-600 ring-2 ring-blue-500/20"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Details Section */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {product.brand} • {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                  {product.title}
                </h2>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-black text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Save ${(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.name
                              ? "border-blue-600 ring-2 ring-blue-500/20 scale-110"
                              : "border-slate-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {selectedColor === c.name && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                c.hex === "#ffffff" || c.hex === "#f8fafc" || c.hex === "#fafafa"
                                  ? "text-slate-900"
                                  : "text-white"
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 font-bold transition-colors flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 font-bold transition-colors flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      addedRecently
                        ? "bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                    }`}
                  >
                    {addedRecently ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart ({quantity})</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>View full product specifications & reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
