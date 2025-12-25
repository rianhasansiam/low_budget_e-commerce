"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, SlidersHorizontal, Loader2 } from "lucide-react";

import { useProducts, useCategories } from "@/lib/redux/hooks";
import ProductCard from "@/app/components/ProductCard";
import SortDropdown, { SortOption } from "@/app/(pages)/allProducts/components/SortDropdown";

interface CategoryPageClientProps {
  categoryName: string;
}

export default function CategoryPageClient({ categoryName }: CategoryPageClientProps) {
  // Get data from Redux
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // State
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Find current category
  const currentCategory = useMemo(() => {
    return categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categories, categoryName]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [allProducts, categoryName, sortBy]);

  // Loading state
  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/allProducts" className="hover:text-white transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Category Image */}
            {currentCategory?.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white/20"
              >
                <Image
                  src={currentCategory.image}
                  alt={categoryName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Category Info */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
              >
                {categoryName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg"
              >
                {filteredProducts.length} products available
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Back Link */}
          <Link
            href="/allProducts"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Products</span>
          </Link>

          {/* Sort */}
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-center mb-6">
              There are no products in this category yet.
            </p>
            <Link
              href="/allProducts"
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing all {filteredProducts.length} products in {categoryName}
            </p>
          </div>
        )}
      </div>

      {/* Other Categories */}
      {categories.length > 1 && (
        <section className="bg-white py-12 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Browse Other Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                .filter((cat) => cat.name.toLowerCase() !== categoryName.toLowerCase())
                .slice(0, 6)
                .map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${encodeURIComponent(cat.name)}`}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cat.productCount} items
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
