import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Digicam Market",
  description: "Sign in to your Digicam Market account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center">Login form coming soon</p>
        </div>
      </div>
    </div>
  );
}