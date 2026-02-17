"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
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

const PopularCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/categories", { cache: "no-store" });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || "Failed to load categories");
        }

        const apiCategories = json.data || [];
        
        // Map API response to component format
        const formatted: Category[] = apiCategories.map((cat: APICategory) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon || null,
        }));

        setCategories(formatted);
      } catch (err) {
        console.error("PopularCategories fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="pb-16">
      <div className="w-11/12 mx-auto">

        {/* GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">

          {/* LOADING */}
          {loading &&
            Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-full border border-gray-200 bg-white rounded-xl p-3 animate-pulse"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg" />
                <div className="mt-3 h-5 bg-gray-200 rounded-md" />
              </div>
            ))}

          {/* ERROR */}
          {error && !loading && (
            <div className="col-span-full text-center text-red-500 py-6">
              {error}
            </div>
          )}

          {/* DATA */}
          {!loading && !error && categories.length > 0 &&
            categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="w-full border border-gray-200 bg-[#b6c1e7] rounded-xl p-2 flex flex-col items-center transition hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="w-full h-24 xl:h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                  {cat.icon ? (
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={120}
                      height={120}
                      className="object-contain"
                      loading="lazy"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Icon</span>
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <p className="mt-3 w-full text-center bg-gray-100 rounded-lg px-2 py-2 xl:text-sm text-[9px] font-semibold text-gray-800">
                  {cat.name}
                </p>
              </Link>
            ))}

          {/* EMPTY STATE */}
          {!loading && !error && categories.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-6">
              No categories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
