# WhatBytes Store - Frontend Assignment 🛍️⚡

A modern, high-performance E-Commerce platform built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Features a responsive product catalog, multi-criteria filtering with bidirectional URL sync, dynamic product detail routing, client-side state management with LocalStorage persistence, and a full checkout workflow.

---

## 🚀 Live Demo & Repository
- **Live Deployment:** [whatbyte-store.vercel.app](https://whatbyte-store.vercel.app) *(Deploy on Vercel with 1 click)*
- **GitHub Repository:** Public Git Repository

---

## ✨ Features

### 1. Home Page (`/`) – Product Listing
- **Header Navigation:**
  - Brand Logo & quick navigation.
  - **Live Search Bar** with instant keyword matching across title, category, brand, and tags.
  - **Cart Icon with dynamic badge count** indicating real-time items in cart.
  - User profile / VIP badge indicator.
  - Responsive mobile search bar.
- **Main Section & Filters:**
  - **Sidebar Filter (Left):**
    - **Category Filters:** Checkboxes/pills with instant multi-category selection.
    - **Interactive Price Range Slider:** Dual min/max price range inputs and visual range slider ($0 – $2500).
    - **Brand Filters:** Checkboxes for top brands (Apple, Sony, Samsung, Bose, Logitech, Anker, Keychron, etc.).
    - **Customer Rating Filter:** One-click filtering for 4.5+ ★, 4.0+ ★, and 3.5+ ★ products.
    - **In-Stock Toggle:** Filter for items ready to ship.
    - **Active Filter Chips:** Quick-remove chips for active filters with "Clear All" action.
    - **Mobile Filter Drawer:** Smooth sliding sheet for filters on smaller screen viewports.
- **Responsive Product Grid (Right):**
  - **3 Columns** on desktop (`lg:grid-cols-3`), **2 Columns** on tablet (`sm:grid-cols-2`), and **1 Column** on mobile.
  - **Sorting Selector:** Sort by Featured & Popular, Price: Low to High, Price: High to Low, Highest Customer Rating, and Newest Releases.
  - **Product Card Features:**
    - High-resolution product cover with smooth hover zoom.
    - Discount percentage & status badges (e.g., "Best Seller", "Pro Pick", "Sale").
    - Star ratings with customer review count.
    - Special pricing with original strikethrough price and savings calculation.
    - Quick **"Add to Cart"** button with micro-animation and immediate feedback.
    - **Quick View Modal** for rapid preview without navigating away.
- **Footer:**
  - Trust guarantee badges (Free Express Shipping, 2-Year Warranty, 30-Day Returns, 24/7 Support).
  - Navigation links, customer care, and newsletter signup.
  - Social media links (GitHub, Twitter / X, LinkedIn, Instagram).
  - Copyright and legal information.

---

### 2. Product Detail Page (`/product/[id]`)
- **Dynamic Routing:** Built with Next.js dynamic routes (`/product/[id]`).
- **Interactive Image Gallery (Left):**
  - Main high-resolution showcase image with hover zoom.
  - Interactive clickable thumbnail selector.
  - Wishlist toggle and Share link to clipboard.
- **Product Details & Actions (Right):**
  - Breadcrumb navigation (`Home > Category > Product Title`).
  - Title, brand, and verified seller badges.
  - Star ratings and total review count.
  - Pricing breakdown with instant savings indicator.
  - Stock availability status counter.
  - Color / Variant picker with visual swatches.
  - Interactive **Quantity Selector** (`-` `[qty]` `+`).
  - **"Add to Cart"** button + **"Buy Now"** 1-click checkout button.
  - Trust and warranty guarantee badges.
- **Specifications & Customer Reviews Section:**
  - Tabbed navigation: **Key Features**, **Technical Specifications**, and **Customer Reviews**.
  - Rating distribution breakdown bars.
  - Verified buyer review cards with timestamps.
  - **Interactive "Write a Review" form** to submit real-time verified customer reviews.
- **Related Products:** "You May Also Like" carousel/grid showcasing similar items from the same category.

---

### 3. Cart Page (`/cart`) & Slide-Over Drawer
- **Cart Slide-Over Drawer:** Accessible from the header on any page for quick bag review.
- **Dedicated Cart Page (`/cart`):**
  - Detailed list of added items with thumbnails, variant tags, and unit prices.
  - Quantity update controls (`-` `[qty]` `+`) with auto-removal on 0.
  - Individual item remove action & "Clear entire cart" action.
  - **Promo / Coupon Code System:**
    - Test codes: `WHATBYTES10` (10% off) or `SAVE20` (20% off).
    - Active promo badge with one-click remove.
  - **Order Summary:**
    - Subtotal
    - Promo discount savings
    - Estimated Shipping (Free shipping for orders over $150)
    - Estimated Sales Tax (7.5%)
    - Total in USD
  - **Simulated Checkout Flow:**
    - Interactive checkout button with loading state.
    - Order confirmation screen with tracking ID and delivery estimate.
  - Empty cart state with "Explore All Products" call-to-action.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern Utility-first CSS)
- **Icons:** Lucide React & Custom SVG Vector Icons
- **State Management:** React Context API (`CartContext`, `ToastContext`) with `localStorage` synchronization and hydration guards.
- **URL Synchronization:** Next.js `useSearchParams` & `useRouter` for filter persistence across page refreshes.

---

## 📦 Getting Started Locally

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd whatByte
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Testing Checklist
- [x] Responsive 3-column desktop / 2-column tablet / 1-column mobile product grid.
- [x] Search filtering with real-time string matching.
- [x] Category, price range, brand, and rating filters.
- [x] URL query params sync (e.g. `?category=Audio&minPrice=100&maxPrice=500&brand=Sony&sort=price-asc`).
- [x] Cart state management with `localStorage` persistence.
- [x] Dynamic product detail pages (`/product/[id]`).
- [x] Cart drawer & full `/cart` page with quantity update and promo code support.
- [x] Toast notification system on all cart actions.
- [x] Production build passes with 0 TypeScript/ESLint errors.

---

## 📄 License
This project is submitted as part of the WhatBytes Frontend Assignment.
