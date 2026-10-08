"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { X, Star, ShoppingBag, Check, ArrowRight } from "lucide-react";

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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-slate-100">
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
            <div className="p-6 bg-slate-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-100 p-4 flex items-center justify-center">
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  className="max-h-56 w-auto object-contain"
                />
              </div>
            </div>

            {/* Right Details Section */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#0b57a4] uppercase tracking-wider">
                  {product.category}
                </span>

                <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-[#0b57a4]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? "fill-[#0b57a4] text-[#0b57a4]"
                            : "text-[#0b57a4]/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {product.rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Pricing */}
                <div className="mt-3">
                  <span className="text-2xl font-bold text-slate-900">
                    ${product.price}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded hover:bg-white text-slate-600 font-bold transition-colors flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded hover:bg-white text-slate-600 font-bold transition-colors flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                      addedRecently
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0b57a4] hover:bg-[#094a8f] text-white"
                    }`}
                  >
                    {addedRecently ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="text-xs font-semibold text-[#0b57a4] hover:text-[#094a8f] inline-flex items-center gap-1"
                  >
                    <span>View full product details</span>
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
