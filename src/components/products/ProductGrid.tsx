"use client";

import React, { useState } from "react";
import { Product, FilterState } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { ArrowUpDown, PackageSearch, RotateCcw } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  totalProductsCount: number;
  sortBy: FilterState["sortBy"];
  onSortChange: (sort: FilterState["sortBy"]) => void;
  onResetFilters: () => void;
}

export function ProductGrid({
  products,
  totalProductsCount,
  sortBy,
  onSortChange,
  onResetFilters,
}: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6">
      {/* Grid Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            All Products
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <span className="font-semibold text-slate-800">{products.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalProductsCount}</span> products
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as FilterState["sortBy"])}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="featured">Featured & Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Customer Rating (Highest)</option>
            <option value="newest">Newest Releases</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering: Empty State or Grid */}
      {products.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <PackageSearch className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            We couldn't find any products matching your selected search keywords, categories, or price filters.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Responsive Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
