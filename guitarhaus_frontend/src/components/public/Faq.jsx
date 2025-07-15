import React, { useState } from "react";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const faqData = [
  {
    question: "How do I book a package?",
    answer:
      "You can book a package by selecting your desired destination, choosing a date, and completing the checkout process.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, you can cancel or modify your booking up to 48 hours before departure. Cancellation policies may apply.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept Credit/Debit cards, UPI, Net Banking, and PayPal for secure transactions.",
  },
  {
    question: "Do I need to carry a printed ticket?",
    answer:
      "No, a digital copy of your booking confirmation is enough. You can show it at the time of check-in.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, our pricing is transparent. The price you see is the final amount you pay, inclusive of all charges.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">❓ Frequently Asked Questions</h2>

        <div className="max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                className="w-full flex justify-between items-center py-4 text-lg font-semibold text-gray-700 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span className="text-2xl">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-800 px-4 pb-4">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faq;
