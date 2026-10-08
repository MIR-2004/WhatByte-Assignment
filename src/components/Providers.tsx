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
    <header className="h-18 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" />
      <div className="hidden md:block w-96 h-10 bg-slate-100 rounded-xl animate-pulse" />
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
        <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
      </div>
    </header>
  );
}

export function Providers({ children }: ProvidersProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
          <Suspense fallback={<NavbarFallback />}>
            <Navbar onOpenMobileFilters={() => setMobileFilterOpen(true)} />
          </Suspense>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
