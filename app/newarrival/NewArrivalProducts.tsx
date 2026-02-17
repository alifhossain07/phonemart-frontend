"use client";

import ProductCard from "@/components/ui/ProductCard";
import React, { useState, useMemo, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
};

const NewArrivalProducts = () => {
  // ✅ Product list
  const products = useMemo<Product[]>(
    () => [
      {
        id: 1,
        slug: "25-watt-c",
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 2,
 slug: "25-watt-cd",
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 3,
        slug: "25-watt-cde",
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 4,
        slug: "25-watt-cdr",
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 5,
        slug: "25-watt-cdy",
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 6,
        slug: "25-watt-cdh",
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 7,
        slug: "25-watt-cdhd",
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 8,
        slug: "25-watt-cdaa",
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 9,
        slug: "25-watt-cdasas",
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 10,
        slug: "25-watt-cdasdd",
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 11,
        slug: "25-watt-cdsss",
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 12,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        slug: "25-watt-cdsss",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 13,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        slug: "25-watt-cdsss",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 14,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        slug: "25-watt-cdsss",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 15,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        slug: "25-watt-cdsss",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 16,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        slug: "25-watt-cdsss",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 17,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        slug: "25-watt-cdsss",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 18,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        slug: "25-watt-cdsss",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 19,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        slug: "25-watt-cdsss",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 20,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        slug: "25-watt-cdsss",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 21,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        slug: "25-watt-cdsss",
        reviews: "(10)",
        image: "/images/charger.png",
      },
      {
        id: 22,
        name: "25 Watt Samsung Fast Charger",
        price: 2500,
        oldPrice: 2600,
        discount: "10% Off",
        rating: "3.0",
        slug: "25-watt-cdsss",
        reviews: "(1)",
        image: "/images/charger.png",
      },
      {
        id: 17,
        name: "Super Fast Wall Charger",
        price: 2300,
        oldPrice: 2500,
        discount: "8% Off",
        rating: "4.0",
        slug: "25-watt-cdsss",
        reviews: "(12)",
        image: "/images/charger.png",
      },
      {
        id: 23,
        name: "Compact USB-C Adapter",
        price: 2200,
        oldPrice: 2400,
        discount: "9% Off",
        rating: "4.5",
        slug: "25-watt-cdsss",
        reviews: "(7)",
        image: "/images/charger.png",
      },
      {
        id: 24,
        name: "Dual Port Fast Charger",
        price: 2700,
        oldPrice: 3000,
        discount: "10% Off",
        rating: "3.8",
        slug: "25-watt-cdsss",
        reviews: "(4)",
        image: "/images/charger.png",
      },
      {
        id: 25,
        name: "Super Compact Quick Charger",
        price: 2400,
        oldPrice: 2600,
        discount: "7% Off",
        rating: "4.2",
        slug: "25-watt-cdsss",
        reviews: "(10)",
        image: "/images/charger.png",
      },
    ],
    []
  );

  // ✅ Pagination setup
  const productsPerPage = 15;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // ✅ Filter/Sort dropdown
  const [open, setOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Most Recent");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (option: string) => {
    setSortOption(option);
    setOpen(false);
    // Optional: add sorting logic if desired
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const visibleProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="w-full mx-auto pb-[56px]">
      {/* Header Section */}
      <div className="flex flex-row flex-nowrap justify-between items-center w-full gap-2 mb-7">
  {/* Left: Title + Subtitle */}
  <div className="flex flex-col min-w-0 w-[70%] sm:w-[75%] md:w-[65%] xl:w-[60%] 2xl:w-[55%]">
    <h1 className="text-sm sm:text-lg md:text-2xl xl:text-3xl font-semibold mb-1 truncate">
      New Arrival Products
    </h1>
    <p className="text-[10px] sm:text-xs md:text-sm xl:text-base text-gray-600 leading-snug ">
      Discover Our Latest Arrivals Designed to Inspire and Impress
    </p>
  </div>

  {/* Right: Dropdown */}
  <div className="relative flex-shrink-0" ref={dropdownRef}>
    <button
      onClick={() => setOpen(!open)}
      className="border border-gray-400 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 flex items-center justify-between gap-1 sm:gap-2 rounded-md text-[10px] sm:text-xs md:text-sm bg-white hover:text-gray-700 hover:border-gray-500 transition w-[110px] sm:w-[130px] md:w-[160px]"
    >
      <span className="truncate">{sortOption}</span>
      <FiChevronDown
        className={`text-xs sm:text-sm md:text-lg transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* Dropdown Menu */}
    <div
      className={`absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-md shadow-md w-[130px] sm:w-[160px] md:w-[180px] z-50 transform transition-all duration-200 ${
        open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
      }`}
    >
      {["Most Recent", "Price: Low to High", "Price: High to Low", "Top Rated"].map((option) => (
        <button
          key={option}
          onClick={() => handleSort(option)}
          className={`block w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 ${
            sortOption === option ? "bg-gray-50 font-semibold" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
</div>

      {/* ✅ Fixed-height grid */}
      <div className="flex justify-center min-h-[1050px] md:min-h-[1100px] lg:min-h-[900px]">
        <div
          key={currentPage}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 xl:gap-4 justify-items-center w-[98%] sm:w-full transition-all duration-300 ease-in-out"
        >
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center mt-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            &lt; Back
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalProducts;
