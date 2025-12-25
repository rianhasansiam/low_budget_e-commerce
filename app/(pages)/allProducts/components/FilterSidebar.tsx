"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

interface Category {
  name: string;
  count: number;
  icon: string;
}

interface Color {
  name: string;
  count: number;
}

interface Badge {
  name: string;
  count: number;
}

interface FilterContentProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  colors: Color[];
  selectedColors: string[];
  onColorChange: (color: string) => void;
  badges: Badge[];
  selectedBadges: string[];
  onBadgeChange: (badge: string) => void;
  stockFilter: "all" | "inStock";
  onStockFilterChange: (filter: "all" | "inStock") => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onReset: () => void;
  categoryOpen: boolean;
  setCategoryOpen: (open: boolean) => void;
  colorOpen: boolean;
  setColorOpen: (open: boolean) => void;
  badgeOpen: boolean;
  setBadgeOpen: (open: boolean) => void;
  stockOpen: boolean;
  setStockOpen: (open: boolean) => void;
  priceOpen: boolean;
  setPriceOpen: (open: boolean) => void;
}

// Color hex mapping for display
const colorHex: Record<string, string> = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Silver": "#C0C0C0",
  "Gray": "#808080",
  "Red": "#EF4444",
  "Blue": "#3B82F6",
  "Green": "#22C55E",
  "Yellow": "#EAB308",
  "Orange": "#F97316",
  "Pink": "#EC4899",
  "Purple": "#A855F7",
  "Brown": "#92400E",
  "Gold": "#FFD700",
  "Navy": "#1E3A5F",
};

// Extracted FilterContent as a separate component to avoid "cannot create components during render" issue
function FilterContent({
  categories,
  selectedCategories,
  onCategoryChange,
  colors,
  selectedColors,
  onColorChange,
  badges,
  selectedBadges,
  onBadgeChange,
  stockFilter,
  onStockFilterChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onReset,
  categoryOpen,
  setCategoryOpen,
  colorOpen,
  setColorOpen,
  badgeOpen,
  setBadgeOpen,
  stockOpen,
  setStockOpen,
  priceOpen,
  setPriceOpen,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium"
      >
        <RotateCcw className="w-4 h-4" /> Reset Filters
      </button>

      {/* Categories */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold">Categories</h3>
          {categoryOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        <AnimatePresence>
          {categoryOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="px-4 pb-4 overflow-hidden"
            >
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <label
                    key={cat.name}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => onCategoryChange(cat.name)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-lg">{cat.icon}</span>
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <button
            onClick={() => setColorOpen(!colorOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">Colors</h3>
            {colorOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {colorOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => onColorChange(color.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                        selectedColors.includes(color.name)
                          ? "border-black bg-gray-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorHex[color.name] || "#808080" }}
                      />
                      <span className="text-sm">{color.name}</span>
                      <span className="text-xs text-gray-400">({color.count})</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Stock Availability */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <button
          onClick={() => setStockOpen(!stockOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold">Availability</h3>
          {stockOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        <AnimatePresence>
          {stockOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="px-4 pb-4 overflow-hidden"
            >
              <div className="space-y-2">
                {["all", "inStock"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === option}
                      onChange={() => onStockFilterChange(option as "all" | "inStock")}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm">
                      {option === "all" && "All Products"}
                      {option === "inStock" && "In Stock"}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <button
            onClick={() => setBadgeOpen(!badgeOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <h3 className="font-semibold">Labels</h3>
            {badgeOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {badgeOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                  {badges.map((badge) => (
                    <button
                      key={badge.name}
                      onClick={() => onBadgeChange(badge.name)}
                      className={`px-3 py-2 rounded-xl border-2 transition-all text-sm ${
                        selectedBadges.includes(badge.name)
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {badge.name} ({badge.count})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Price Range */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold">Price Range</h3>
          {priceOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        <AnimatePresence>
          {priceOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="px-4 pb-4 overflow-hidden"
            >
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">
                  ৳{priceRange[0].toLocaleString()}
                </span>
                <span className="text-gray-400">—</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">
                  ৳{priceRange[1].toLocaleString()}
                </span>
              </div>
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={priceRange[0]}
                  onChange={(e) =>
                    onPriceRangeChange([
                      Math.min(+e.target.value, priceRange[1] - 1000),
                      priceRange[1],
                    ])
                  }
                  className="w-full accent-black"
                />
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([
                      priceRange[0],
                      Math.max(+e.target.value, priceRange[0] + 1000),
                    ])
                  }
                  className="w-full accent-black"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  colors: Color[];
  selectedColors: string[];
  onColorChange: (color: string) => void;
  badges: Badge[];
  selectedBadges: string[];
  onBadgeChange: (badge: string) => void;
  stockFilter: "all" | "inStock";
  onStockFilterChange: (filter: "all" | "inStock") => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onReset: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  colors,
  selectedColors,
  onColorChange,
  badges,
  selectedBadges,
  onBadgeChange,
  stockFilter,
  onStockFilterChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onReset,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [badgeOpen, setBadgeOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const filterProps = {
    categories,
    selectedCategories,
    onCategoryChange,
    colors,
    selectedColors,
    onColorChange,
    badges,
    selectedBadges,
    onBadgeChange,
    stockFilter,
    onStockFilterChange,
    priceRange,
    onPriceRangeChange,
    maxPrice,
    onReset,
    categoryOpen,
    setCategoryOpen,
    colorOpen,
    setColorOpen,
    badgeOpen,
    setBadgeOpen,
    stockOpen,
    setStockOpen,
    priceOpen,
    setPriceOpen,
  };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <FilterContent {...filterProps} />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-80 bg-gray-50 z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h2 className="font-semibold text-lg">Filters</h2>
                <button
                  onClick={onMobileClose}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent {...filterProps} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
