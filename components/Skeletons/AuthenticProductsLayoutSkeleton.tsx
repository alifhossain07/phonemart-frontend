import React from "react";

const AuthenticProductsLayoutSkeleton = () => {
  return (
    <div className="w-11/12 mx-auto py-12">
      {/* Two equal-height columns */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-between gap-5 h-full animate-pulse">
          {/* 1️⃣ Text Skeleton */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <div className="h-7 bg-gray-300 rounded-md mb-3 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>

          {/* 2️⃣ Image Skeleton */}
          <div className="rounded-xl overflow-hidden shadow bg-gray-300 h-[330px] flex items-center justify-center">
            <div className="w-full h-full bg-gray-400 rounded-lg"></div>
          </div>

          {/* 3️⃣ Text Skeleton */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <div className="h-7 bg-gray-300 rounded-md mb-3 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>

          {/* 4️⃣ Text Skeleton */}
          <div className="bg-gradient-to-b from-orange-50 to-orange-100 rounded-xl shadow p-6">
            <div className="h-7 bg-gray-300 rounded-md mb-3 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-5 h-full animate-pulse">
          {/* 1️⃣ Text Skeleton - expands to fill space */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow p-6 flex-grow">
            <div className="h-7 bg-gray-300 rounded-md mb-3 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          {/* 2️⃣ Image Skeleton */}
          <div className="rounded-xl overflow-hidden shadow bg-gray-300 h-[330px] flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-gray-400 rounded-lg"></div>
          </div>

          {/* 3️⃣ Text Skeleton - expands to fill remaining space */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl shadow p-6 flex-grow">
            <div className="h-7 bg-gray-300 rounded-md mb-3 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticProductsLayoutSkeleton;

