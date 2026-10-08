"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterState } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const search = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category");
    const categories = categoryParam ? categoryParam.split(",").filter(Boolean) : [];
    const brandParam = searchParams.get("brand");
    const brands = brandParam ? brandParam.split(",").filter(Boolean) : [];
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 5000;
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
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 5000;
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
    if (newFilters.maxPrice < 5000) params.set("maxPrice", newFilters.maxPrice.toString());

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
      maxPrice: 5000,
      minRating: 0,
      inStockOnly: false,
      sortBy: "featured",
    };
    setFilters(reset);
    router.replace("/", { scroll: false });
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search matching
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);

        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Category matching
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }

      // Price matching
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10 items-start">
      {/* Sidebar on the left (1 column) */}
      <div className="lg:col-span-1">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredProducts.length}
        />
      </div>

      {/* Main Product Listing on the right (3 columns) */}
      <div className="lg:col-span-3">
        <ProductGrid
          products={filteredProducts}
          totalProductsCount={PRODUCTS.length}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-3 border-[#0b57a4] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
