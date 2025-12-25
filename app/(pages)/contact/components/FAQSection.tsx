// Demo FAQ data
const faqs = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard (5-7 days), express (2-3 days), and overnight shipping options for all orders.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of purchase for unused items in original packaging.",
  },
  {
    question: "Do you offer warranty?",
    answer:
      "All products come with manufacturer warranty. Extended warranty options are available at checkout.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Find quick answers to common questions about orders, shipping, and
          returns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-2">
                {faq.question}
              </h4>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
