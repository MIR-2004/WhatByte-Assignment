"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Star, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // If this is the featured smartphone spanning 2 columns
  if (product.id === "smartphone") {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 transition-all hover:shadow-md">
        {/* Left: Smartphone Image */}
        <div className="w-full sm:w-1/2 flex items-center justify-center p-2">
          <Link href={`/product/${product.id}`} className="block h-full max-h-80 w-auto">
            <img
              src={product.image}
              alt={product.title}
              className="h-72 w-auto max-w-full object-contain mx-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Right: Content details */}
        <div className="w-full sm:w-1/2 flex flex-col justify-between py-2 text-left">
          <div className="space-y-2">
            <Link href={`/product/${product.id}`}>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-[#0b57a4] transition-colors">
                {product.title}
              </h3>
            </Link>

            <div className="text-xl font-bold text-slate-900">
              ${product.price}
            </div>

            {/* Star ratings */}
            <div className="flex items-center gap-1 text-[#0b57a4] pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4 ? "fill-[#0b57a4] text-[#0b57a4]" : "text-[#0b57a4] fill-[#0b57a4]/30"
                  }`}
                />
              ))}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {product.description}
            </p>

            {/* Category label & value */}
            <div className="pt-2">
              <span className="block text-sm font-semibold text-slate-700">Category</span>
              <span className="block text-sm text-slate-900 font-medium">
                {product.category}
              </span>
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="pt-5">
            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-auto px-7 py-2.5 text-sm font-semibold rounded-lg text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-emerald-600"
                  : "bg-[#0b57a4] hover:bg-[#094a8f] active:scale-98"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard 1-column product card
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between transition-all hover:shadow-md group">
      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center mb-4 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-44 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Product Title, Price, and Action */}
      <div className="space-y-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-bold text-slate-900 hover:text-[#0b57a4] transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        <div className="text-base font-bold text-slate-900">
          ${product.price}
        </div>

        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            className={`w-fit px-5 py-2 text-sm font-semibold rounded-lg text-white transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              isAdded
                ? "bg-emerald-600"
                : "bg-[#0b57a4] hover:bg-[#094a8f] active:scale-98"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <span>Add to Cart</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
