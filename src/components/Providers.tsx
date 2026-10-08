"use client";

import React, { ReactNode, useState, Suspense } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface ProvidersProps {
  children: ReactNode;
}

function NavbarFallback() {
  return (
    <header className="h-20 bg-[#0b57a4] flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="w-24 h-7 bg-white/20 rounded-md animate-pulse" />
      <div className="hidden md:block w-96 h-10 bg-white/20 rounded-lg animate-pulse" />
      <div className="w-20 h-10 bg-white/20 rounded-lg animate-pulse" />
    </header>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#f5f7fb] text-slate-900 selection:bg-[#0b57a4] selection:text-white">
          <Suspense fallback={<NavbarFallback />}>
            <Navbar onOpenMobileFilters={() => setMobileFilterOpen(true)} />
          </Suspense>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
