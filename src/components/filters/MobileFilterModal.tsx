"use client";

import React, { useEffect } from "react";
import { FilterState } from "@/types/product";
import { FilterSidebar } from "./FilterSidebar";
import { X, SlidersHorizontal } from "lucide-react";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function MobileFilterModal({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: MobileFilterModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xs bg-[#f5f7fb] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#0b57a4] text-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <h3 className="text-sm font-bold text-white">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Body */}
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              totalResults={totalResults}
            />
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#0b57a4] hover:bg-[#094a8f] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Show {totalResults} {totalResults === 1 ? "Product" : "Products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
