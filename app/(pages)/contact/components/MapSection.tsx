import { MapPin } from "lucide-react";

export default function MapSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Our Store</h2>
      <div className="bg-gray-200 rounded-2xl h-[400px] flex items-center justify-center overflow-hidden">
        {/* Replace with actual map integration (Google Maps, Mapbox, etc.) */}
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            123 Camera Street, New York, NY 10001
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Map integration coming soon
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Response Guarantee
        </h3>
        <p className="text-gray-600">
          We typically respond to all inquiries within 24 hours during business
          days. For urgent matters, please call us directly.
        </p>
      </div>
    </div>
  );
}
