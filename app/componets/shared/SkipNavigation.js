'use client';

/**
 * Accessibility Skip Navigation Component
 * Allows keyboard users to skip to main content
 */

export default function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-black focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
    >
      Skip to main content
    </a>
  );
}
