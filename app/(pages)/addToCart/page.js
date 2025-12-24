import AddToCartPageWrapper from './AddToCartPageWrapper';

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  return {
  title: "Shopping Cart - Digicam Market | Premium Cameras",
  description: "Review your selected premium camera items, adjust quantities, and proceed to secure checkout at Digicam Market.",
  keywords: "shopping cart, camera checkout, Digicam Market cart, premium camera cart",
    openGraph: {
  title: "Shopping Cart - Digicam Market | Premium Cameras",
  description: "Review your selected premium camera items, adjust quantities, and proceed to secure checkout at Digicam Market.",
      type: 'website'
    },
    twitter: {
      card: 'summary',
  title: "Shopping Cart - Digicam Market | Premium Cameras",
  description: "Review your selected premium camera items, adjust quantities, and proceed to secure checkout at Digicam Market."
    }
  };
}

export default function AddToCartPage() {
  return <AddToCartPageWrapper />;
}
