"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  path: string;
  variant?: string;
}

export default function ImageGallery({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety check if photos array is empty
  if (!photos || photos.length === 0) {
    return <div className="text-gray-400">No images available</div>;
  }

  const selectedImage = photos[currentIndex].path;

  // Function to handle Next button
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle Previous button
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full max-w-[550px] mx-auto">
      <div className="w-full max-h-[460px] xl:max-h-[673px] h-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
        
        {/* Main Product Image */}
        <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center aspect-[3/4]">
          {/* Warranty Badge (Optional) */}
          {/* <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-2">
              <div className="flex items-center gap-2">
                <div className="md:text-3xl text-base font-bold">1</div>
                <div className="md:text-xs text-[8px] font-semibold leading-tight">YEAR</div>
              </div>
            </div>
          </div> */}

          <Image
            src={selectedImage}
            alt="Product Image"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Thumbnail Carousel with Working Arrows */}
        <div className="relative">
          {/* Previous Button */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto px-8 scrollbar-hide scroll-smooth">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                  currentIndex === index ? "border-orange-500" : "border-gray-100"
                }`}
              >
                <Image
                  src={photo.path}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}