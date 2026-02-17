"use client";

import Image from "next/image";
import { useState } from "react";

type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
  images: string[];
};

const Reviews = () => {
  // TEMPORARY STATIC DATA (later from API)
  const reviews: Review[] = [
    {
      name: "Amanullah",
      date: "03 Sep 2025",
      rating: 5,
      text: "It is a real-capacity 5V 2A charger with a Type-C cable and a 180-day warranty. I am happy to get this charger from Startech. Thank you!",
      images: ["/images/reviewpic.png","/images/reviewpic.png"],
    },
    {
      name: "Amanullah",
      date: "03 Sep 2025",
      rating: 5,
      text: "It is a real-capacity 5V 2A charger with a Type-C cable and a 180-day warranty. I am happy to get this charger from Startech. Thank you!",
      images: ["/images/reviewpic.png","/images/reviewpic.png"],
    },
    {
      name: "Amanullah",
      date: "03 Sep 2025",
      rating: 5,
      text: "It is a real-capacity 5V 2A charger with a Type-C cable and a 180-day warranty. I am happy to get this charger from Startech. Thank you!",
      images: ["/images/reviewpic.png","/images/reviewpic.png"],
    },
    
  ];

  const [preview, setPreview] = useState<string | null>(null);

  return (
    <section className="w-full py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="md:text-2xl text-xl font-semibold text-gray-900">
            -Reviews ({reviews.length < 10 ? "0" : ""}{reviews.length})
          </h2>
          <p className="text-gray-600 text-sm mt-1 w-10/12 md:w-full">
            Get specific details about this product from customers who own it.
          </p>
        </div>

        <button className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md text-sm hover:bg-orange-50 transition">
          Write a Review
        </button>
      </div>

      {/* Review List */}
      <div className="flex flex-col divide-y divide-gray-300 bg-gray-50 rounded-md">
        {reviews.map((review, idx) => (
          <div key={idx} className="p-6">
            {/* Reviewer Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                  />
                </svg>
              </div>

              <div>
                <p className="text-gray-900 font-medium">{review.name}</p>
                <p className="text-gray-500 text-sm">{review.date}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex text-orange-500 text-lg mb-2">
              {"★".repeat(review.rating)}
            </div>

            {/* Review Text */}
            <p className="text-gray-800 md:text-base text-sm mb-3">{review.text}</p>

            {/* Images */}
            <div className="flex gap-3">
              {review.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setPreview(img)}
                  className="cursor-pointer hover:opacity-90 transition"
                >
                  <Image
                    src={img}
                    alt="review image"
                    width={100}
                    height={100}
                    className="rounded-md object-cover border"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setPreview(null)}
        >
          <Image
            src={preview}
            alt="Preview"
            width={700}
            height={700}
            className="rounded-lg shadow-xl object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default Reviews;
