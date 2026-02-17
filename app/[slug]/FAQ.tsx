"use client";
import { useRef, useState, MutableRefObject } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  faqs: FAQItem[];
};

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const faqLeft = {
    title: "Why Choose Like Telecom ?",
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const contentRefs = useRef<HTMLDivElement[]>([]) as MutableRefObject<
    HTMLDivElement[]
  >;

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className="w-6/12 md:w-full bg-white p-4 mt-10 py-6">
      <h2 className="md:text-2xl text-xl font-semibold mb-4">
        - {faqLeft.title}
      </h2>

      <div className="flex flex-col gap-3">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md bg-white"
          >
            {/* QUESTION BUTTON */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center px-4 py-4 text-left hover:bg-gray-100 transition"
            >
              <span className="text-gray-800 text-sm md:text-lg font-medium">
                {item.question}
              </span>

              {activeIndex !== index ? (
                // Down arrow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : (
                // Up arrow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>

            {/* ANSWER */}
            <div
              ref={(el) => {
                if (el) contentRefs.current[index] = el;
              }}
              style={{
                maxHeight:
                  activeIndex === index
                    ? `${contentRefs.current[index]?.scrollHeight}px`
                    : "0",
              }}
              className="overflow-hidden bg-[#f4f4f4] transition-all duration-500"
            >
              <p className="px-4 py-4 text-sm md:text-lg text-gray-700 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
