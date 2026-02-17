"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface Product {
  id?: number | string;
  slug: string;
  name: string;
  thumbnail_image?: string;
  image?: string;
  main_price?: string | number;
  price?: number;
  seo?: {
    slug?: string;
  };
}

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  loading?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onProductSelect,
  placeholder = "Search for products...",
  loading = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=10`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      
      const json = await res.json();
      
      if (json.success && json.data) {
        // Map the API response to Product format
        const products: Product[] = json.data.map((item: {
          name: string;
          slug: string;
          image?: string;
          thumbnail_image?: string;
          price?: number;
        }) => ({
          id: item.slug, // Use slug as ID
          slug: item.slug,
          name: item.name,
          thumbnail_image: item.thumbnail_image || item.image || "",
          image: item.image || item.thumbnail_image || "",
          main_price: item.price || null,
          price: item.price || null,
        }));
        
        setResults(products);
        setShowResults(products.length > 0);
      } else {
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query, performSearch]);

  const handleSelectProduct = async (product: Product) => {
    // Fetch full product data using the slug
    if (product.slug) {
      try {
        const res = await fetch(`/api/products/${product.slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // Use the full product data from API
            onProductSelect(json.data);
            setQuery("");
            setShowResults(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching full product:", error);
      }
    }
    
    // Fallback: use the basic product data from search results
    onProductSelect(product);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center bg-gray-100 border border-gray-300 rounded-full overflow-visible">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder || "Search your favorite accessories"}
          className="flex-1 min-w-0 px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none text-[9px] sm:text-[10px] md:text-xs lg:text-base"
          disabled={loading}
        />
        {isSearching ? (
          <div className="mr-0.5 sm:mr-1 md:mr-1.5 lg:mr-2 flex-shrink-0">
            <div className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (query.trim().length >= 2) {
                performSearch();
              }
            }}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors mr-0.5 sm:mr-0.5 md:mr-1 lg:mr-1 flex-shrink-0 z-10"
            aria-label="Search"
          >
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((product, index) => (
            <button
              key={product.slug || product.id || index}
              onClick={() => handleSelectProduct(product)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left border-b last:border-b-0"
            >
              {(product.thumbnail_image || product.image) && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.thumbnail_image || product.image || ""}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                {(product.main_price || product.price) && (
                  <p className="text-xs text-gray-500">
                    ৳{typeof (product.main_price || product.price) === "string"
                      ? (product.main_price || product.price)
                      : (product.main_price || product.price)?.toLocaleString()}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Show message when searching */}
      {isSearching && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">Searching...</p>
        </div>
      )}
      
      {/* Show message when no results */}
      {!isSearching && query.trim().length >= 2 && results.length === 0 && showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;

