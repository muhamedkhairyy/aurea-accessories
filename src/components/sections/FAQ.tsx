"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { translations } from "@/utils/translations";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useShop();
  const t = translations[language];

  const FAQS: FAQItem[] = [
    {
      question: t.faq_q1,
      answer: t.faq_a1
    },
    {
      question: t.faq_q2,
      answer: t.faq_a2
    },
    {
      question: t.faq_q3,
      answer: t.faq_a3
    },
    {
      question: t.faq_q4,
      answer: t.faq_a4
    },
    {
      question: t.faq_q5,
      answer: t.faq_a5
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            {t.faq_tag}
          </span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111]">
            {t.faq_title}
          </h2>
          <p className="mt-3 text-sm text-[#71717A]">
            {t.faq_subtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E4E4E7] bg-[#F8F5F2]/45 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif text-sm sm:text-base font-bold text-[#111111] hover:text-[#C9A227] transition-colors outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#C9A227] flex-shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#111111]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#71717A]" />
                  )}
                </button>

                {/* Accordion panel content with height transition */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-40 border-t border-[#E4E4E7]/60" : "max-h-0"
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-[#71717A] leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
