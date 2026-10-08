"use client";

import React from "react";
import { FilterState } from "@/types/product";
import { X } from "lucide-react";

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveCategory: (cat: string) => void;
  onRemoveBrand: (brand: string) => void;
  onResetPrice: () => void;
  onResetRating: () => void;
  onResetStock: () => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  filters,
  onRemoveCategory,
  onRemoveBrand,
  onResetPrice,
  onResetRating,
  onResetStock,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasPrice = filters.minPrice > 0 || filters.maxPrice < 2500;
  const hasRating = filters.minRating > 0;
  const hasStock = filters.inStockOnly;
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    hasPrice ||
    hasRating ||
    hasStock;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs font-semibold text-slate-400 mr-1">Active:</span>

      {/* Category Chips */}
      {filters.categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onRemoveCategory(cat)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <span>{cat}</span>
          <X className="w-3 h-3" />
        </button>
      ))}

      {/* Brand Chips */}
      {filters.brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onRemoveBrand(brand)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
        >
          <span>{brand}</span>
          <X className="w-3 h-3" />
        </button>
      ))}

      {/* Price Chip */}
      {hasPrice && (
        <button
          onClick={onResetPrice}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
        >
          <span>${filters.minPrice} - ${filters.maxPrice}</span>
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Rating Chip */}
      {hasRating && (
        <button
          onClick={onResetRating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          <span>★ {filters.minRating}+</span>
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Stock Chip */}
      {hasStock && (
        <button
          onClick={onResetStock}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <span>In Stock Only</span>
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Clear All */}
      <button
        onClick={onClearAll}
        className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
