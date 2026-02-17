"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar } from "react-icons/fi";

interface FlashDeal {
  id: string;
  slug: string;
  title: string;
  banner: string | null;
  background_color: string;
  text_color: string;
  date: number;
  start_date: string | Date;
  end_date: string | Date;
  products: {
    data: Array<{
      id: number | string;
      slug: string;
      name: string;
      thumbnail_image: string;
      main_price: number;
      stroked_price: number | null;
      discount: number;
    }>;
  };
}

const AllFlashDealsPage = () => {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const totalPages = Math.ceil(flashDeals.length / productsPerPage);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const response = await fetch('/api/flash-deals');
        const result = await response.json();
        
        if (result.success && result.data) {
          setFlashDeals(result.data);
        }
      } catch (error) {
        console.error("Error fetching flash deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

  const getDateRange = (deal: FlashDeal) => {
    const startDate = new Date(deal.start_date);
    const endDate = new Date(deal.end_date);
    
    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString("en-US", { month: "long" });
    const startYear = startDate.getFullYear();
    
    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleString("en-US", { month: "long" });
    const endYear = endDate.getFullYear();
    
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const visibleDeals = flashDeals.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flash deals...</p>
        </div>
      </div>
    );
  }

  if (flashDeals.length === 0) {
    return (
      <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No flash deals available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto pt-10 pb-[56px] min-h-[80vh]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-2">
          All Flash Deals
        </h1>
        <p className="text-sm md:text-lg text-gray-600">
          Discover Our Latest Flash Deals and Special Offers
        </p>
      </div>

      {/* Flash Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {visibleDeals.map((deal) => {
          return (
            <div
              key={deal.id}
              className="bg-white max-w-[470px] p-3 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition relative overflow-hidden flex flex-col"
            >
              {/* Date Range Bar - Light Gray */}
              <div className="bg-gray-100 flex items-center justify-center gap-2 px-4 py-4 mb-3 text-[16px] text-black text-gray-600">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-black font-bold text-2xl" />
                  <span className="text-black font-semibold text-base">{getDateRange(deal)}</span>
                </div>
              </div>

              {/* Banner Image */}
              {deal.banner && (
                <div className="relative w-full h-64 bg-gray-50">
                  <Image
                    src={deal.banner}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* White Footer Section */}
              <div className="bg-white p-4 text-center flex flex-col">
                {/* Flash Deal Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {deal.title}
                </h3>
                
                {/* Product Count */}
                <p className="text-sm text-gray-600 mb-4">
                  {deal.products?.data?.length || 0} Product{deal.products?.data?.length !== 1 ? 's' : ''} Available
                </p>

                {/* View Details Button */}
                <Link href={`/flash-deals/${deal.slug}`}>
                  <button className="w-full bg-[#EB6420] text-white py-2.5 px-4 rounded-lg hover:bg-[#d4561a] transition font-medium">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default AllFlashDealsPage;

