"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Home,
  Package,
  Phone,
  Info,
  Shield,
} from "lucide-react";
import { useCategories } from "@/lib/redux/hooks";
import type { Category } from "@/lib/redux/slices/categoriesSlice";

// ============ NAVIGATION DATA ============
const navItems = [
  { label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  {
    label: "Shop",
    href: "/allProducts",
    icon: <Package className="w-4 h-4" />,
    hasDropdown: true,
  },
   { label: "All Products", href: "/allProducts", icon: <Package className="w-4 h-4" /> },
  { label: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
  { label: "Contact", href: "/contact", icon: <Phone className="w-4 h-4" /> },
   { label: "Admin", href: "/admin", icon: <Shield className="w-4 h-4" /> },
];

// Demo cart and wishlist counts
const demoCartCount = 10;
const demoWishlistCount = 5;

// ============ COMPONENT ============
export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get categories from Redux store
  const { categories } = useCategories();

  // Demo data states (replace with Redux selectors later)
  const cartTotalQuantity = demoCartCount;
  const wishlistTotalItems = demoWishlistCount;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate initial load complete
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Dropdown handlers with debounce for smooth UX
  const handleShopDropdownEnter = useCallback(() => {
    setIsShopDropdownOpen(true);
  }, []);

  const handleShopDropdownLeave = useCallback(() => {
    setIsShopDropdownOpen(false);
  }, []);

  const handleUserDropdownEnter = useCallback(() => {
    setIsUserDropdownOpen(true);
  }, []);

  const handleUserDropdownLeave = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xl"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="Digicam Market"
                width={75}
                height={75}
                className="rounded-lg"
                priority
                style={{ height: "auto" }}
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                E-Commerce
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Electronic Accessories</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <motion.button
                    onMouseEnter={handleShopDropdownEnter}
                    onMouseLeave={handleShopDropdownLeave}
                    className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 font-medium text-sm md:text-base transition-colors duration-300 ${
                      pathname.startsWith("/shop") || pathname.startsWith("/allProducts")
                        ? "text-black bg-gray-100 rounded-lg"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 font-medium text-sm md:text-base cursor-pointer transition-colors duration-300 ${
                        pathname === item.href
                          ? "bg-gray-200 rounded-xl font-semibold"
                          : "text-gray-700 hover:text-black"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                )}

                {/* Shop Dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isShopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        onMouseEnter={handleShopDropdownEnter}
                        onMouseLeave={handleShopDropdownLeave}
                        className="absolute top-full left-0 mt-2 w-[45vw] bg-white border rounded-2xl shadow-2xl z-50"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Shop Categories
                          </h3>

                          {/* Categories Grid */}
                          <div className="grid grid-cols-3 gap-3">
                              {categories?.map((category: Category) => (
                                <Link
                                  key={category._id}
                                  href={`/category/${encodeURIComponent(category.name)}`}
                                  className="group"
                                >
                                  <motion.div
                                    whileHover={{
                                      scale: 1.02,
                                      backgroundColor: "#f3f4f6",
                                    }}
                                    className="p-3 rounded-xl border border-gray-100 transition-all duration-300"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={40}
                                        height={40}
                                        className="rounded-lg object-cover"
                                      />
                                      <div>
                                        <h4 className="font-medium text-gray-800 group-hover:text-black transition-colors">
                                          {category.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                          {category.productCount} items
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Wishlist */}
            <Link href="/wilishlist">
              <motion.button
                whileHover={{ y: -2 }}
                className="relative p-2 md:p-3 hover:bg-gray-100 rounded-xl"
                aria-label={`Wishlist ${
                  wishlistTotalItems > 0
                    ? `(${wishlistTotalItems} items)`
                    : "(empty)"
                }`}
              >
                <Heart className="w-5 h-5" />
                {isInitialLoad ? (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                ) : (
                  wishlistTotalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistTotalItems}
                    </span>
                  )
                )}
              </motion.button>
            </Link>

            {/* Cart */}
            <Link href="/addToCart">
              <motion.button
                whileHover={{ y: -2 }}
                className="relative p-2 md:p-3 bg-black text-white rounded-xl"
                aria-label={`Shopping cart ${
                  cartTotalQuantity > 0
                    ? `(${cartTotalQuantity} items)`
                    : "(empty)"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInitialLoad ? (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full animate-pulse"></div>
                ) : (
                  cartTotalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {cartTotalQuantity}
                    </span>
                  )
                )}
              </motion.button>
            </Link>

            {/* User Section */}
            <div className="relative group">
              <motion.button
                whileHover={{ y: -2 }}
                className="p-2 md:p-3 hover:bg-gray-100 rounded-xl"
                onMouseEnter={handleUserDropdownEnter}
                onMouseLeave={handleUserDropdownLeave}
              >
                <User className="w-5 h-5" />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-lg z-50"
                    onMouseEnter={handleUserDropdownEnter}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    <div className="py-2">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 md:p-3 hover:bg-gray-100 rounded-xl"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden border-t bg-white"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation menu"
            >
              <nav className="py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className={`px-6 py-4 rounded-xl transition-colors duration-300 ${
                      pathname === item.href ||
                      (item.hasDropdown && pathname.startsWith("/shop"))
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <Link href={item.href}>
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span
                          className={`font-medium ${
                            pathname === item.href ? "text-black" : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Shop Categories */}
                <div className="px-6 py-2">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">
                    Shop Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories?.map((category: Category, index: number) => (
                      <motion.div
                        key={category._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={`/category/${encodeURIComponent(category.name)}`}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={24}
                            height={24}
                            className="rounded object-cover"
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Mobile User Menu */}
                <div className="border-t pt-4 mt-4">
                  <Link href="/login">
                    <motion.div
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className={`px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 ${
                        pathname === "/login"
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>🔑</span>
                        <span
                          className={`font-medium ${
                            pathname === "/login"
                              ? "text-black"
                              : "text-gray-700"
                          }`}
                        >
                          Sign In
                        </span>
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/signup">
                    <motion.div
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className={`px-6 py-4 rounded-xl cursor-pointer transition-colors duration-300 ${
                        pathname === "/signup"
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>📝</span>
                        <span
                          className={`font-medium ${
                            pathname === "/signup"
                              ? "text-black"
                              : "text-gray-700"
                          }`}
                        >
                          Sign Up
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
