import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digicammarket.com";

export const metadata: Metadata = {
  title: "All Products - Shop Camera Accessories & Electronics",
  description:
    "Browse our complete collection of camera accessories, DSLR cameras, mirrorless cameras, lenses, tripods, and photography equipment. Best prices with free shipping in Bangladesh.",
  keywords: [
    "camera accessories",
    "DSLR camera",
    "mirrorless camera",
    "camera lens",
    "tripod",
    "photography equipment",
    "buy camera online",
    "camera shop Bangladesh",
    "best camera price",
  ],
  openGraph: {
    title: "All Products | Digicam Market",
    description:
      "Browse our complete collection of camera accessories and electronics. Best prices with free shipping.",
    type: "website",
    url: `${siteUrl}/allProducts`,
    siteName: "Digicam Market",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products | Digicam Market",
    description:
      "Browse our complete collection of camera accessories and electronics. Best prices with free shipping.",
  },
  alternates: {
    canonical: `${siteUrl}/allProducts`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AllProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
