"use client";

import React, { useState } from "react";
import { FAQS } from "../../data/products";
import { ChevronDownIcon } from "../common/Icons";
import "./FAQ.css";

export const FAQ = () => {
  const [openId, setOpenId] = useState("faq-1");

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div key={faq.id} className="faq-item">
              <button
                type="button"
                aria-expanded={isOpen}
                className="faq-trigger-btn"
                onClick={() => toggle(faq.id)}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className={`faq-icon-circle ${isOpen ? "expanded" : ""}`}>
                  <ChevronDownIcon size={15} />
                </span>
              </button>

              <div className={`faq-answer-collapse ${isOpen ? "open" : "closed"}`}>
                <div className="faq-answer-inner">
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
