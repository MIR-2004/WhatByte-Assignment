"use client";

import React from "react";
import { FilterState } from "@/types/product";
import { CATEGORIES, BRANDS } from "@/data/products";
import { RotateCcw, Sliders, Star, Check } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2500 ||
    filters.minRating > 0 ||
    filters.inStockOnly;

  const handleCategoryToggle = (category: string) => {
    if (category === "All") {
      onFilterChange({ categories: [] });
      return;
    }

    const current = filters.categories;
    const exists = current.includes(category);
    if (exists) {
      onFilterChange({ categories: current.filter((c) => c !== category) });
    } else {
      onFilterChange({ categories: [...current, category] });
    }
  };

  const handleBrandToggle = (brand: string) => {
    const current = filters.brands;
    const exists = current.includes(brand);
    if (exists) {
      onFilterChange({ brands: current.filter((b) => b !== brand) });
    } else {
      onFilterChange({ brands: [...current, brand] });
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Categories
        </h4>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((category) => {
            const isSelected =
              category === "All"
                ? filters.categories.length === 0
                : filters.categories.includes(category);

            return (
              <label
                key={category}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/60"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span>{category}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Price Range
          </h4>
          <span className="text-xs font-bold text-slate-800">
            ${filters.minPrice} - ${filters.maxPrice}
          </span>
        </div>

        {/* Range slider input */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="2500"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">$</span>
              <input
                type="number"
                min="0"
                max={filters.maxPrice}
                value={filters.minPrice}
                onChange={(e) =>
                  onFilterChange({
                    minPrice: Math.max(0, Math.min(Number(e.target.value), filters.maxPrice)),
                  })
                }
                placeholder="Min"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-slate-400 text-xs">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">$</span>
              <input
                type="number"
                min={filters.minPrice}
                max="2500"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFilterChange({
                    maxPrice: Math.min(2500, Math.max(Number(e.target.value), filters.minPrice)),
                  })
                }
                placeholder="Max"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isSelected = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 px-2 py-1 rounded-lg text-xs text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className={isSelected ? "font-semibold text-blue-700" : ""}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((rating) => {
            const isSelected = filters.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  onFilterChange({ minRating: isSelected ? 0 : rating })
                }
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? "bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating}& up</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <span className="text-xs font-medium text-slate-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
        </label>
      </div>
    </aside>
  );
}
