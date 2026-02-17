import React from "react";

const NewsLetterBannerSkeleton = () => {
  return (
    <div className="w-11/12 pb-10 mx-auto mt-12 animate-pulse">
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 text-white relative overflow-hidden">
        {/* Left Side Skeleton */}
        <div className="relative z-10 flex flex-col items-start gap-5 max-w-lg text-center md:text-left w-full">
          {/* Title Skeleton */}
          <div className="space-y-3 w-full">
            <div className="h-8 bg-white/30 rounded-md w-3/4 mx-auto md:mx-0"></div>
            <div className="h-8 bg-white/30 rounded-md w-5/6 mx-auto md:mx-0"></div>
            <div className="h-6 bg-white/30 rounded-md w-2/3 mx-auto md:mx-0"></div>
          </div>

          {/* Input + Button Skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Input Skeleton */}
            <div className="flex items-center bg-white/20 border border-white/60 rounded-full px-4 py-2 w-full sm:w-auto">
              <div className="w-5 h-5 bg-white/30 rounded mr-2"></div>
              <div className="h-5 bg-white/30 rounded w-48"></div>
            </div>

            {/* Button Skeleton */}
            <div className="bg-white/30 rounded-full px-6 py-2 w-full sm:w-auto">
              <div className="h-5 bg-white/40 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* Background Image Placeholder */}
        <div className="hidden md:block absolute bottom-0 right-0 w-1/3 h-full bg-white/10"></div>
      </div>
    </div>
  );
};

export default NewsLetterBannerSkeleton;

