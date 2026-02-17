"use client";

import React from "react";

// Product interface matching the one from compare page
interface Product {
  id?: number | string;
  slug?: string;
  name: string;
  brand?: {
    name: string;
  };
  thumbnail_image?: string;
  photos?: Array<{ path: string }>;
  other_features?: string;
  warranty?: {
    text?: string;
    logo?: string;
  } | string;
  basic_specs?: {
    display?: string;
    processor?: string;
    battery?: string;
    camera?: string;
    others?: string;
  } | null;
  specifications?: Array<{
    title: string;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  }>;
  seo?: {
    slug?: string;
  };
  main_price?: string | number;
  stroked_price?: string | number;
  discount?: string;
}

interface AlignedSpecificationsProps {
  product1: Product | null;
  product2: Product | null;
  brand1: string;
  brand2: string;
  shortDescription1: string;
  shortDescription2: string;
  warranty1: string;
  warranty2: string;
}

// Basic specifications structure - matches backend basic_specs fields
const BASIC_SPECIFICATIONS = [
  { key: "display", label: "Display" },
  { key: "processor", label: "Processor" },
  { key: "battery", label: "Battery" },
  { key: "camera", label: "Camera" },
  { key: "others", label: "Others" },
];

const AlignedSpecifications: React.FC<AlignedSpecificationsProps> = ({
  product1,
  product2,
  brand1,
  brand2,
  shortDescription1,
  shortDescription2,
  warranty1,
  warranty2,
}) => {
  // Helper function to get basic spec value
  const getBasicSpecValue = (
    product: Product | null,
    key: string
  ): string => {
    if (!product || !product.basic_specs) return "";
    return product.basic_specs[key as keyof typeof product.basic_specs] || "";
  };

  return (
    <div className="w-full min-w-full">
      <table className="w-full border-collapse text-[9px] sm:text-xs md:text-sm">
        <tbody>
          {/* Product Info Rows - Brand, Short Description, Warranty */}
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Brand
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {brand1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {brand2 || "-"}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Short Description
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {shortDescription1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {shortDescription2 || "-"}
            </td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
              Warranty
            </td>
            <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {warranty1 || "-"}
            </td>
            <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
              {warranty2 || "-"}
            </td>
          </tr>

          {/* Basic Specifications Section */}
          <tr>
            <td
              colSpan={3}
              className="border-b border-gray-200 bg-blue-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-bold text-blue-600"
            >
              BASIC SPECIFICATIONS
            </td>
          </tr>

          {/* Basic Specification Rows */}
          {BASIC_SPECIFICATIONS.map((spec) => {
            const value1 = getBasicSpecValue(product1, spec.key);
            const value2 = getBasicSpecValue(product2, spec.key);

            // Only show row if at least one product has this spec
            if (!value1 && !value2) return null;

            return (
              <tr key={spec.key} className="border-b border-gray-200">
                {/* Specification Name Column */}
                <td className="border-r border-gray-200 bg-gray-50 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 font-medium text-gray-700 w-1/3">
                  {spec.label}
                </td>
                {/* Product 1 Value Column */}
                <td className="border-r border-gray-200 px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
                  {value1 || "-"}
                </td>
                {/* Product 2 Value Column */}
                <td className="px-1 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 text-gray-600 w-1/3">
                  {value2 || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlignedSpecifications;

