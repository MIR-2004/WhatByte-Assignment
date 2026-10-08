"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  X, 
  User, 
  Menu, 
  SlidersHorizontal,
  Sparkles,
  Layers,
  Heart
} from "lucide-react";
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Handle scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 sm:gap-8">
          {/* Logo on the left */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                  What<span className="text-blue-600">Bytes</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
                  Store & Gadgets
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar in the center */}
          <div className="flex-1 max-w-2xl mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div
                className={`relative flex items-center w-full rounded-2xl border transition-all duration-200 bg-slate-50/80 ${
                  isSearchFocused
                    ? "border-blue-500 bg-white ring-4 ring-blue-500/10 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="pl-4.5 pr-2 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4.5 h-4.5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search products by title, category, brand (e.g. Sony, Headphones)..."
                  className="w-full py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Cart Icon & Avatar on the right */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Filter Toggle Button (if on listing page) */}
            {onOpenMobileFilters && pathname === "/" && (
              <button
                type="button"
                onClick={onOpenMobileFilters}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                aria-label="Open filter sidebar"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </button>
            )}

            {/* Cart Button / Icon */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-bold text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-fade-in">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <button
                type="button"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User profile account"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-100">
                  WB
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">Saif Ali</span>
                  <span className="text-[10px] text-slate-400 leading-tight">WhatBytes VIP</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (visible on small screens below header) */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10">
              <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2 pr-9 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600"
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
