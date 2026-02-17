"use client"

import React, { useState } from 'react';

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState('to-be-reviewed');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px]">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('to-be-reviewed')}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
            activeTab === 'to-be-reviewed'
              ? 'bg-[#E9672B] text-white'
              : 'bg-[#F3F4F6] text-gray-500 hover:bg-gray-200'
          }`}
        >
          To Be Reviewed
        </button>
        <button
          onClick={() => setActiveTab('review-history')}
          className={`px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${
            activeTab === 'review-history'
              ? 'bg-[#E9672B] text-white'
              : 'bg-[#F3F4F6] text-gray-500 hover:bg-gray-200'
          }`}
        >
          Review History
        </button>
      </div>

      {/* --- Empty State Section --- */}
      <div className="bg-[#F3F4F6] rounded-xl py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold text-gray-900">No Record found!</h2>
      </div>
    </div>
  );
}