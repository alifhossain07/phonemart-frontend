"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string | number;
  name: string;
  slug: string;
  icon: string | null;
};

type APICategory = {
  id: string | number;
  name: string;
  slug: string;
  icon: string | null;
  banner?: string | null;
  cover_image?: string | null;
  featured?: boolean;
  parent_id?: string | null;
  order?: number;
};

type Banner = {
  id?: string | number;
  photo: string;
  url?: string;
  position: number | string;
};

const BannerHighlights = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [leftBanners, setLeftBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategoriesLoading(true);
        
        const res = await fetch("/api/categories", { cache: "no-store" });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || "Failed to load categories");
        }

        const apiCategories = json.data || [];
        
        // Map API response to component format and limit to 4
        const formatted: Category[] = apiCategories
          .slice(0, 4)
          .map((cat: APICategory) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || null,
          }));

        setCategories(formatted);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fetch banner highlights banners from Express backend
  useEffect(() => {
    async function fetchBanners() {
      try {
        setLoading(true);
        
        // Fetch banner highlights banners (left and right)
        const [leftBannerRes, rightBannerRes] = await Promise.all([
          fetch("/api/banners?type=banner-highlights-left", { cache: "no-store" }),
          fetch("/api/banners?type=banner-highlights-right", { cache: "no-store" })
        ]);

        const banners: Banner[] = [];
        
        if (leftBannerRes.ok) {
          const leftJson = await leftBannerRes.json();
          const leftBanner = leftJson.data?.[0];
          if (leftBanner) {
            banners.push({ id: leftBanner.id, photo: leftBanner.photo, position: 0 });
          }
        }
        
        if (rightBannerRes.ok) {
          const rightJson = await rightBannerRes.json();
          const rightBanner = rightJson.data?.[0];
          if (rightBanner) {
            banners.push({ id: rightBanner.id, photo: rightBanner.photo, position: 1 });
          }
        }

        setLeftBanners(banners);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  const leftBannerImage = leftBanners[0]?.photo;
  const rightBannerImage = leftBanners[1]?.photo;

  // Skeleton component
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
  );

  return (
    <div className="w-11/12 mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left Banner (556x756) */}
        <div className="flex-1 relative aspect-[556/756] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            leftBannerImage && (
              <Image
                src={leftBannerImage}
                alt="Left Banner"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-fill"
              />
            )
          )}
        </div>

        {/* Middle Category Grid */}
        <div className="flex-1 flex flex-col rounded-2xl shadow-md bg-[#8ca3f1]">
          <div className="px-4 sm:px-6 pt-6 pb-3">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">
              Shop the Best in Each Category
            </h1>
          </div>

          <div className="flex-1 px-4 sm:px-6 pb-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 h-full">
              {categoriesLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-between p-3 sm:p-4"
                    >
                      <Skeleton className="w-full aspect-[1/1] mb-3" />
                      <Skeleton className="w-3/4 h-3 sm:h-4 md:h-5" />
                    </div>
                  ))
                : categories.length > 0
                ? categories.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-between p-3 sm:p-4 hover:shadow-lg transition"
                    >
                      <div className="flex-1 w-full flex justify-center items-center">
                        {item.icon ? (
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={450}
                            height={450}
                            className="w-full h-full bg-gray-100 object-contain"
                            loading="lazy"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Icon</span>
                          </div>
                        )}
                      </div>
                      <h1 className="font-bold text-xs sm:text-sm md:text-xl text-gray-800 mt-3 text-center">
                        {item.name}
                      </h1>
                    </Link>
                  ))
                : Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center p-3 sm:p-4"
                    >
                      <span className="text-gray-400 text-xs">No categories</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Banner (556x756) */}
        <div className="flex-1 relative aspect-[556/756] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          {loading ? (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          ) : (
            rightBannerImage && (
              <Image
                src={rightBannerImage}
                alt="Right Banner"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerHighlights;
