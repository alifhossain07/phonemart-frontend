"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";

// ----- Product Interface -----
interface Spec {
  text: string;
  icon: string;
}

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
  featured_specs?: Spec[];
}

const FeatureProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----- Detect screen size -----
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch featured products from API
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/products/featured?page=1&per_page=20", { 
          cache: "no-store" 
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch featured products: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error || "Failed to load featured products");
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
        console.error("FeatureProducts fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load featured products");
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  // ----- Pagination logic -----
  const PRODUCTS_PER_PAGE = isMobile ? 6 : 5;
  const MAX_DESKTOP_PRODUCTS = 10;
  const paginatedProducts = isMobile
    ? products.slice(0, PRODUCTS_PER_PAGE)
    : products.slice(0, MAX_DESKTOP_PRODUCTS);

  // ----- Skeleton Card -----
  const SkeletonCard: React.FC = () => (
    <div className="relative w-full max-w-[320px] rounded-lg shadow-md border border-gray-200 p-0 animate-pulse flex flex-col justify-between">
      <div className="relative flex items-center justify-center bg-gray-100 md:p-14 p-8 rounded-md">
        <div className="md:w-[100px] w-[40px] h-[100px] md:h-[100px] bg-gray-300 rounded"></div>
      </div>
      <div className="p-3 space-y-3">
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-2/4 bg-gray-300 rounded"></div>
        <div className="flex gap-2 mt-3">
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-1/2 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-11/12 mx-auto mb-[56px] pt-4 pb-4 p-2 sm:bg-transparent bg-orange-100 rounded-xl sm:rounded-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        {/* Mobile Header */}
        <div className="flex items-center sm:hidden w-full justify-between">
          <h1 className="text-2xl w-1/2 font-medium">Recommended For You</h1>
          <button className="bg-[#EB6420] text-white px-4 text-[12px] py-2 rounded-xl">
            See More
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex flex-col items-center w-full">
          <h1 className="text-4xl font-medium">Recommended For You</h1>
          <p className="text-gray-600 text-lg mt-2">
            Discover Our Latest Arrivals Designed to Inspire and Impress
          </p>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="text-center text-red-500 py-6">
          {error}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center">
        {loading
          ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : paginatedProducts.length > 0
          ? paginatedProducts.map((p) => <ProductCard key={p.id} product={p} />)
          : !loading && (
              <div className="col-span-full text-center text-gray-500 py-6">
                No featured products found
              </div>
            )}
      </div>

      {/* See More button - desktop only */}
      {!loading && !isMobile && products.length > MAX_DESKTOP_PRODUCTS && (
        <div className="flex justify-center mt-6">
          <button className="bg-[#EB6420] text-white px-6 py-3 rounded-xl hover:bg-gray-200 hover:text-black transition duration-300">
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default FeatureProducts;
