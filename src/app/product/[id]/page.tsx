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
  MessageSquare,
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
          The product you are looking for might have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-[#0b57a4] hover:bg-[#094a8f] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
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

  // Reviews state
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
    <div className="space-y-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#0b57a4] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link
          href={`/?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#0b57a4] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Main Product Presentation Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md aspect-square flex items-center justify-center relative group">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-72 sm:max-h-80 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Top right quick actions */}
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#0b57a4] border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors cursor-pointer ${
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

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border p-1 shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                    activeImage === img
                      ? "border-[#0b57a4] ring-2 ring-blue-500/20"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-6 space-y-5 text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0b57a4] block">
              Category: {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="text-2xl font-bold text-slate-900 pt-1">
              ${product.price}
            </div>

            {/* Star ratings */}
            <div className="flex items-center gap-1.5 text-[#0b57a4] pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-[#0b57a4] text-[#0b57a4]"
                      : "text-[#0b57a4]/30"
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-slate-700 ml-1">
                {product.rating}
              </span>
              <span className="text-xs text-slate-400">
                ({product.reviewCount} ratings)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector & Actions */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-[#0b57a4] font-bold transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-[#0b57a4] font-bold transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {currentCartQty > 0 && (
                <span className="text-xs font-semibold text-[#0b57a4]">
                  ({currentCartQty} in cart)
                </span>
              )}
            </div>

            {/* Action Buttons styled like homepage Add to Cart */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[#0b57a4] hover:bg-[#094a8f] text-white active:scale-98"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart ({quantity})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm bg-[#06305a] hover:bg-[#042445] text-white flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-center pt-3">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#0b57a4]" />
              <span className="text-[11px] font-bold text-slate-800">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-800">2-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#0b57a4]" />
              <span className="text-[11px] font-bold text-slate-800">30-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Features, Specs, Customer Reviews */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("features")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "features"
                ? "bg-[#0b57a4] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "specs"
                ? "bg-[#0b57a4] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "reviews"
                ? "bg-[#0b57a4] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>Reviews</span>
            <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Content Cards */}
        <div>
          {activeTab === "features" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {product.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <div className="w-4.5 h-4.5 rounded-full bg-blue-50 text-[#0b57a4] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </li>
                )) || <p className="text-xs text-slate-400">Standard features included.</p>}
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Product Specifications</h3>
              <dl className="divide-y divide-slate-100">
                {product.specs ? (
                  Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="py-2.5 grid grid-cols-3 gap-4 text-xs">
                      <dt className="font-semibold text-slate-500">{k}</dt>
                      <dd className="col-span-2 font-medium text-slate-800">{v}</dd>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Specifications available upon request.</p>
                )}
              </dl>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-3xl font-bold text-slate-900">{product.rating}</span>
                  <div className="flex text-[#0b57a4] mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#0b57a4] text-[#0b57a4]"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Based on {product.reviewCount} reviews
                  </span>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-5 py-2 bg-[#0b57a4] hover:bg-[#094a8f] text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{showReviewForm ? "Cancel" : "Write a Review"}</span>
                </button>
              </div>

              {/* Review Input Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 animate-fade-in"
                >
                  <h4 className="text-sm font-bold text-slate-900">Write your review</h4>
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
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0b57a4]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Rating
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= newReviewRating
                                  ? "fill-[#0b57a4] text-[#0b57a4]"
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
                      Comment
                    </label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0b57a4]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0b57a4] hover:bg-[#094a8f] text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Review List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0b57a4] flex items-center justify-center font-bold text-xs">
                          {rev.author[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
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

                      <div className="flex text-[#0b57a4]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-[#0b57a4] text-[#0b57a4]"
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

      {/* Similar Products Section using the standard homepage ProductCard */}
      {relatedProducts.length > 0 && (
        <div className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0f2942] tracking-tight">
                Similar Products
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">More products in {product.category}</p>
            </div>
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-[#0b57a4] hover:text-[#094a8f] flex items-center gap-1"
            >
              <span>View all</span>
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
