import React from 'react';
import Image from 'next/image';
import { LuGift } from "react-icons/lu"; // Gift icon for the empty state

export default function CouponPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Coupon</h1>
      </div>

      <div className="space-y-6">
        {/* --- Empty State Section --- */}
        <div className="bg-[#F3F4F6] rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            {/* Outline Gift Icon matching the design */}
            <LuGift size={64} className="text-gray-900 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No Record found!</h2>
        </div>

        {/* --- Promotional Banner Section --- */}
        <div className="relative w-full overflow-hidden rounded-xl shadow-md">
          {/* Replace the src with your actual banner image path */}
          <Image 
            src="/path-to-your-banner.jpg" 
            alt="Promotion Banner"
            width={800}
            height={180}
            className="w-full h-auto object-cover min-h-[180px]"
          />
          
          {/* Fallback styling if image is missing to show the black aesthetics */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}