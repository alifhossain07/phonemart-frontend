"use client";

import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import FlashSaleShimmerSkeleton from "@/components/Skeletons/FlashSaleShimmerSkeleton";

interface Product {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
}

type BackendProduct = {
  id: number | string;
  name: string;
  slug: string;
  main_price: number;
  stroked_price: number | null;
  discount: number;
  rating: number;
  rating_count?: number;
  thumbnail_image: string;
};

interface FlashDeal {
  id: string;
  title: string;
  slug: string;
  banner: string | null;
  background_color: string;
  text_color: string;
  homepage: number;
  date: number; // Unix timestamp
  products: {
    data: BackendProduct[];
  };
}

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [dealTitle, setDealTitle] = useState<string>("Deal Of The Day");
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [endTime, setEndTime] = useState<number>(0);

  useEffect(() => {
    const fetchFlashDeal = async () => {
      try {
        const response = await fetch('/api/flash-deals');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // Find the flash deal marked for homepage
          const homepageDeal = result.data.find((deal: FlashDeal) => deal.homepage === 1) || result.data[0];
          
          if (homepageDeal) {
            setBanner(homepageDeal.banner || "");
            setDealTitle(homepageDeal.title);
            setEndTime(homepageDeal.date);
            
            // Convert backend products to Product format
            const formattedProducts: Product[] = homepageDeal.products?.data?.map((p: BackendProduct) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.main_price,
              oldPrice: p.stroked_price || p.main_price,
              discount: p.discount ? `${p.discount}% OFF` : "0% OFF",
              rating: typeof p.rating === 'number' ? p.rating : parseFloat(String(p.rating)) || 0,
              reviews: p.rating_count || 0,
              image: p.thumbnail_image || "/images/placeholder.png",
            })) || [];
            
            setProducts(formattedProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching flash deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDeal();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = endTime - currentTime;

      if (timeRemaining <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = timeRemaining % 60;

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="md:w-11/12 w-11/12 mx-auto pb-[56px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left w-full gap-3 mb-7">
        <div className="w-full sm:w-7/12">
          <h1 className="text-2xl sm:text-2xl md:text-4xl font-medium mb-1 md:mb-2">
            Flash Sale Products
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>

        <Link href="/flash-deals">
          <button className="bg-[#EB6420] hidden text-xs sm:text-sm md:text-sm md:flex items-center justify-center gap-2 text-white px-3.5 py-2 rounded-xl hover:text-black hover:bg-gray-200 duration-300 transition whitespace-nowrap">
            See More <FiChevronRight className="text-sm sm:text-base md:text-xl" />
          </button>
        </Link>
      </div>

      {/* Flash Sale Layout */}
      {loading ? (
        <FlashSaleShimmerSkeleton /> // Show shimmer skeleton while loading
      ) : (
        <div className="flex flex-col md:flex-col xl:flex-row 2xl:flex-row  justify-between gap-4 xl:gap-0">
          {/* Left: Deal of the Day */}
          <div
            className="relative flex flex-col justify-center items-center rounded-2xl p-8 text-center md:w-full xl:w-72 2xl:w-[410px] min-h-full overflow-hidden"
            style={{
              backgroundImage: `url(${banner})`, // Set the dynamic banner image
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Black Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
            
            <div 
              className="relative text-white space-y-5 z-10"
              style={{ color: products.length > 0 ? undefined : '#fff' }}
            >
              <p className="text-sm font-medium opacity-90">Limited Time Offer</p>
              <h1 className="md:text-2xl text-xl font-bold">{dealTitle}</h1>
              <p className="md:text-lg">
                Explore brand-new products crafted for style, quality, and innovation.
              </p>

              {/* Countdown */}
              <div className="grid grid-cols-4 md:ml-16 ml-5 xl:ml-0 xl:mr-4 2xl:mr-0 2xl:ml-0 mt-10 xl:gap-7 2xl:gap-4">
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.days}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Days</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.hours}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Hours</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.minutes}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Mins</span>
                </div>
                <div className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14">
                  <span className="2xl:text-2xl font-bold leading-none">{countdown.seconds}</span>
                  <span className="2xl:text-[16px] font-medium mt-1">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Grid */}
          <div className="xl:w-9/12 2xl:w-9/12 w-full flex justify-center items-center min-h-[300px]">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:hidden 2xl:hidden md:gap-4 gap-3 w-full justify-items-center">
                  {products.slice(0, 6).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                <div className="hidden xl:grid grid-cols-5 gap-4 w-full justify-items-center">
                  {products.slice(0, 5).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>No flash sale products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSale;
