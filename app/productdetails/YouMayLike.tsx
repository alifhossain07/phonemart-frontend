"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { FiChevronRight } from "react-icons/fi";
import Loader from "@/components/ui/Loader";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  slug: string;
}

const YouMayLike = () => {
  const [products] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);

  // API removed - new arrivals will be loaded from new Express.js admin panel
  useEffect(() => {
    setLoading(false);
  }, []);

  // handle responsive product count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        // xl and above
        setItemsToShow(5);
      } else {
        // default + md
        setItemsToShow(6);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full mx-auto pt-[56px] pb-[56px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-semibold mb-1 md:mb-2">
            You May Also Like
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <button className="bg-black hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
          See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="flex justify-center">
        {loading ? (
          <Loader/>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-6 xl:gap-4 justify-items-center w-[98%] sm:w-full">
            {products.slice(0, itemsToShow).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouMayLike;
