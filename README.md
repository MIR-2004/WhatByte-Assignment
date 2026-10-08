# WhatBytes E-Commerce Store

Frontend assignment submission for WhatBytes built using Next.js App Router, TypeScript, and Tailwind CSS.

## Overview
A responsive e-commerce web application featuring real-time product catalog filtering, dynamic URL parameter synchronization, dynamic routing for product details, and persistent client-side cart management with localStorage.

## Features

### 1. Home Page (`/`)
- Header with branding, centered search bar, and cart item counter badge.
- Sidebar with category filters (All, Electronics, Clothing, Home) and price range slider ($0 - $1000).
- Responsive product grid (3-column desktop, 2-column tablet, 1-column mobile).
- Featured 2-column product card layout for highlighted products.
- Real-time search by product title, category, and description.
- Synchronized URL search parameters for sharing and bookmarking filter states.
- Clean footer with category links, about/contact links, and social media links.

### 2. Product Detail Page (`/product/[id]`)
- Dynamic routing with `params` unwrapping.
- Product showcase image with thumbnail switcher.
- Breadcrumb navigation for quick traversal.
- Product specifications, pricing, ratings, and stock status.
- Interactive quantity increment/decrement controls.
- Add to Cart and Buy Now checkout actions.
- Tabbed interface for Key Features, Specifications, and Customer Reviews with review submission form.
- Similar products recommendations.

### 3. Cart Page (`/cart`)
- Itemized list of added products with quantity adjustments and removal.
- Real-time subtotal, discount, tax, and total price calculation.
- Coupon code support (e.g. `WHATBYTES10`, `SAVE20`).
- Checkout flow with order confirmation state.
- Cart state persisted in `localStorage`.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & inline SVGs
- **State Management:** React Context API (`CartContext`, `ToastContext`)

## Getting Started

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
