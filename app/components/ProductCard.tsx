import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

// Product type matching database schema
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  colors: string[];
  badge: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/productDetails?id=${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${"bg-black"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-red-400 text-black rounded-full">
            -{discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            className="flex-1 bg-black text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Add to Cart</span>
          </button>
          <button
            className="p-2.5 bg-white rounded-xl shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/productDetails?id=${product._id}`}>
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>

        

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
