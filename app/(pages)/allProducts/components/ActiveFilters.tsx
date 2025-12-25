"use client";

import { X } from "lucide-react";

interface ActiveFiltersProps {
  selectedCategories: string[];
  selectedColors: string[];
  selectedBadges: string[];
  stockFilter: "all" | "inStock";
  priceRange: [number, number];
  maxPrice: number;
  searchQuery: string;
  onRemoveCategory: (category: string) => void;
  onRemoveColor: (color: string) => void;
  onRemoveBadge: (badge: string) => void;
  onResetStock: () => void;
  onResetPrice: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedCategories,
  selectedColors,
  selectedBadges,
  stockFilter,
  priceRange,
  maxPrice,
  searchQuery,
  onRemoveCategory,
  onRemoveColor,
  onRemoveBadge,
  onResetStock,
  onResetPrice,
  onClearSearch,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0 || selectedBadges.length > 0 || stockFilter !== "all" || priceRange[0] > 0 || priceRange[1] < maxPrice || searchQuery;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm text-gray-500 mr-2">Filters:</span>

      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
        >
          &quot;{searchQuery}&quot; <X className="w-3.5 h-3.5" />
        </button>
      )}

      {selectedCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onRemoveCategory(cat)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
        >
          {cat} <X className="w-3.5 h-3.5" />
        </button>
      ))}

      {selectedColors.map((color) => (
        <button
          key={color}
          onClick={() => onRemoveColor(color)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200"
        >
          {color} <X className="w-3.5 h-3.5" />
        </button>
      ))}

      {selectedBadges.map((badge) => (
        <button
          key={badge}
          onClick={() => onRemoveBadge(badge)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200"
        >
          {badge} <X className="w-3.5 h-3.5" />
        </button>
      ))}

      {stockFilter !== "all" && (
        <button
          onClick={onResetStock}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200"
        >
          {stockFilter === "inStock" ? "In Stock" : "Out of Stock"} <X className="w-3.5 h-3.5" />
        </button>
      )}

      {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
        <button
          onClick={onResetPrice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
        >
          ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()} <X className="w-3.5 h-3.5" />
        </button>
      )}

      <button onClick={onClearAll} className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
        Clear all
      </button>
    </div>
  );
}
