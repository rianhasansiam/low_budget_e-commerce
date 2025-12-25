import type { Metadata } from "next";
import HeroCarousel from "./components/HeroCarousel";

import FeaturedProducts from "./components/FeaturedProducts";


import NewsletterSection from "./components/NewsletterSection";
import CategoriesSection from "./components/CategoriesSection";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digicammarket.com";

// SEO Metadata
export const metadata: Metadata = {
  title: "Digicam Market | Best Camera Accessories & Electronics Store in Bangladesh",
  description:
    "Shop the best camera accessories, DSLR cameras, mirrorless cameras, lenses, tripods, lighting, and photography equipment at unbeatable prices. Free shipping, easy EMI, and 24/7 customer support in Bangladesh.",
  keywords: [
    "camera accessories Bangladesh",
    "DSLR camera price BD",
    "mirrorless camera",
    "camera lens",
    "tripod stand",
    "photography equipment",
    "online camera shop",
    "best camera deals",
    "camera store Bangladesh",
    "buy camera online",
    "photography gear",
    "videography equipment",
  ],
  openGraph: {
    title: "Digicam Market | Best Camera Accessories & Electronics Store",
    description:
      "Shop premium camera accessories and electronics at the best prices. Free shipping & easy EMI available in Bangladesh.",
    type: "website",
    url: siteUrl,
    siteName: "Digicam Market",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Digicam Market - Your Premier Camera Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digicam Market | Best Camera Accessories Store",
    description:
      "Shop premium camera accessories and electronics at unbeatable prices.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Digicam Market - Home",
            description: "Best Camera Accessories & Electronics Store in Bangladesh",
            url: siteUrl,
            isPartOf: {
              "@type": "WebSite",
              name: "Digicam Market",
              url: siteUrl,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: siteUrl,
                },
              ],
            },
          }),
        }}
      />
      <HeroCarousel />
     
      <CategoriesSection />
      <FeaturedProducts />

      

      <NewsletterSection />
    </main>
  );
}
