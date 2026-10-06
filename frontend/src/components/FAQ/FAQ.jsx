"use client";

import React, { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "What is your return policy?",
    answer:
      "We accept returns on eligible items within 14 days of delivery. Items must be unused, unworn, and returned in their original condition with all tags attached.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are usually processed within 1–2 business days. Standard delivery generally takes 3–7 business days depending on your location.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been shipped, you will receive a tracking link through your registered email or phone number.",
  },
  {
    question: "Do you offer exchanges?",
    answer:
      "Yes. Exchanges are available for eligible products depending on size and stock availability. Please contact us as soon as possible after receiving your order.",
  },
  {
    question: "How do I choose the right size?",
    answer:
      "You can find our detailed size guide on the product page. We recommend checking your measurements before placing an order.",
  },
  {
    question: "Are your products available online only?",
    answer:
      "Our collections are primarily available through our online store. Follow Flint Sector on social media for updates about upcoming drops and releases.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">

      {/* HEADER */}
      <div className="faq-header">

        <div className="faq-heading">

          <span className="faq-eyebrow">
            FLINT SECTOR / SUPPORT
          </span>

          <h2>
            Frequently
            <br />
            <span>asked.</span>
          </h2>

        </div>

        <p className="faq-intro">
          Everything you need to know about
          <br />
          orders, shipping and our products.
        </p>

      </div>


      {/* FAQ LIST */}
      <div className="faq-list">

        {faqData.map((faq, index) => {

          const isOpen = openIndex === index;

          return (
            <div
              className={`faq-item ${isOpen ? "active" : ""}`}
              key={faq.question}
            >

              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
              >

                <div className="faq-question-left">

                  <span className="faq-number">
                    0{index + 1}
                  </span>

                  <span className="faq-title">
                    {faq.question}
                  </span>

                </div>


                <span className="faq-icon">
                  {isOpen ? "−" : "+"}
                </span>

              </button>


              <div
                className="faq-answer-wrapper"
                style={{
                  maxHeight: isOpen ? "300px" : "0px",
                }}
              >

                <div className="faq-answer">
                  {faq.answer}
                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* FOOTER */}
      <div className="faq-footer">

        <span>
          STILL HAVE QUESTIONS?
        </span>

        <a href="#contact">
          CONTACT US
          <span>↗</span>
        </a>

      </div>

    </section>
  );
}