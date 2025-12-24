import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
  "name": "Digicam Market",
  "url": "https://digicammarket.com",
  "logo": "https://digicammarket.com/logo.png",
  "description": "Premium camera store offering quality cameras and photography equipment for everyone.",
    "sameAs": [
  "https://facebook.com/digicammarket",
  "https://twitter.com/digicammarket", 
  "https://instagram.com/digicammarket"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Camera Street",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
  "telephone": "+1-555-123-4567",
  "contactType": "customer service",
  "email": "contact@digicammarket.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
  "name": "Digicam Market Camera Collection",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Camera Collection",
            "category": "Cameras & Photography"
          }
        }
      ]
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}