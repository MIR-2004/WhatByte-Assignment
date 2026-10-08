"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterState, Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { MobileFilterModal } from "@/components/filters/MobileFilterModal";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SlidersHorizontal, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category");
    const categories = categoryParam ? categoryParam.split(",").filter(Boolean) : [];
    const brandParam = searchParams.get("brand");
    const brands = brandParam ? brandParam.split(",").filter(Boolean) : [];
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 2500;
    const minRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : 0;
    const inStockOnly = searchParams.get("inStock") === "true";
    const sortBy = (searchParams.get("sort") as FilterState["sortBy"]) || "featured";

    return {
      search,
      categories,
      brands,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      sortBy,
    };
  });

  // Sync state when URL searchParams change
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category");
    const categories = categoryParam ? categoryParam.split(",").filter(Boolean) : [];
    const brandParam = searchParams.get("brand");
    const brands = brandParam ? brandParam.split(",").filter(Boolean) : [];
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 2500;
    const minRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : 0;
    const inStockOnly = searchParams.get("inStock") === "true";
    const sortBy = (searchParams.get("sort") as FilterState["sortBy"]) || "featured";

    setFilters((prev) => ({
      ...prev,
      search,
      categories,
      brands,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      sortBy,
    }));
  }, [searchParams]);

  // Update URL search parameters when filters change
  const updateUrlParams = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.categories.length > 0) params.set("category", newFilters.categories.join(","));
    if (newFilters.brands.length > 0) params.set("brand", newFilters.brands.join(","));
    if (newFilters.minPrice > 0) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice < 2500) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.minRating > 0) params.set("rating", newFilters.minRating.toString());
    if (newFilters.inStockOnly) params.set("inStock", "true");
    if (newFilters.sortBy !== "featured") params.set("sort", newFilters.sortBy);

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
  };

  const handleFilterChange = (partialFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...partialFilters };
    setFilters(updated);
    updateUrlParams(updated);
  };

  const handleResetFilters = () => {
    const reset: FilterState = {
      search: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 2500,
      minRating: 0,
      inStockOnly: false,
      sortBy: "featured",
    };
    setFilters(reset);
    router.replace("/", { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search matching (title, description, brand, category, tags)
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Category matching
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }

      // Brand matching
      if (filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand)) {
          return false;
        }
      }

      // Price matching
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Rating matching
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // In stock matching
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "newest":
          return (
            new Date(b.createdAt || "2024-01-01").getTime() -
            new Date(a.createdAt || "2024-01-01").getTime()
          );
        case "featured":
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
      }
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      {/* Hero Banner Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring Gadget Mega Sale • Up to 30% Off</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Tech, Engineered for Performance.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Discover industry-leading headphones, flagship smartphones, powerful laptops, and premium accessories tailored for your lifestyle.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleFilterChange({ categories: ["Audio"] })}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <span>Explore Audio</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={() => handleFilterChange({ sortBy: "rating-desc" })}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Rated Gear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Sidebar (left) + Product Grid (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar on Desktop (1 column) */}
        <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
          />
        </div>

        {/* Product Grid on Desktop (3 columns) / Tablet (2) / Mobile (1) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mobile Filter Trigger Button */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filter & Sort Products</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {filteredProducts.length} items
            </span>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onRemoveCategory={(cat) =>
              handleFilterChange({
                categories: filters.categories.filter((c) => c !== cat),
              })
            }
            onRemoveBrand={(brand) =>
              handleFilterChange({
                brands: filters.brands.filter((b) => b !== brand),
              })
            }
            onResetPrice={() =>
              handleFilterChange({ minPrice: 0, maxPrice: 2500 })
            }
            onResetRating={() => handleFilterChange({ minRating: 0 })}
            onResetStock={() => handleFilterChange({ inStockOnly: false })}
            onClearAll={handleResetFilters}
          />

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            totalProductsCount={PRODUCTS.length}
            sortBy={filters.sortBy}
            onSortChange={(sortBy) => handleFilterChange({ sortBy })}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading catalog...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
