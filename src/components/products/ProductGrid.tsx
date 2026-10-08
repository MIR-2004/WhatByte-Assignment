"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  totalProductsCount: number;
  onResetFilters: () => void;
}

export function ProductGrid({
  products,
  onResetFilters,
}: ProductGridProps) {
  return (
    <section className="w-full">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight mb-6">
        Product Listing
      </h1>

      {/* Empty State or Product Grid */}
      {products.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0b57a4] flex items-center justify-center mb-4">
            <PackageSearch className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            We couldn't find any products matching your selected category, price, or search criteria.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0b57a4] hover:bg-[#094a8f] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        /* 3-Column Grid on desktop, 2 on tablet, 1 on mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
