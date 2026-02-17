"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import SmartPhoneBrandsSkeleton from "@/components/Skeletons/SmartPhoneBrandsSkeleton";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
};

const SmartPhoneBrands = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch title and subtitle
        const sectionResponse = await fetch('/api/smartphone-brands');
        const sectionResult = await sectionResponse.json();
        
        if (sectionResult.success && sectionResult.data) {
          setTitle(sectionResult.data.title || '');
          setSubtitle(sectionResult.data.subtitle || '');
        }

        // Fetch categories (for brand icons)
        const categoriesResponse = await fetch('/api/categories');
        const categoriesResult = await categoriesResponse.json();
        
        if (categoriesResult.success && categoriesResult.data) {
          // Filter categories that have icons and limit to a reasonable number
          const categoriesWithIcons = categoriesResult.data
            .filter((cat: Category) => cat.icon)
            .slice(0, 8); // Limit to 8 categories for display
          setCategories(categoriesWithIcons);
        }
      } catch (error) {
        console.error("Error fetching smartphone brands data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <SmartPhoneBrandsSkeleton />;
  }

  return (
    <div className="w-11/12 py-3 xl:p-10 flex flex-col md:flex-row mx-auto xl:items-center bg-gray-200 rounded-2xl">
      <div className="py-5 md:w-1/2 px-4">
        <h1 className="text-xl md:text-3xl md:text-left md:w-8/12 font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 text-justify mb-6 leading-relaxed">
          {subtitle}
        </p>
        <button className="bg-[#1e40af] hover:bg-[#6b89ee] text-white md:px-6 md:py-2 px-3 py-1 flex items-center rounded-3xl font-medium transition">
          Shop The New Arrivals Today
          <FiChevronRight className="text-white text-lg ml-1" />
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Category Icons (Brand Logos) */}
      <div className="grid grid-cols-2 items-center md:w-1/2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 ">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl flex items-center justify-center p-6 hover:shadow-lg transition cursor-pointer"
          >
            {category.icon && (
              <Image
                src={category.icon}
                alt={category.name}
                width={180}
                height={100}
                className="object-contain w-auto h-16 md:h-20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartPhoneBrands;