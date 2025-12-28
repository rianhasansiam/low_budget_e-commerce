"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/lib/redux/hooks";

export default function AllProductsSection() {
  const { products, loading } = useProducts();

  // Get products that are not featured (or just get all and slice)
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
           
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Our Products
              </h2>
              <p className="text-gray-600 mt-1">
                Explore our complete collection
              </p>
            </div>
          </div>
        



            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link
              href="/allProducts"
              className="text-black font-semibold hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </motion.div>
         

        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">No products available</p>
          </motion.div>
        )}

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center sm:hidden"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/allProducts"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
