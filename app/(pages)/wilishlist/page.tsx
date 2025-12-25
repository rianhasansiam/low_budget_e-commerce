import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist | Digicam Market",
  description: "View and manage your saved items.",
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      </div>
    </div>
  );
}