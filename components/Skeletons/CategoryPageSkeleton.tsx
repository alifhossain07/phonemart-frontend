"use client";
import React from "react";

const CategoryPageSkeleton = () => {
  return (
    <div className="w-11/12 pt-6 md:pt-10 pb-[56px] mx-auto animate-pulse">
      {/* Title + subtitle */}
      <div className="mb-4 md:mb-6">
        <div className="h-7 md:h-9 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>

      <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-4">
        {/* Sidebar skeleton */}
        <div className="hidden xl:block xl:w-[340px] 2xl:w-[355px]">
          <div className="w-full bg-[#f4f4f4] rounded-md shadow p-4 border space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>

            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-t pt-3 space-y-3">
                <div className="h-5 w-28 bg-gray-200 rounded" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: filter bar + grid skeleton */}
        <div className="w-full xl:flex-1 2xl:w-[1368px]">
          {/* Desktop filter bar skeleton */}
          <div className="hidden xl:flex justify-between rounded-xl bg-[#f4f4f4] p-4 mb-6 items-center">
            <div className="h-4 w-52 bg-gray-200 rounded" />
            <div className="h-9 w-40 bg-gray-200 rounded" />
          </div>

          {/* Mobile "showing" text */}
          <div className="xl:hidden mb-3 h-3 w-40 bg-gray-200 rounded" />

          {/* Grid of product-card skeletons */}
          <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-7">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative w-full max-w-[350px] rounded-lg shadow-md border border-gray-200 flex flex-col bg-white"
              >
                {/* image area */}
                <div className="relative bg-gray-100 h-[180px] md:h-[220px] rounded-md overflow-hidden">
                  <div className="absolute top-2 left-2 h-4 w-16 bg-gray-200 rounded-full" />
                  <div className="w-[100px] md:w-[110px] h-[100px] md:h-[110px] bg-gray-200 rounded-md absolute inset-0 m-auto" />
                  <div className="absolute bottom-2 left-2 h-5 w-24 bg-gray-200 rounded-md" />
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  {/* title */}
                  <div className="space-y-2 mb-3 h-[45px]">
                    <div className="h-3 w-4/5 bg-gray-200 rounded" />
                    <div className="h-3 w-3/5 bg-gray-200 rounded" />
                  </div>

                  {/* specs */}
                  <div className="space-y-2 h-[55px]">
                    <div className="h-6 w-full bg-gray-200 rounded-md" />
                    <div className="h-6 w-5/6 bg-gray-200 rounded-md" />
                  </div>

                  {/* price row */}
                  <div className="flex items-center gap-2 mt-4 mb-2 h-[32px]">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-14 bg-gray-200 rounded" />
                    <div className="h-4 w-10 bg-gray-200 rounded-full" />
                  </div>

                  {/* buttons row */}
                  <div className="flex gap-2 h-[42px] mt-1">
                    <div className="w-1/2 h-full bg-gray-200 rounded-md" />
                    <div className="w-1/2 h-full bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-8 md:mt-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-7 w-16 bg-gray-200 rounded-md" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-7 bg-gray-200 rounded-md"
                />
              ))}
              <div className="h-7 w-16 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageSkeleton;