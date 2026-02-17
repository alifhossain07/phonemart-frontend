"use client"
import React from 'react';

export default function PasswordPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      {/* Header Section */}
      <div className="relative mb-8 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Set Password</h1>
        {/* The orange underline under the header title */}
        <div className="absolute bottom-[-1px] left-0 w-16 h-1 bg-[#E9672B]"></div>
      </div>

      <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            New Password *
          </label>
          <input
            type="password"
            placeholder="Enter New Password"
            className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
        </div>

        

        {/* Submit Button Section */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
          >
            Save password
          </button>
        </div>
      </form>
    </div>
  );
}