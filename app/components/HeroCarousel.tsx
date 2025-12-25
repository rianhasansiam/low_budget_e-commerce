"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Demo slider data with Unsplash images
const sliderData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop",
    link: "/allProducts?sale=winter",
    alt: "Winter Sale Banner - Electronics Deals",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop",
    link: "/allProducts?filter=new",
    alt: "New Arrivals - Latest Gadgets",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
    link: "/allProducts?category=smart-home",
    alt: "Smart Home Devices",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
    link: "/allProducts?category=audio",
    alt: "Audio Festival - Headphones & Speakers",
  },
];

// Side banners data with Unsplash images
const sideBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=500&fit=crop",
    link: "/productDetails?id=airpods-pro",
    alt: "AirPods Pro - Wireless Earbuds",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=500&fit=crop",
    link: "/productDetails?id=watch-series",
    alt: "Smart Watch Collection",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Carousel */}
        <div
          className="relative w-full lg:w-2/3 h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Slides */}
          {sliderData.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.link}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
              }`}
            >
              {/* Banner Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </Link>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {sliderData.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  goToSlide(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-3 bg-orange-500"
                    : "w-3 h-3 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Banners */}
        <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4">
          {sideBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="relative flex-1 h-[150px] sm:h-[200px] lg:h-[242px] rounded-2xl overflow-hidden group"
            >
              {/* Side Banner Image */}
              <Image
                src={banner.image}
                alt={banner.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Hover effect */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
