import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "WhatBytes Store | Premium Gadgets & Electronics",
  description:
    "Explore our curated selection of high-end headphones, smartphones, laptops, smartwatches, and tech accessories with fast shipping and 2-year warranty.",
  keywords: [
    "Electronics",
    "WhatBytes Store",
    "Headphones",
    "Laptops",
    "Smartwatches",
    "Audio Gear",
  ],
  authors: [{ name: "WhatBytes Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
