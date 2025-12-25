import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Digicam Market",
  description: "Review items in your shopping cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    </div>
  );
}