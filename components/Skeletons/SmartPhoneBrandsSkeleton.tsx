import React from "react";

const SmartPhoneBrandsSkeleton = () => {
  return (
    <div className="w-11/12 py-3 xl:p-10 flex flex-col md:flex-row mx-auto xl:items-center bg-gray-200 rounded-2xl animate-pulse">
      {/* Left Side Skeleton */}
      <div className="py-5 md:w-1/2 px-4">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-300 rounded-md mb-4 w-3/4 md:w-8/12"></div>
        
        {/* Subtitle Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div>

        {/* Button Skeleton */}
        <div className="bg-gray-300 rounded-3xl px-6 py-2 w-64 h-10"></div>
      </div>

      {/* Brand Logos Grid Skeleton */}
      <div className="grid grid-cols-2 items-center md:w-1/2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl flex items-center justify-center p-6"
          >
            <div className="w-20 h-20 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartPhoneBrandsSkeleton;

