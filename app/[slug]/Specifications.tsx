"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Attribute {
  name: string;
  value: string;
}

interface SpecificationSection {
  title: string;
  attributes: Attribute[];
}

interface SpecificationsProps {
  specifications: SpecificationSection[];
}

const Specifications: React.FC<SpecificationsProps> = ({ specifications }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>(
  specifications.map((_, index) => index) // open all by default
);

  // 🔹 Make it truly dynamic
  // useEffect(() => {
  //   if (specifications.length) {
  //     setOpenIndexes(specifications.map((_, index) => index)); // open all by default
  //   }
  // }, [specifications]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!specifications.length) return null;

  return (
    <div className="w-6/12 md:w-full max-w-[1140px] md:mx-auto space-y-4 bg-white p-6 rounded-xl">
      <h1 className="text-2xl font-semibold">Specifications</h1>

      {specifications.map((section, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={`${section.title}-${index}`}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-4 py-4 text-left font-medium text-gray-800 hover:bg-gray-50"
            >
              <span>{section.title}</span>
              <FaChevronDown
                className={`transition-transform duration-500 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Animated Content */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-700 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  isOpen ? "max-h-[2000px]" : "max-h-0"
                }`}
              >
                <table className="w-full border-t border-gray-200">
                  <tbody>
                    {section.attributes.map((row, i) => (
                      <tr key={`${row.name}-${i}`} className="border-b last:border-b-0">
                        <td className="w-[20%] px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Specifications;
