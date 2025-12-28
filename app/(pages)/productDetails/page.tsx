import { redirect } from 'next/navigation';

// This page handles legacy URLs with query params
// Redirects to the new dynamic route format
export default function ProductDetailsRedirect({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const productId = searchParams.id;
  
  if (productId) {
    redirect(`/productDetails/${productId}`);
  }
  
  // If no ID provided, redirect to all products
  redirect('/allProducts');
}