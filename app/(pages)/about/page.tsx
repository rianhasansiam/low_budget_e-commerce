import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import ValuesSection from './components/ValuesSection';
import TeamSection from './components/TeamSection';
import CTASection from './components/CTASection';

// SEO Metadata
export const metadata: Metadata = {
  title: 'About Us | Low Budget E-Commerce - Affordable Quality Shopping',
  description:
    'Learn about Low Budget E-Commerce - your trusted destination for affordable, quality products. Discover our mission, values, and the team behind your favorite budget-friendly shopping platform.',
  keywords: [
    'about us',
    'low budget shopping',
    'affordable e-commerce',
    'budget-friendly products',
    'online shopping',
    'quality products',
    'discount shopping',
  ],
  openGraph: {
    title: 'About Us | Low Budget E-Commerce',
    description:
      'Your trusted destination for affordable, quality products. Everyone deserves access to great products without breaking the bank.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Low Budget E-Commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Low Budget E-Commerce',
    description:
      'Your trusted destination for affordable, quality products. Everyone deserves access to great products without breaking the bank.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/about',
  },
};

// Enable static generation with revalidation (ISR caching)
export const revalidate = 86400; 
// Force static rendering for better caching
export const dynamic = 'force-static';

const AboutPage = () => {
  return (
    <main>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Low Budget E-Commerce',
            description:
              'Your trusted destination for affordable, quality products.',
            mainEntity: {
              '@type': 'Organization',
              name: 'Low Budget E-Commerce',
              description:
                'An e-commerce platform dedicated to providing quality products at affordable prices.',
              foundingDate: '2024',
              numberOfEmployees: {
                '@type': 'QuantitativeValue',
                value: '50+',
              },
            },
          }),
        }}
      />

      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </main>
  );
};

export default AboutPage;
