"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

interface APIProduct {
  id: string;
  name: string;
  slug: string;
  main_price: number;
  stroked_price: number | null;
  discount: number;
  rating: number;
  rating_count: number;
  thumbnail_image: string | null;
  current_stock: number;
  featured: boolean;
  published: boolean;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string | number;
  rating: number | string;
  reviews: number | string;
  image: string;
  slug: string;
}

const NewArrival = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const PRODUCTS_PER_PAGE = isMobile ? 6 : 6;

  // Fetch new arrivals from API
  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/products/new-arrivals?page=1&per_page=20", { 
          cache: "no-store" 
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch new arrivals: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || "Failed to load new arrivals");
        }

        const apiProducts: APIProduct[] = json.data || [];
        
        // Map API response to component format
        const formatted: Product[] = apiProducts.map((p: APIProduct) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.main_price,
          oldPrice: p.stroked_price || p.main_price,
          discount: p.discount > 0 ? `${p.discount}%` : "0%",
          rating: p.rating || 0,
          reviews: p.rating_count || 0,
          image: p.thumbnail_image || "/images/placeholder.png",
        }));

        setProducts(formatted);
      } catch (err) {
        console.error("NewArrival fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load new arrivals");
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="w-11/12 mx-auto mb-[56px] pb-4 pt-4 p-2 sm:bg-transparent bg-orange-100 rounded-xl sm:rounded-none">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">
        {/* Mobile Header */}
        <div className="flex items-center sm:hidden w-full justify-between">
          <h1 className="text-2xl font-medium">New Arrival</h1>
          <Link 
            href="/newarrival"
            className="bg-[#EB6420] text-white px-4 text-[12px] py-2 rounded-xl"
          >
            See More
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col items-center w-full">
          <h1 className="text-4xl font-medium">New Arrival Products</h1>
          <p className="text-gray-600 text-lg mt-2">Discover our latest arrivals</p>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="text-center text-red-500 py-6">
          {error}
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="w-full h-60 bg-gray-200 animate-pulse rounded-xl"
              />
            ))
          : paginatedProducts.length > 0
          ? paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          : !loading && (
              <div className="col-span-full text-center text-gray-500 py-6">
                No new arrivals found
              </div>
            )}
      </div>

      {/* Pagination - desktop only */}
      {!loading && !isMobile && products.length > PRODUCTS_PER_PAGE && (
        <div className="hidden sm:flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                page === i + 1 ? "bg-[#1e40af] text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
