import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import ContactInfoCards from "./components/ContactInfoCards";
import ContactForm from "./components/ContactForm";
import MapSection from "./components/MapSection";
import FAQSection from "./components/FAQSection";

// SEO Metadata
export const metadata: Metadata = {
  title: "Contact Us | Digicam Market - Camera Accessories Store",
  description:
    "Get in touch with Digicam Market. We're here to help with your camera accessory needs. Contact us via email, phone, or visit our store.",
  keywords: [
    "contact digicam market",
    "camera store contact",
    "customer support",
    "camera accessories help",
  ],
  openGraph: {
    title: "Contact Us | Digicam Market",
    description:
      "Have questions? We'd love to hear from you. Reach out to Digicam Market for all your camera accessory needs.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <ContactInfoCards />
      
      {/* Contact Form & Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <MapSection />
          </div>
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
