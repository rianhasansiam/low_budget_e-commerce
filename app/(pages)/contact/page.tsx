import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import ContactInfoCards from "./components/ContactInfoCards";
import ContactForm from "./components/ContactForm";
import FAQSection from "./components/FAQSection";

// SEO Metadata
export const metadata: Metadata = {
  title: "Contact Us | Engineers Gadget - Online Gadget Store in Bangladesh",
  description:
    "Get in touch with Engineers Gadget. Contact us for quality tech gadgets and electronics. Email: engineersgadet25@gmail.com | Phone: +880 1621420608 | WhatsApp available. Located in Dhaka, Bangladesh.",
  keywords: [
    "contact Engineers Gadget",
    "gadget store Bangladesh contact",
    "customer support",
    "tech support Bangladesh",
    "electronics help",
    "WhatsApp support",
  ],
  openGraph: {
    title: "Contact Us | Engineers Gadget",
    description:
      "Have questions? Contact Engineers Gadget for all your tech gadget needs in Bangladesh. Quality Gadget. Smart Price.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <ContactInfoCards />
      
      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
