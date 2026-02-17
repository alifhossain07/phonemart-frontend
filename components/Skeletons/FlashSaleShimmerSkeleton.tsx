import React from "react";

const FlashSaleShimmerSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-col h-[470px] xl:flex-row 2xl:flex-row items-stretch justify-between gap-6">
      {/* Left: Deal of the Day Skeleton */}
      <div className="relative flex flex-col justify-center items-center rounded-2xl p-8 text-center md:w-full xl:w-72 2xl:w-96 min-h-full overflow-hidden bg-gray-200 animate-pulse">
        <div className="relative text-white space-y-5 z-10">
          {/* Shimmer for the text */}
          <div className="w-3/4 h-6 bg-gray-300 animate-pulse mb-2"></div> {/* "Only One Week Offer's" */}
          <div className="w-2/3 h-8 bg-gray-300 animate-pulse mb-2"></div> {/* "Deal of the Day" */}
          <div className="w-1/2 h-6 bg-gray-300 animate-pulse mb-4"></div> {/* Description */}
          
          {/* Countdown Timer Skeleton */}
          <div className="grid grid-cols-4 md:ml-16 ml-5 xl:ml-0 xl:mr-8 2xl:mr-8 2xl:ml-0 mt-10 xl:gap-7 2xl:gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white text-orange-500 rounded-lg xl:py-3 md:pt-3 pt-3 pb-2 2xl:py-5 xl:pt-4 md:px-10 xl:px-0 2xl:px-10 flex flex-col items-center justify-center w-14"
              >
                <div className="w-12 h-6 bg-gray-300 animate-pulse mb-2"></div> {/* Timer value */}
                <div className="w-10 h-2 bg-gray-300 animate-pulse"></div> {/* Label (e.g., Days, Hours) */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Full-width Skeleton */}
      <div className="w-full flex justify-center items-center min-h-[300px] bg-gray-100 rounded-lg">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div> {/* Full-width shimmer div */}
      </div>
    </div>
  );
};

export default FlashSaleShimmerSkeleton;
