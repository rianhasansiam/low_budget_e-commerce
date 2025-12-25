"use client";

import React, { memo } from "react";

import { useCategories } from "@/lib/redux/hooks";
import { Loader2 } from "lucide-react";
import CategoriesSectionClient from "./CategoriesSectionClient";

const CategoriesSection = memo(() => {
  const { categories: categoriesData, loading } = useCategories();

  // Memoized categories processing
  const categories = React.useMemo(() => {
    if (!Array.isArray(categoriesData)) return [];

    return categoriesData.map((category) => ({
      _id: category._id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      image: category.image || "/placeholder.png",
      productCount: category.productCount || 0,
    }));
  }, [categoriesData]);

  // Loading state
  if (loading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              SHOP BY CATEGORY
            </h2>
            <p className="text-gray-600">Explore our wide collection</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!categories.length) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-gray-600">No categories available.</p>
          </div>
        </div>
      </section>
    );
  }

  return <CategoriesSectionClient categories={categories} />;
});

CategoriesSection.displayName = "CategoriesSection";

export default CategoriesSection;
