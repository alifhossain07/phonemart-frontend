"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaBalanceScale } from "react-icons/fa";

interface Product {
  id: number;
  slug?: string;
  name: string;
  seo?: {
    slug?: string;
  };
}

interface AddToCompareProps {
  product: Product;
}

const AddToCompare: React.FC<AddToCompareProps> = ({ product }) => {
  const router = useRouter();
  const params = useParams();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCompare = () => {
    setIsAdding(true);
    
    // Get slug from product.slug, product.seo.slug, or URL params
    const productSlug = product.slug || product.seo?.slug || (params?.slug as string) || "";
    
    if (!productSlug) {
      console.error("No slug found for product");
      setIsAdding(false);
      return;
    }
    
    // Check if there's already a product in compare (via localStorage or URL params)
    const storedCompare = localStorage.getItem("compareProducts");
    let compareProducts: string[] = [];
    
    if (storedCompare) {
      try {
        compareProducts = JSON.parse(storedCompare);
      } catch {
        compareProducts = [];
      }
    }

    // Remove current product if already in list
    compareProducts = compareProducts.filter((slug) => slug !== productSlug);

    // Add current product
    compareProducts.push(productSlug);

    // Keep only the last 2 products
    if (compareProducts.length > 2) {
      compareProducts = compareProducts.slice(-2);
    }

    // Save to localStorage
    localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
    
    // Dispatch custom event to update floating compare button
    window.dispatchEvent(new Event("compareUpdated"));

    // Navigate to compare page
    if (compareProducts.length === 1) {
      router.push(`/compare?product1=${compareProducts[0]}`);
    } else {
      router.push(
        `/compare?product1=${compareProducts[0]}&product2=${compareProducts[1]}`
      );
    }

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <button
      onClick={handleAddToCompare}
      disabled={isAdding}
      className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm font-medium bg-[#f4f4f4] hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaBalanceScale className="w-4 h-4" />
      {isAdding ? "Adding..." : "Add Compare"}
    </button>
  );
};

export default AddToCompare;

