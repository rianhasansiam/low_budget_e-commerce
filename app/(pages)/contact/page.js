import ContactPageClient from './ContactPageClient';

// Metadata for SEO
export const metadata = {
  title: "Contact Us - Digicam Market | Customer Support & Help",
  description: "Get in touch with Digicam Market for questions about our premium camera collections. Email, phone, and visit us in New York.",
  keywords: "contact Digicam Market, customer support, camera help, customer service, contact information",
  openGraph: {
    title: "Contact Us - Digicam Market | Customer Support",
    description: "Get in touch with Digicam Market for any questions about our premium camera collections.",
    type: "website",
  },
  alternates: {
    canonical: '/contact',
  },
};

// Simple contact page
export default function ContactPage() {
  // Contact information (this is server-side data)
  const contactData = {
    title: "Contact Us",
    subtitle: "Have questions? We're here to help!",
    description: "Get in touch with us for any questions about our products or services.",
    address: "Dhanmondi, Dhaka, Bangladesh",
    contactMethods: [
      {
        iconName: "Mail",
        label: "Email Us",
        value: "digicammarketbd@gmail.com",
        description: "We'll respond within 24 hours"
      },
      {
        iconName: "Phone",
        label: "Call Us",
        value: "+880 18704 04001",
        description: "Everyday: 9:00 AM - 6:00 PM"
      },
      {
        iconName: "MapPin",
        label: "Visit Us",
        value: "Dhanmondi, Dhaka",
        description: "Dhaka, Bangladesh"
      }
    ],
    businessHours: [
      { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
      { days: "Sunday", hours: "Closed" }
    ],
    socialLinks: [
      { 
        iconName: "Facebook",
        url: "https://www.facebook.com/share/19Tm5Tru5w/"
      },
      { 
        iconName: "Whatsapp",
        url: "https://wa.me/8801870404001"
      },
      { 
        iconName: "Instagram",
        url: "https://www.instagram.com/digicam.market?igsh=MXhhMnp6M2I1anhtaw=="
      }
    ],
    formConfig: {
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name"
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "Enter your email address"
        },
        {
          name: "subject",
          label: "Subject",
          type: "text",
          required: true,
          placeholder: "What is this regarding?"
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true,
          placeholder: "Tell us how we can help you...",
          rows: 6
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <ContactPageClient contactData={contactData} />
    </main>
  );
}
