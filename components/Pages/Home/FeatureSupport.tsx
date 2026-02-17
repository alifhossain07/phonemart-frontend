"use client";
import React from "react";
import { 
  FaHandshake, 
  FaCheckCircle, 
  FaBox, 
  FaShippingFast, 
  FaCreditCard, 
  FaLock, 
  FaBoxOpen, 
  FaShieldAlt, 
  FaStar 
} from "react-icons/fa";

type Feature = {
  icon: React.ReactNode;
  title: string;
};

const FeatureSupport = () => {
  const features: Feature[] = [
    {
      icon: (
        <div className="relative">
          <FaHandshake className="w-8 h-8 md:w-12 md:h-12 text-gray-700" />
          <FaCheckCircle className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 text-green-600 bg-white rounded-full" />
        </div>
      ),
      title: "Online Support"
    },
    {
      icon: (
        <div className="relative">
          <div className="flex items-end gap-1">
            <FaBox className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
            <FaBox className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
          </div>
          <FaCheckCircle className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 text-green-600 bg-white rounded-full" />
        </div>
      ),
      title: "Official Product"
    },
    {
      icon: (
        <div className="relative">
          <FaShippingFast className="w-8 h-8 md:w-12 md:h-12 text-gray-700" />
        </div>
      ),
      title: "Fastest Delivery"
    },
    {
      icon: (
        <div className="relative">
          <div className="flex items-center gap-1">
            <FaCreditCard className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
            <FaLock className="w-5 h-5 md:w-7 md:h-7 text-gray-700" />
          </div>
        </div>
      ),
      title: "Secure Payment"
    },
    {
      icon: (
        <div className="relative">
          <FaBoxOpen className="w-8 h-8 md:w-12 md:h-12 text-gray-700" />
        </div>
      ),
      title: "Genuine Product"
    },
    {
      icon: (
        <div className="relative">
          <div className="flex items-center gap-1">
            <FaShieldAlt className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
            <FaStar className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </div>
          <FaCheckCircle className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 text-green-600 bg-white rounded-full" />
        </div>
      ),
      title: "ISO Certified"
    }
  ];

  return (
    <div className="w-11/12 mx-auto">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 pb-7 text-center justify-items-center md:justify-items-stretch">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-[#d7def5] w-[88px] aspect-square md:w-full md:aspect-[5/4] rounded-lg flex flex-col items-center justify-center p-2"
          >
            <div className="mb-1 md:mb-2 flex items-center justify-center">
              {feature.icon}
            </div>
            <span className="text-[12px] md:text-[clamp(12px,1vw,18px)] leading-tight text-gray-700 font-medium">
              {feature.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSupport;
