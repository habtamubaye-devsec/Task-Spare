"use client";

/* ─── FAQ Section ─── */
/* Left: heading + illustration. Right: accordion questions list.
   Matches the TaskIQ design: "Questions about our platform? We've got you covered." */

import { useState } from "react";

const faqs = [
  {
    q: "Smart AI chatbots, ready to automate your workflow.",
    a: "Our AI-powered chatbots integrate seamlessly with your existing tools, automating repetitive tasks and freeing your team to focus on high-value work.",
  },
  {
    q: "Feed it FAQs, scripts, or connect it to knowledge bases.",
    a: "Simply upload your documentation, FAQs, or connect your knowledge base. The chatbot learns and adapts to provide accurate, contextual responses.",
  },
  {
    q: "AI chatbots made simple: no coding, just results.",
    a: "Set up your chatbot in minutes with our no-code builder. Drag and drop components, define conversation flows, and deploy instantly.",
  },
  {
    q: "No code, no hassle—just powerful AI chatbots.",
    a: "Our visual builder eliminates the need for technical expertise. Anyone on your team can create, manage, and optimize chatbot experiences.",
  },
  {
    q: "Instant support, smarter workflows, happier customers.",
    a: "Deliver 24/7 support, reduce response times by up to 80%, and increase customer satisfaction with intelligent, always-on assistance.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-gray-50/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Heading + illustration */}
          <div>
            {/* Illustration placeholder */}
            <div className="w-48 h-48 mx-auto lg:mx-0 mb-8 relative">
              <div className="w-full h-full rounded-2xl bg-teal-50 flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  {/* Chat bubble illustration */}
                  <rect x="10" y="15" width="35" height="25" rx="6" fill="#0d6e6e" fillOpacity="0.15" />
                  <rect x="35" y="35" width="35" height="25" rx="6" fill="#0d6e6e" fillOpacity="0.25" />
                  <circle cx="22" cy="27" r="3" fill="#0d6e6e" fillOpacity="0.4" />
                  <circle cx="30" cy="27" r="3" fill="#0d6e6e" fillOpacity="0.3" />
                  <circle cx="38" cy="27" r="3" fill="#0d6e6e" fillOpacity="0.2" />
                  <circle cx="47" cy="47" r="3" fill="#0d6e6e" fillOpacity="0.4" />
                  <circle cx="55" cy="47" r="3" fill="#0d6e6e" fillOpacity="0.3" />
                  <circle cx="63" cy="47" r="3" fill="#0d6e6e" fillOpacity="0.2" />
                </svg>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-2 font-medium">
              Crafted with precision and care, this design enhances your
              competitive workflow, and ensures a smooth, enjoyable experience
              for every user.
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-4">
              Questions about our platform?{" "}
              <span className="block">We&apos;ve got you covered.</span>
            </h2>
          </div>

          {/* Right — Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition-colors duration-200 ${
                    isOpen
                      ? "border-teal/30 bg-teal-50/50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isOpen ? "text-teal" : "text-gray-700"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`ml-4 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-teal text-white rotate-45"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? "300px" : "0px",
                      overflow: "hidden",
                      opacity: isOpen ? 1 : 0,
                      transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
                    }}
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
