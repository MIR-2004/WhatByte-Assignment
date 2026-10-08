"use client";

import React, { useState } from "react";
import { FilterState } from "@/types/product";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CATEGORY_OPTIONS = ["All", "Electronics", "Clothing", "Home"];

export function FilterSidebar({
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const [customPriceInput, setCustomPriceInput] = useState<number>(5000);

  const selectedCategory = filters.categories.length === 0 ? "All" : filters.categories[0];

  const handleSelectCategory = (cat: string) => {
    if (cat === "All") {
      onFilterChange({ categories: [] });
    } else {
      onFilterChange({ categories: [cat] });
    }
  };

  const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onFilterChange({ minPrice: 0, maxPrice: val });
  };

  const handleCustomPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCustomPriceInput(val);
    if (!isNaN(val) && val > 0) {
      onFilterChange({ maxPrice: val });
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* 1. Top Card: Solid Blue Filter Box */}
      <div className="bg-[#0b57a4] text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold tracking-tight mb-5">Filters</h2>

        {/* Category Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-white/95">Category</h3>
          <div className="space-y-2.5">
            {CATEGORY_OPTIONS.map((cat) => {
              const isChecked = selectedCategory === cat;
              return (
                <label
                  key={`blue-${cat}`}
                  onClick={() => handleSelectCategory(cat)}
                  className="flex items-center gap-3 text-sm cursor-pointer group select-none"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="blue-category"
                      checked={isChecked}
                      onChange={() => handleSelectCategory(cat)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? "border-white bg-transparent"
                          : "border-white/70 group-hover:border-white"
                      }`}
                    >
                      {isChecked && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <span className={`${isChecked ? "font-semibold" : "text-white/90"}`}>
                    {cat}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Slider Section */}
        <div className="mt-7 space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-white/95">Price</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={filters.maxPrice > 1000 ? 1000 : filters.maxPrice}
              onChange={handlePriceSliderChange}
              className="w-full h-1.5 bg-blue-300/40 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-xs text-white/90 font-medium pt-1">
              <span>0</span>
              <span>1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Card: White Category / Price Box */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        {/* Category Section */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Category</h3>
          <div className="space-y-2.5">
            {CATEGORY_OPTIONS.map((cat) => {
              const isChecked = selectedCategory === cat;
              return (
                <label
                  key={`white-${cat}`}
                  onClick={() => handleSelectCategory(cat)}
                  className="flex items-center gap-3 text-sm cursor-pointer group select-none text-slate-800"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="white-category"
                      checked={isChecked}
                      onChange={() => handleSelectCategory(cat)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? "border-[#0b57a4]"
                          : "border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {isChecked && (
                        <div className="w-2 h-2 rounded-full bg-[#0b57a4]" />
                      )}
                    </div>
                  </div>
                  <span className={`${isChecked ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                    {cat}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Input Section */}
        <div className="mt-6 space-y-2.5">
          <h3 className="text-base font-bold text-slate-900">Price</h3>
          <div className="relative">
            <input
              type="number"
              value={customPriceInput}
              onChange={handleCustomPriceChange}
              min="0"
              step="50"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b57a4]/30 focus:border-[#0b57a4]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
