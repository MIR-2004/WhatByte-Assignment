"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PRODUCTS, MOCK_REVIEWS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Star,
  ShoppingBag,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MessageSquare,
  ThumbsUp,
  Award,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, getItemQuantity } = useCart();
  const { showToast } = useToast();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === resolvedParams.id);
  }, [resolvedParams.id]);

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">
          The gadget or product you are looking for might have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700 transition-colors"
        >
          Back to Store Catalog
        </Link>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "reviews">("features");

  // Review submission state
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const currentCartQty = getItemQuantity(product.id, selectedColor);

  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 3);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    router.push("/cart");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "info");
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showToast(
      isWishlisted ? "Removed from wishlist" : "Added to your wishlist!",
      "success"
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast("Please fill in your name and comment", "error");
      return;
    }

    const newRev = {
      id: `r-${Date.now()}`,
      author: newReviewAuthor.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      rating: newReviewRating,
      date: "Just now",
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setShowReviewForm(false);
    showToast("Review submitted successfully! Thank you.", "success");
  };

  const allImages = product.images?.length ? product.images : [product.image];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link
          href={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-blue-600 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Image Carousel / Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-square rounded-3xl bg-white border border-slate-200/80 shadow-md overflow-hidden flex items-center justify-center p-4 sm:p-8 group">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 text-white shadow-sm">
                  {product.badge}
                </span>
              )}
              {product.originalPrice && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white shadow-xs">
                  Save ${(product.originalPrice - product.price).toFixed(0)}
                </span>
              )}
            </div>

            {/* Quick Action Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 shadow-md backdrop-blur-xs transition-colors"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-xs transition-colors ${
                  isWishlisted ? "text-rose-500" : "text-slate-600 hover:text-rose-500"
                }`}
                title="Save to Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 p-1 shrink-0 transition-all ${
                    activeImage === img
                      ? "border-blue-600 ring-4 ring-blue-500/15 scale-102"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details Section (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • Category: {product.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">
                {product.rating}
              </span>
              <span className="text-xs text-slate-400">
                ({product.reviewCount} customer ratings)
              </span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Seller
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Special Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.stockCount} available)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Color: <span className="text-slate-900 font-semibold">{selectedColor}</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      selectedColor === c.name
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:text-blue-600 font-bold transition-colors text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-slate-600 hover:text-blue-600 font-bold transition-colors text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {currentCartQty > 0 && (
                <span className="text-xs font-semibold text-blue-600">
                  ({currentCartQty} already in your cart)
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-102 active:scale-98"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart ({quantity})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-900/10 hover:scale-102 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Buy Now with 1-Click</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold text-slate-800">Free Express</span>
              <span className="text-[10px] text-slate-400">2-3 Business Days</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-x border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-800">2-Year Warranty</span>
              <span className="text-[10px] text-slate-400">Official Coverage</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <span className="text-[11px] font-bold text-slate-800">30-Day Return</span>
              <span className="text-[10px] text-slate-400">Hassle Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Features, Specs, Customer Reviews */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "features"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Key Features
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "specs"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "reviews"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>Customer Reviews</span>
            <span className="bg-slate-200/60 text-slate-800 px-1.5 py-0.5 rounded-md text-[10px]">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "features" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
              <h3 className="text-base font-bold text-slate-900">What makes this special:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </li>
                )) || <p className="text-xs text-slate-400">Standard manufacturer features included.</p>}
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">Hardware & Specs:</h3>
              <dl className="divide-y divide-slate-100">
                {product.specs ? (
                  Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="py-3 grid grid-cols-3 gap-4 text-xs">
                      <dt className="font-bold text-slate-500">{k}</dt>
                      <dd className="col-span-2 font-medium text-slate-800">{v}</dd>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Detailed specifications available upon request.</p>
                )}
              </dl>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review summary header */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-4xl font-black text-slate-900">{product.rating}</span>
                    <div className="flex text-amber-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Based on {product.reviewCount} ratings
                    </span>
                  </div>

                  <div className="hidden sm:block h-16 w-px bg-slate-200" />

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>5 Star</span>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-amber-400 rounded-full" />
                      </div>
                      <span>85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>4 Star</span>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[12%] h-full bg-amber-400 rounded-full" />
                      </div>
                      <span>12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>3 Star</span>
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[3%] h-full bg-amber-400 rounded-full" />
                      </div>
                      <span>3%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{showReviewForm ? "Cancel Review" : "Write a Review"}</span>
                </button>
              </div>

              {/* Review Input Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-200 space-y-4 animate-fade-in"
                >
                  <h4 className="text-sm font-bold text-slate-900">Share your experience with this product</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Rating (1 to 5 Stars)
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReviewRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Review Comment
                    </label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="What did you like or dislike? How does it perform?"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}

              {/* Review Cards */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {rev.author[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                            {rev.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                                <Award className="w-3 h-3" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Similar Products You Might Like</h2>
              <p className="text-xs text-slate-500">More high-performance gear in {product.category}</p>
            </div>
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all in {product.category}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
