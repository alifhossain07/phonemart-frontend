"use client"
import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function AddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[600px] relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
        <button className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium text-sm transition-colors">
          Add New
        </button>
      </div>

      {/* Address Card */}
      <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100 relative">
        {/* Action Icons */}
        <div className="absolute top-6 right-6 flex gap-4 text-gray-600">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hover:text-orange-600 transition-colors"
          >
            <FiEdit size={20} />
          </button>
          <button className="hover:text-red-600 transition-colors">
            <FiTrash2 size={20} />
          </button>
        </div>

        {/* Address Details */}
        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-medium">Name :</span> amanulla 27
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Mobile number :</span> 01825479320
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email :</span> amanulla@gmail.com
          </p>
          <p className="text-gray-700 leading-relaxed max-w-2xl">
            <span className="font-medium">Address :</span> Mohammadpur, Dhaka, Gaibandha Sadar, Gaibandha
          </p>
        </div>

        {/* Default Badge */}
        <div className="absolute bottom-6 right-6">
          <span className="bg-[#FFEDE4] text-[#FF8A5C] px-4 py-1.5 rounded-lg text-sm font-semibold border border-[#FFD8C7]">
            Default
          </span>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Update address</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Go back
              </button>
            </div>

            {/* Modal Form */}
            <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full-name *</label>
                <input 
                  type="text" 
                  placeholder="Enter Name"
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400 outline-none"
                />
              </div>

              {/* Mobile & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Mobile number *</label>
                  <input 
                    type="text" 
                    placeholder="Enter number"
                    className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">E-mail *</label>
                  <input 
                    type="email" 
                    placeholder="Enter address"
                    className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              {/* Upazila & District Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Upazila / Thana *</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">District *</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Address line *</label>
                <input 
                  type="text" 
                  placeholder="road/ home nmbr"
                  className="w-full bg-[#F3F4F6] border-none rounded-lg p-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-[#E9672B] hover:bg-[#d55b24] text-white px-10 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}