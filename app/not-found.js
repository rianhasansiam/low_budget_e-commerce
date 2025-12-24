import Link from 'next/link';
import Image from 'next/image';

// Metadata for 404 page
export const metadata = {
  title: "Page Not Found - Digicam Market | Premium Camera Store",
  description: "The page you're looking for doesn't exist. Continue shopping at Digicam Market for premium cameras and photography equipment.",
  robots: "noindex, nofollow",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
    

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-9xl md:text-[12rem] font-bold text-gray-200 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-white text-4xl">👗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              The camera gear you&apos;re looking for seems to have been discontinued or moved. 
              Don&apos;t worry, we have plenty more stunning styles waiting for you!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white font-medium rounded-xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🏠</span>
              Back to Home
            </Link>
            <Link
              href="/allProducts"
              className="inline-flex items-center px-8 py-3 bg-white text-gray-800 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🛍️</span>
              Browse Products
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/allProducts?category=dslr"
                className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">�</div>
                <span className="text-sm font-medium text-gray-700">DSLR Cameras</span>
              </Link>
              <Link
                href="/allProducts?category=mirrorless"
                className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">�</div>
                <span className="text-sm font-medium text-gray-700">Mirrorless Cameras</span>
              </Link>
              <Link
                href="/allProducts?category=accessories"
                className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎒</div>
                <span className="text-sm font-medium text-gray-700">Accessories</span>
              </Link>
              <Link
                href="/allProducts?category=lenses"
                className="group p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">�</div>
                <span className="text-sm font-medium text-gray-700">Lenses</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Need help? <Link href="/contact" className="text-gray-900 hover:underline">Contact our support team</Link>
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-700 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact</Link>
            <Link href="/allProducts" className="hover:text-gray-700 transition-colors">Shop</Link>
            <Link href="/profile" className="hover:text-gray-700 transition-colors">My Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}