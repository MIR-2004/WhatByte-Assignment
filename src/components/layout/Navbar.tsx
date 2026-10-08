"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShoppingCart, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onOpenMobileFilters?: () => void;
}

export function Navbar({ onOpenMobileFilters }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems, setIsCartOpen, isHydrated } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync search bar with URL query param if present
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchQuery(q);
    } else if (pathname === "/") {
      setSearchQuery("");
    }
  }, [searchParams, pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    if (pathname !== "/") {
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/?${params.toString()}`, { scroll: false });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    if (pathname === "/") {
      router.push(`/?${params.toString()}`, { scroll: false });
    }
    searchInputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b57a4] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Logo on the left */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white hover:opacity-95 transition-opacity"
            >
              Logo
            </Link>
          </div>

          {/* Search bar in the center */}
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center w-full rounded-lg border border-blue-400/40 bg-[#084988]/50 focus-within:bg-[#073d72] focus-within:border-blue-300 transition-all duration-200">
                <div className="pl-4 pr-2 flex items-center pointer-events-none text-blue-200">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full py-2.5 pr-10 text-sm text-white placeholder:text-blue-200/80 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 p-1 rounded-full text-blue-200 hover:text-white hover:bg-blue-800/40 transition-colors"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Cart Button on the right */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-[#06305a] hover:bg-[#042445] text-white font-medium text-sm rounded-lg transition-colors duration-150 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {mounted && totalItems > 0 && (
                <span className="ml-1 bg-white text-[#06305a] font-bold text-xs min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3.5 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center w-full rounded-lg border border-blue-400/40 bg-[#084988]/50 focus-within:bg-[#073d72] focus-within:border-blue-300">
              <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-blue-200">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full py-2 pr-9 text-xs text-white placeholder:text-blue-200/80 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 p-1 rounded-full text-blue-200 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
