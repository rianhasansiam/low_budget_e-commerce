import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import MissionSection from './components/MissionSection';
import ValuesSection from './components/ValuesSection';
import TeamSection from './components/TeamSection';
import CTASection from './components/CTASection';

// SEO Metadata
export const metadata: Metadata = {
  title: 'About Us | Engineers Gadget - Trusted Online Gadget Store in Bangladesh',
  description:
    'Learn about Engineers Gadget - your trusted online gadget and electronics store in Bangladesh. Discover our mission to provide 100% original quality tech products at the best prices with fast delivery across Bangladesh.',
  keywords: [
    'about us',
    'Engineers Gadget',
    'gadget store Bangladesh',
    'electronics shop Bangladesh',
    'tech gadgets',
    'original gadgets',
    'quality electronics',
    'online shopping Bangladesh',
    'trusted gadget store',
  ],
  openGraph: {
    title: 'About Us | Engineers Gadget',
    description:
      'Your trusted online gadget and electronics store in Bangladesh. Quality Gadget. Smart Price. Serving 25,000+ happy customers nationwide.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Engineers Gadget',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Engineers Gadget',
    description:
      'Your trusted online gadget and electronics store in Bangladesh. Quality Gadget. Smart Price.',
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
            name: 'About EngineersGadget',
            description:
              'Your trusted destination for premium tech gadgets, electronics, and engineering tools.',
            mainEntity: {
              '@type': 'Organization',
              name: 'EngineersGadget',
              description:
                'A tech gadgets and engineering tools store dedicated to providing quality products at great prices for engineers and tech enthusiasts.',
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
