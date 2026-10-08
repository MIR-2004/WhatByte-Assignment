export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
  image: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  badge?: string;
  colors?: { name: string; hex: string }[];
  tags?: string[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}
