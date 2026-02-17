"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductSearch from "./ProductSearch";
import AlignedSpecifications from "./AlignedSpecifications";
import { FaClock, FaPiggyBank, FaAward } from "react-icons/fa";

interface Product {
  id?: number | string;
  slug?: string;
  name: string;
  brand?: {
    name: string;
  };
  thumbnail_image?: string;
  photos?: Array<{ path: string }>;
  other_features?: string;
  warranty?: {
    text?: string;
    logo?: string;
  } | string;
  basic_specs?: {
    display?: string;
    processor?: string;
    battery?: string;
    camera?: string;
    others?: string;
  } | null;
  specifications?: Array<{
    title: string;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  }>;
  seo?: {
    slug?: string;
  };
  main_price?: string | number;
  stroked_price?: string | number;
  discount?: string;
}

const ComparePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const initializedRef = useRef(false);

  // Check URL params for initial products, or load from localStorage
  useEffect(() => {
    if (initializedRef.current) return;
    
    const slug1 = searchParams.get("product1");
    const slug2 = searchParams.get("product2");

    // If URL params exist, use them (skip if undefined)
    if ((slug1 && slug1 !== "undefined") || (slug2 && slug2 !== "undefined")) {
      initializedRef.current = true;
      if (slug1 && slug1 !== "undefined") {
        loadProduct(slug1, 1);
        // Update localStorage
        const stored = localStorage.getItem("compareProducts");
        let compareProducts: string[] = stored ? JSON.parse(stored) : [];
        if (!compareProducts.includes(slug1)) {
          compareProducts.push(slug1);
          if (compareProducts.length > 2) compareProducts = compareProducts.slice(-2);
          localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
        }
      }
      if (slug2 && slug2 !== "undefined") {
        loadProduct(slug2, 2);
        // Update localStorage
        const stored = localStorage.getItem("compareProducts");
        let compareProducts: string[] = stored ? JSON.parse(stored) : [];
        if (!compareProducts.includes(slug2)) {
          compareProducts.push(slug2);
          if (compareProducts.length > 2) compareProducts = compareProducts.slice(-2);
          localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
        }
      }
    } else {
      // If no URL params, check localStorage
      const stored = localStorage.getItem("compareProducts");
      if (stored) {
        try {
          const compareProducts: string[] = JSON.parse(stored);
          if (compareProducts.length > 0) {
            initializedRef.current = true;
            if (compareProducts[0]) loadProduct(compareProducts[0], 1);
            if (compareProducts[1]) loadProduct(compareProducts[1], 2);
            
            // Update URL to match localStorage
            const params = new URLSearchParams();
            if (compareProducts[0]) params.set("product1", compareProducts[0]);
            if (compareProducts[1]) params.set("product2", compareProducts[1]);
            if (params.toString()) {
              router.replace(`/compare?${params.toString()}`);
            }
          }
        } catch (e) {
          console.error("Error parsing localStorage:", e);
        }
      }
    }
  }, [searchParams, router]);

  const loadProduct = async (slug: string, position: 1 | 2): Promise<Product | null> => {
    if (!slug || slug === "undefined") {
      console.error("Invalid slug:", slug);
      return null;
    }
    
    if (position === 1) {
      setLoading1(true);
    } else {
      setLoading2(true);
    }

    try {
      const res = await fetch(`/api/products/${slug}`);
      const json = await res.json();

      if (json.success && json.data) {
        const product = json.data as Product;
        
        if (position === 1) {
          setProduct1(product);
        } else {
          setProduct2(product);
        }
        
        return product;
      } else {
        console.error("Failed to load product:", json.error || "Unknown error");
        if (position === 1) {
          setProduct1(null);
        } else {
          setProduct2(null);
        }
        return null;
      }
    } catch (error) {
      console.error("Error loading product:", error);
      if (position === 1) {
        setProduct1(null);
      } else {
        setProduct2(null);
      }
      return null;
    } finally {
      if (position === 1) {
        setLoading1(false);
      } else {
        setLoading2(false);
      }
    }
  };

  const handleProductSelect = async (product: Product, position: 1 | 2) => {
    // Get slug from product.slug, product.seo.slug, or use the slug from search
    const productSlug = product.slug || product.seo?.slug || "";
    
    if (!productSlug) {
      console.error("No slug found for product:", product);
      return;
    }
    
    // If product doesn't have specifications, fetch full data
    if (!product.specifications) {
      const fullProduct = await loadProduct(productSlug, position);
      if (!fullProduct) return;
      product = fullProduct;
    }
    
    // Update localStorage
    const stored = localStorage.getItem("compareProducts");
    let compareProducts: string[] = stored ? JSON.parse(stored) : [];
    
    // Remove product from any existing position
    compareProducts = compareProducts.filter((slug) => slug !== productSlug);
    
    // Add product to the correct position
    if (position === 1) {
      compareProducts = [productSlug, ...compareProducts.filter((slug) => slug !== productSlug)].slice(0, 2);
    } else {
      compareProducts = [...compareProducts.filter((slug) => slug !== productSlug), productSlug].slice(-2);
    }
    
    localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
    
    // Dispatch custom event to update floating compare button
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("compareUpdated"));
    }
    
    // Get final slug for URL (use product.slug or seo.slug)
    const finalSlug = product.slug || product.seo?.slug || productSlug;
    
    if (position === 1) {
      setProduct1(product);
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set("product1", finalSlug);
      if (product2) {
        const product2Slug = product2.slug || product2.seo?.slug || "";
        if (product2Slug) params.set("product2", product2Slug);
      }
      router.push(`/compare?${params.toString()}`);
    } else {
      setProduct2(product);
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (product1) {
        const product1Slug = product1.slug || product1.seo?.slug || "";
        if (product1Slug) params.set("product1", product1Slug);
      }
      params.set("product2", finalSlug);
      router.push(`/compare?${params.toString()}`);
    }
  };

  const handleRemoveProduct = (position: 1 | 2) => {
    // Update localStorage
    const stored = localStorage.getItem("compareProducts");
    let compareProducts: string[] = stored ? JSON.parse(stored) : [];
    
    if (position === 1) {
      const slug = product1?.slug || product1?.seo?.slug;
      if (slug) {
        compareProducts = compareProducts.filter((s) => s !== slug);
        localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
        // Dispatch custom event to update floating compare button
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("compareUpdated"));
        }
      }
      setProduct1(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("product1");
      router.push(`/compare?${params.toString()}`);
    } else {
      const slug = product2?.slug || product2?.seo?.slug;
      if (slug) {
        compareProducts = compareProducts.filter((s) => s !== slug);
        localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
        // Dispatch custom event to update floating compare button
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("compareUpdated"));
        }
      }
      setProduct2(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("product2");
      router.push(`/compare?${params.toString()}`);
    }
  };

  const getProductImage = (product: Product | null): string => {
    if (!product) return "";
    return (
      product.photos?.[0]?.path ||
      product.thumbnail_image ||
      "/images/placeholder.png"
    );
  };

  const getWarranty = (product: Product | null): string => {
    if (!product) return "";
    
    // Handle warranty as object
    if (product.warranty && typeof product.warranty === "object") {
      return product.warranty.text || "";
    }
    
    // Handle warranty as string
    if (product.warranty && typeof product.warranty === "string") {
      return product.warranty;
    }
    
    return "";
  };

  const getOtherFeatures = (product: Product | null): string => {
    if (!product) return "";
    return product.other_features || "";
  };

  // Parse price string to number
  const parsePrice = (priceStr: string | number | undefined): number => {
    if (!priceStr) return 0;
    if (typeof priceStr === "number") return priceStr;
    const cleaned = String(priceStr).replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Calculate discount percentage
  const calculateDiscount = (price: number, oldPrice: number): number => {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // Get product prices
  const getProductPrices = (product: Product | null) => {
    if (!product) return { price: 0, oldPrice: 0, discount: 0 };
    const price = parsePrice(product.main_price);
    const oldPrice = parsePrice(product.stroked_price);
    const discount = calculateDiscount(price, oldPrice);
    return { price, oldPrice, discount };
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="w-11/12 mx-auto max-w-7xl ">
        {/* Feature Cards Section */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {/* Save Time Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-start">
              <div className="mb-4">
                <FaClock className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Save Time</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Compare products quickly and make informed decisions without wasting hours.
              </p>
            </div>
          </div>

          {/* Save Money Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-start">
              <div className="mb-4">
                <FaPiggyBank className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Find the best deals and get the most value out of every purchase.
              </p>
            </div>
          </div>

          {/* Best Choices Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-start">
              <div className="mb-4">
                <FaAward className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Best Choices</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access trusted reviews, ratings, and product info to make confident choices.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Compare Products</h1>

        <div className="grid grid-cols-3 gap-0">
          {/* Empty Left Column - Aligns with attribute names column */}
          <div className="bg-white border-r border-gray-200 p-2 sm:p-4 lg:p-6">
            {/* Empty column for alignment */}
          </div>

          {/* Product 1 Column - Middle */}
          <div className="bg-white border-r border-gray-200 p-2 sm:p-4 lg:p-6 flex flex-col">
            <ProductSearch
              onProductSelect={(product) => handleProductSelect(product, 1)}
              placeholder="Search and select first product..."
              loading={loading1}
            />

            {product1 ? (
              <div className="mt-3 sm:mt-4 lg:mt-6 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                  <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64">
                    <Image
                      src={getProductImage(product1)}
                      alt={product1.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Product Name and Remove Button */}
                <div className="flex flex-col items-center mb-2 sm:mb-3 lg:mb-4">
                  <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-xl font-semibold text-gray-900 text-center mb-1 sm:mb-2 min-h-[2.5em] sm:min-h-[3em] lg:min-h-0 flex items-center justify-center line-clamp-2">
                    {product1.name}
                  </h2>
                  <button
                    onClick={() => handleRemoveProduct(1)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-red-500 text-white text-[9px] sm:text-xs lg:text-sm font-medium rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>

                {/* Price Information */}
                {(() => {
                  const { price, oldPrice, discount } = getProductPrices(product1);
                  return (
                    <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                      {/* Current Price */}
                      <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-blue-700">
                        ৳{price.toLocaleString()}
                      </span>
                      
                      {/* Discount Badge and Original Price */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <span className="bg-green-100 text-green-700 font-bold text-[8px] sm:text-[10px] lg:text-sm px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 rounded">
                            {discount}% OFF
                          </span>
                        )}
                        
                        {/* Original Price */}
                        {oldPrice > price && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs lg:text-lg">
                            ৳{oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="mt-3 sm:mt-4 lg:mt-6 flex items-center justify-center h-20 sm:h-32 md:h-48 lg:h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm text-center">No product selected</p>
              </div>
            )}
          </div>

          {/* Product 2 Column - Right */}
          <div className="bg-white p-2 sm:p-4 lg:p-6 flex flex-col">
            <ProductSearch
              onProductSelect={(product) => handleProductSelect(product, 2)}
              placeholder="Search and select second product..."
              loading={loading2}
            />

            {product2 ? (
              <div className="mt-3 sm:mt-4 lg:mt-6 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                  <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64">
                    <Image
                      src={getProductImage(product2)}
                      alt={product2.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Product Name and Remove Button */}
                <div className="flex flex-col items-center mb-2 sm:mb-3 lg:mb-4">
                  <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-xl font-semibold text-gray-900 text-center mb-1 sm:mb-2 min-h-[2.5em] sm:min-h-[3em] lg:min-h-0 flex items-center justify-center line-clamp-2">
                    {product2.name}
                  </h2>
                  <button
                    onClick={() => handleRemoveProduct(2)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-red-500 text-white text-[9px] sm:text-xs lg:text-sm font-medium rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>

                {/* Price Information */}
                {(() => {
                  const { price, oldPrice, discount } = getProductPrices(product2);
                  return (
                    <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                      {/* Current Price */}
                      <span className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-orange-500">
                        ৳{price.toLocaleString()}
                      </span>
                      
                      {/* Discount Badge and Original Price */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <span className="bg-green-100 text-green-700 font-bold text-[8px] sm:text-[10px] lg:text-sm px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 rounded">
                            {discount}% OFF
                          </span>
                        )}
                        
                        {/* Original Price */}
                        {oldPrice > price && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs lg:text-lg">
                            ৳{oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Brand */}
               

                {/* Short Description */}
                
              </div>
            ) : (
              <div className="mt-3 sm:mt-4 lg:mt-6 flex items-center justify-center h-20 sm:h-32 md:h-48 lg:h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm text-center">No product selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Aligned Specifications Table - Spans both columns */}
        {(product1 || product2) && (
          <div className="bg-white border-t border-gray-200 overflow-x-auto">
            <AlignedSpecifications 
              product1={product1} 
              product2={product2}
              brand1={product1?.brand?.name || ""}
              brand2={product2?.brand?.name || ""}
              shortDescription1={getOtherFeatures(product1)}
              shortDescription2={getOtherFeatures(product2)}
              warranty1={getWarranty(product1)}
              warranty2={getWarranty(product2)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
