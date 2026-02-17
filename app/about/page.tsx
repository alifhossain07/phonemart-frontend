import React from "react";

export default function Page() {
  return (
    <div className="w-11/12 mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af] mb-6">
          About PhoneMart
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          PhoneMart is your trusted destination for premium mobile phones, accessories, and innovative tech solutions. 
          We are committed to providing exceptional customer service and competitive pricing to enhance your digital lifestyle.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-[#1e40af] text-white rounded-xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-base md:text-lg leading-relaxed">
            To provide high-quality mobile phones and accessories that enhance the everyday digital experience of our customers. 
            We strive to maintain the highest standards of customer service, trust, and satisfaction.
          </p>
        </div>

        <div className="bg-[#1e40af] text-white rounded-xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-base md:text-lg leading-relaxed">
            To become the most trusted and leading provider of mobile phones and accessories, recognized for quality, 
            innovation, and customer-first approach. We aim to make technology accessible and reliable for all.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#1e40af] mb-2">Free Delivery</h3>
          <p className="text-sm text-gray-600">On orders over ৳2000</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#1e40af] mb-2">Cash on Delivery</h3>
          <p className="text-sm text-gray-600">Pay when you receive</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#1e40af] mb-2">24/7 Support</h3>
          <p className="text-sm text-gray-600">Always here to help</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#1e40af] mb-2">Warranty</h3>
          <p className="text-sm text-gray-600">Hassle-free warranty</p>
        </div>
      </div>
    </div>
  );
}
