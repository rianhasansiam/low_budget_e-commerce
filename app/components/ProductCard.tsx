'use client'

import { useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { toggleWishlist } from "@/lib/redux/slices/wishlistSlice";
import Swal from "sweetalert2";

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
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  
  // Use ref for mount tracking to avoid hydration issues without extra renders
  const hasMountedRef = useRef(false);
  
  useEffect(() => {
    hasMountedRef.current = true;
  }, []);
  
  // Check wishlist - will show correct state after first interaction
  const isInWishlist = useMemo(() => {
    return wishlistItems.some(item => item.id === product._id);
  }, [wishlistItems, product._id]);
  
  // Calculate discount with null safety
  const discount = (product.originalPrice && product.price && product.originalPrice > product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.stock || product.stock === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'This product is currently out of stock.',
        confirmButtonColor: '#111827',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
    
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
    
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      confirmButtonColor: '#111827',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.stock > 0
    }));
    
    Swal.fire({
      icon: isInWishlist ? 'info' : 'success',
      title: isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist!',
      text: isInWishlist 
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
      confirmButtonColor: '#111827',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/productDetails/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badge - Top Left */}
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white rounded-full bg-black">
            {product.badge}
          </span>
        )}

        {/* Discount Badge - Bottom Left */}
        {discount > 0 && (
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
            -{discount}%
          </span>
        )}

        {/* Wishlist Button - Top Right, Always visible */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md z-10 transition-all duration-200
            ${isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500'
            }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2.5">
        <Link href={`/productDetails/${product._id}`}>
          <p className="text-[10px] text-gray-500 mb-0.5 truncate">{product.category}</p>
          <h3 className="font-medium text-gray-900 mb-1.5 text-xs leading-tight line-clamp-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className="text-sm font-bold text-gray-900">
            ৳{(product.price ?? 0).toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Always visible */}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className={`w-full py-2 rounded-lg font-medium text-xs transition-colors ${
            !product.stock || product.stock === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-black text-white hover:bg-sky-400 active:bg-sky-500'
          }`}
          aria-label="Add to cart"
        >
          <span className="flex items-center justify-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            {!product.stock || product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
