import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-black mb-10 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-400 max-w-md">
              Get the latest deals, new arrivals, and exclusive offers delivered
              directly to your inbox.
            </p>
          </div>

          {/* Form */}
          <div className="w-full lg:w-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-80 pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-3 text-center sm:text-left">
              By subscribing, you agree to our{" "}
              <Link href="/privacy" className="text-gray-400 hover:text-white underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
