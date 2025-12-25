"use client";

import { useRef, useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

interface CategoriesSectionClientProps {
  categories: Category[];
}

const CategoriesSectionClient = memo(({ categories }: CategoriesSectionClientProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }, []);

  // Mouse drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 2; // Scroll speed multiplier
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, startX, scrollLeft]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            SHOP BY CATEGORY
          </h2>
          <p className="text-gray-600">Explore our wide collection</p>
        </div>

        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            className={`flex gap-6 overflow-x-auto py-4 scrollbar-hide select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${encodeURIComponent(cat.name)}`}
                className="flex-shrink-0 text-center min-w-[120px] group/item"
                draggable={false}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 group-hover/item:border-black transition-colors">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                    draggable={false}
                  />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{cat.name}</h3>
                <p className="text-xs text-gray-400">{cat.productCount} items</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

CategoriesSectionClient.displayName = "CategoriesSectionClient";

export default CategoriesSectionClient;
