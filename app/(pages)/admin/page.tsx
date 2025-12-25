import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Digicam Market",
  description: "Manage products, orders, and settings.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-500">Admin panel coming soon</p>
        </div>
      </div>
    </div>
  );
}