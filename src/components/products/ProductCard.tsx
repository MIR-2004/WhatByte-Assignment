"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Check, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const cartQty = getItemQuantity(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/60 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-blue-600 text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600 text-white shadow-xs">
              -
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) *
                  100
              )}
              %
            </span>
          )}
        </div>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={handleOpenQuickView}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4 text-slate-800" />
          </button>
        )}

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-blue-600">
              {product.brand}
            </span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating stars */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price & Quick Add Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {cartQty > 0 && (
              <span className="text-[10px] font-semibold text-blue-600">
                {cartQty} in cart
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : !product.inStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:scale-102 active:scale-98"
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
