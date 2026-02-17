"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { Range } from "react-range";
import { FiFilter } from "react-icons/fi";
import CategoryPageSkeleton from "@/components/Skeletons/CategoryPageSkeleton";

type ProductType = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  reviews: string;
  image: string;
  featured_specs?: { text: string; icon: string }[];
  current_stock: number;
  product_compatible?: string[];
};

const CategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const category = params.category;
  const searchParams = useSearchParams();
  
  const searchQuery = typeof category === "string" && category === "search"
    ? searchParams.get("q") || ""
    : "";
  const isSearchMode = category === "search";
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [subtitle, setSubtitle] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const MIN = 0;
  const MAX = 12000;
  
  // Get initial values from URL
  const [minPrice, setMinPrice] = useState(() => {
    const min = searchParams.get("min");
    return min ? Number(min) : MIN;
  });
  const [maxPrice, setMaxPrice] = useState(() => {
    const max = searchParams.get("max");
    return max ? Number(max) : MAX;
  });
  const [sortOption, setSortOption] = useState(() => {
    return searchParams.get("sort") || "default";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? Number(page) : 1;
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  type AvailabilityStatus = "inStock" | "outOfStock" | "preOrder" | "upcoming" | null;
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus>(() => {
    return (searchParams.get("availability") as AvailabilityStatus) || null;
  });

  type DeviceType = "I Phone" | "Oppo" | "Samsung" | "Redmi";
  const [deviceFilters, setDeviceFilters] = useState<DeviceType[]>(() => {
    const devices = searchParams.get("devices");
    return devices ? (devices.split(",") as DeviceType[]) : [];
  });

  // Color filters
  const [colorFilters, setColorFilters] = useState<string[]>(() => {
    const colors = searchParams.get("colors");
    return colors ? colors.split(",") : [];
  });

  // Choice options filters (Storage, Region, etc.)
  const [choiceOptionFilters, setChoiceOptionFilters] = useState<Record<string, string[]>>(() => {
    const choiceOptions = searchParams.get("choice_options");
    if (!choiceOptions) return {};
    
    const filters: Record<string, string[]> = {};
    choiceOptions.split("|").forEach((filter) => {
      const [key, values] = filter.split(":");
      if (key && values) {
        filters[key] = values.split(",");
      }
    });
    return filters;
  });

  // Available colors and choice options from products
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableChoiceOptions, setAvailableChoiceOptions] = useState<Record<string, string[]>>({});

  // Update URL with current filters - FIXED to preserve search query
  const updateURL = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always preserve the search query in search mode
    if (isSearchMode && searchQuery && !params.has("q")) {
      params.set("q", searchQuery);
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "default") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [searchParams, router, isSearchMode, searchQuery]);

  const isFirstLoad = useRef(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (isFirstLoad.current) {
        setLoading(true);
        isFirstLoad.current = false;
      } else {
        setIsFilterLoading(true);
      }
      
      try {
        let url: string;
        const params = new URLSearchParams();

        if (isSearchMode) {
          // Search mode - use search endpoint
          url = "/api/products/search";
          if (searchQuery) params.set("name", searchQuery);
        } else if (typeof category === "string" && category === "all") {
          // All products mode
          url = "/api/products/all";
        } else {
          // Category mode - use category endpoint
          const categorySlug = typeof category === "string" ? category : "";
          url = `/api/products/category/${categorySlug}`;
        }

        // Add filters to API call (for both search and category)
        if (minPrice > MIN) params.set("min", String(minPrice));
        if (maxPrice < MAX) params.set("max", String(maxPrice));
        
        // Add color filters
        if (colorFilters.length > 0) {
          params.set("colors", colorFilters.join(","));
        }
        
        // Add choice option filters
        const choiceOptionParams: string[] = [];
        Object.keys(choiceOptionFilters).forEach((key) => {
          if (choiceOptionFilters[key].length > 0) {
            choiceOptionParams.push(`${key}:${choiceOptionFilters[key].join(",")}`);
          }
        });
        if (choiceOptionParams.length > 0) {
          params.set("choice_options", choiceOptionParams.join("|"));
        }
        
        // Map sort option to backend key
        if (sortOption === "price-low-high") {
          params.set("sort_key", "price_low_to_high");
        } else if (sortOption === "price-high-low") {
          params.set("sort_key", "price_high_to_low");
        }
        
        // Add page
        params.set("page", String(currentPage));
        params.set("per_page", "20");

        const fullUrl = `${url}?${params.toString()}`;
        const res = await fetch(fullUrl);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to fetch products");
        }

        // Transform API products to match ProductType format
        const apiProducts = json.data || [];
        interface ApiProduct {
          id: string | number;
          name: string;
          slug: string;
          main_price: number;
          stroked_price?: number;
          discount?: number;
          rating?: number;
          rating_count?: number;
          thumbnail_image?: string;
          current_stock?: number;
          product_compatible?: string[];
          featured_specs?: { text: string; icon: string }[];
          colors?: string[];
          choice_options?: Array<{ title: string; options: string[] }>;
        }
        const transformedProducts: ProductType[] = apiProducts.map((p: ApiProduct) => ({
          id: parseInt(String(p.id)) || 0,
          name: p.name || "",
          slug: p.slug || "",
          price: p.main_price || 0,
          oldPrice: p.stroked_price || p.main_price || 0,
          discount: p.discount ? `${p.discount}%` : "0%",
          rating: p.rating?.toString() || "0",
          reviews: p.rating_count?.toString() || "0",
          image: p.thumbnail_image || "",
          current_stock: p.current_stock || 0,
          product_compatible: p.product_compatible || [],
          featured_specs: p.featured_specs || []
        }));

        setProducts(transformedProducts);
        setSubtitle(json.subtitle || "");
        setTotalProducts(json.meta?.total || transformedProducts.length);
        setTotalPages(json.meta?.last_page || json.meta?.total_pages || 1);

        // Extract available colors and choice options from fetched products
        // Note: We extract from all products in the category for better filter options
        // In a production app, you might want a separate endpoint for available attributes
        if (!isSearchMode && typeof category === "string" && isFirstLoad.current) {
          try {
            // Fetch all products without filters to get all available attributes
            const fetchUrl = category === "all" 
              ? `/api/products/all?per_page=1000`
              : `/api/products/category/${category}?per_page=1000`;
            const allProductsRes = await fetch(fetchUrl);
            const allProductsJson = await allProductsRes.json();
            
            const colorsSet = new Set<string>();
            const choiceOptionsMap: Record<string, Set<string>> = {};
            
            if (allProductsJson.success && allProductsJson.data) {
              allProductsJson.data.forEach((p: ApiProduct) => {
                // Collect colors
                if (p.colors && Array.isArray(p.colors)) {
                  p.colors.forEach((color: string) => {
                    if (color) colorsSet.add(color);
                  });
                }
                // Collect choice options
                if (p.choice_options && Array.isArray(p.choice_options)) {
                  p.choice_options.forEach((option: { title: string; options: string[] }) => {
                    if (option.title && option.options && Array.isArray(option.options)) {
                      if (!choiceOptionsMap[option.title]) {
                        choiceOptionsMap[option.title] = new Set<string>();
                      }
                      option.options.forEach((opt: string) => {
                        if (opt) choiceOptionsMap[option.title].add(opt);
                      });
                    }
                  });
                }
              });
            }
            
            setAvailableColors(Array.from(colorsSet).sort());
            const formattedChoiceOptions: Record<string, string[]> = {};
            Object.keys(choiceOptionsMap).forEach((key) => {
              formattedChoiceOptions[key] = Array.from(choiceOptionsMap[key]).sort();
            });
            setAvailableChoiceOptions(formattedChoiceOptions);
          } catch (err) {
            console.error("Error fetching available attributes:", err);
            // Fallback: extract from current products
            const colorsSet = new Set<string>();
            const choiceOptionsMap: Record<string, Set<string>> = {};
            
            apiProducts.forEach((p: ApiProduct) => {
              if (p.colors && Array.isArray(p.colors)) {
                p.colors.forEach((color: string) => {
                  if (color) colorsSet.add(color);
                });
              }
              if (p.choice_options && Array.isArray(p.choice_options)) {
                p.choice_options.forEach((option: { title: string; options: string[] }) => {
                  if (option.title && option.options && Array.isArray(option.options)) {
                    if (!choiceOptionsMap[option.title]) {
                      choiceOptionsMap[option.title] = new Set<string>();
                    }
                    option.options.forEach((opt: string) => {
                      if (opt) choiceOptionsMap[option.title].add(opt);
                    });
                  }
                });
              }
            });
            
            setAvailableColors(Array.from(colorsSet).sort());
            const formattedChoiceOptions: Record<string, string[]> = {};
            Object.keys(choiceOptionsMap).forEach((key) => {
              formattedChoiceOptions[key] = Array.from(choiceOptionsMap[key]).sort();
            });
            setAvailableChoiceOptions(formattedChoiceOptions);
          }
        }

        // Set category name from API response or fetch it
        if (!isSearchMode) {
          if (typeof category === "string" && category === "all") {
            setCategoryName("All Products");
          } else if (json.category?.name) {
            setCategoryName(json.category.name);
          } else if (typeof category === "string") {
            // Fallback: fetch category name from categories API
            try {
              const catRes = await fetch("/api/categories");
              const catJson = await catRes.json();
              if (catJson.success && catJson.data) {
                const foundCategory = catJson.data.find((cat: { slug: string; name: string }) => cat.slug === category);
                if (foundCategory) {
                  setCategoryName(foundCategory.name);
                }
              }
            } catch (err) {
              console.error("Error fetching category name:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setSubtitle("");
        setTotalProducts(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
        setIsFilterLoading(false);
      }
    };

    fetchProducts();
  }, [category, isSearchMode, searchQuery, minPrice, maxPrice, sortOption, currentPage, colorFilters, choiceOptionFilters]);

  // Client-side filtering for availability and device (since API doesn't support these)
  const filteredProducts = products.filter((p) => {
    // Availability filter
    if (availabilityFilter) {
      const isInStock = p.current_stock > 0;
      const isOutOfStock = p.current_stock === 0;

      if (availabilityFilter === "inStock" && !isInStock) return false;
      if (availabilityFilter === "outOfStock" && !isOutOfStock) return false;
      if (availabilityFilter === "preOrder") return false;
      if (availabilityFilter === "upcoming") return false;
    }

    // Device compatibility filter
    if (deviceFilters.length > 0) {
      const compatList = p.product_compatible ?? [];
      const matches = deviceFilters.some(device => compatList.includes(device));
      if (!matches) return false;
    }

    return true;
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateURL({ page: page > 1 ? page : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const applyPriceFilter = () => {
    setCurrentPage(1);
    updateURL({ 
      min: minPrice > MIN ? minPrice : null, 
      max: maxPrice < MAX ? maxPrice : null,
      page: null 
    });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
    updateURL({ sort: value !== "default" ? value : null, page: null });
  };

  const toggleDevice = (device: DeviceType) => {
    const newDevices = deviceFilters.includes(device)
      ? deviceFilters.filter(d => d !== device)
      : [...deviceFilters, device];
    
    setDeviceFilters(newDevices);
    setCurrentPage(1);
    updateURL({ 
      devices: newDevices.length > 0 ? newDevices.join(",") : null,
      page: null 
    });
  };

  const toggleAvailability = (key: Exclude<AvailabilityStatus, null>) => {
    const newValue = availabilityFilter === key ? null : key;
    setAvailabilityFilter(newValue);
    setCurrentPage(1);
    updateURL({ availability: newValue, page: null });
  };

  const toggleColor = (color: string) => {
    const newColors = colorFilters.includes(color)
      ? colorFilters.filter(c => c !== color)
      : [...colorFilters, color];
    
    setColorFilters(newColors);
    setCurrentPage(1);
    updateURL({ 
      colors: newColors.length > 0 ? newColors.join(",") : null,
      page: null 
    });
  };

  const toggleChoiceOption = (optionName: string, optionValue: string) => {
    const currentValues = choiceOptionFilters[optionName] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    const newFilters = { ...choiceOptionFilters };
    if (newValues.length > 0) {
      newFilters[optionName] = newValues;
    } else {
      delete newFilters[optionName];
    }
    
    setChoiceOptionFilters(newFilters);
    setCurrentPage(1);
    
    // Build choice_options param
    const choiceOptionParams: string[] = [];
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key].length > 0) {
        choiceOptionParams.push(`${key}:${newFilters[key].join(",")}`);
      }
    });
    
    updateURL({ 
      choice_options: choiceOptionParams.length > 0 ? choiceOptionParams.join("|") : null,
      page: null 
    });
  };

  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      "#9966CC": "Amethyst",
      "#7FFFD4": "Aquamarine",
      "#000000": "Midnight",
      "#FFFFFF": "White",
      "#FF0000": "Red",
      "#0000FF": "Blue",
      "#FFC0CB": "Pink",
      "#FFA500": "Orange",
      "#800080": "Purple",
      "#008000": "Green",
      "#FFFF00": "Yellow",
      "#808080": "Gray",
      "#C0C0C0": "Silver",
      "#FFD700": "Gold",
    };
    const normalizedHex = hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    return colorMap[normalizedHex] || normalizedHex;
  };

  const clearAllFilters = () => {
    setMinPrice(MIN);
    setMaxPrice(MAX);
    setAvailabilityFilter(null);
    setDeviceFilters([]);
    setColorFilters([]);
    setChoiceOptionFilters({});
    setSortOption("default");
    setCurrentPage(1);
    
    const params = new URLSearchParams();
    
    // CRITICAL FIX: Preserve search query when clearing filters
    if (isSearchMode && searchQuery) {
      params.set("q", searchQuery);
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const SidebarContent = (
    <div className="w-full bg-[#f4f4f4] h-full xl:h-auto rounded-md xl:rounded-md shadow p-4 border overflow-y-auto xl:overflow-visible">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#1e40af] text-lg md:text-[22px]">
          Product Filter
        </h2>
        <button
          className="text-[#1e40af] text-xs md:text-[12px] hover:underline"
          onClick={clearAllFilters}
        >
          Clear all
        </button>
      </div>

      {/* Availability */}
      <div className="border-t py-3">
        <h3 className="font-medium text-base md:text-[18px] mb-2">
          Availability
        </h3>
        <div className="space-y-1 text-[#626262] text-sm md:text-[16px]">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-[#1e40af] cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "inStock"}
              onChange={() => toggleAvailability("inStock")}
            />{" "}
            In Stock
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "outOfStock"}
              onChange={() => toggleAvailability("outOfStock")}
            />{" "}
            Out of Stock
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "preOrder"}
              onChange={() => toggleAvailability("preOrder")}
            />{" "}
            Pre-Order
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={availabilityFilter === "upcoming"}
              onChange={() => toggleAvailability("upcoming")}
            />{" "}
            Up Coming
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t py-3">
        <h3 className="font-medium text-base md:text-[18px] mb-2">
          Price Range
        </h3>

        <p className="text-2xl md:text-[24px] my-4 text-center font-medium">
          ৳{minPrice} — ৳{maxPrice}
        </p>

        <Range
          step={100}
          min={MIN}
          max={MAX}
          values={[minPrice, maxPrice]}
          onChange={handlePriceChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-2 rounded-full bg-gray-200 relative"
            >
              <div
                className="absolute h-2 bg-[#1e40af] rounded-full"
                style={{
                  left: `${(minPrice / MAX) * 100}%`,
                  width: `${((maxPrice - minPrice) / MAX) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-4 h-4 bg-white border border-gray-400 rounded-full shadow cursor-pointer"
            />
          )}
        />

        <div className="flex justify-between gap-3 text-xs md:text-sm mt-4">
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3] rounded">
            ৳{minPrice}
          </span>
          <span className="w-1/2 py-2 text-center bg-[#e3e3e3] rounded">
            ৳{maxPrice}
          </span>
        </div>

        <button
          onClick={applyPriceFilter}
          disabled={isFilterLoading}
          className="w-full mt-3 py-2 bg-[#1e40af] text-white rounded-md hover:bg-[#5375e2] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFilterLoading ? "Applying..." : "Apply Price Filter"}
        </button>
      </div>

      {/* Colors Filter */}
      {availableColors.length > 0 && (
        <div className="border-t py-3">
          <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
            Colors
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, index) => {
              const isSelected = colorFilters.includes(color);
              const colorName = getColorName(color);
              return (
                <div key={index} className="relative group">
                  <button
                    onClick={() => toggleColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-md border-2 transition ${
                      isSelected
                        ? "border-gray-800 scale-110 ring-2 ring-orange-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    title={colorName}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {colorName}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Choice Options Filters (Storage, Region, etc.) */}
      {Object.keys(availableChoiceOptions).length > 0 && Object.keys(availableChoiceOptions).map((optionName) => (
        <div key={optionName} className="border-t py-3">
          <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
            {optionName}
          </h3>
          <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
            {availableChoiceOptions[optionName].map((optionValue, index) => {
              const isSelected = choiceOptionFilters[optionName]?.includes(optionValue) || false;
              return (
                <label key={index} className="flex gap-2 items-center cursor-pointer">
                  <input
                    className="accent-orange-500 cursor-pointer"
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleChoiceOption(optionName, optionValue)}
                  />{" "}
                  {optionValue}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Device List */}
      <div className="border-t py-3">
        <h3 className="font-semibold text-black text-base md:text-[18px] mb-2">
          Device List
        </h3>
        <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("I Phone")}
              onChange={() => toggleDevice("I Phone")}
            />{" "}
            I Phone
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Oppo")}
              onChange={() => toggleDevice("Oppo")}
            />{" "}
            Oppo
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Samsung")}
              onChange={() => toggleDevice("Samsung")}
            />{" "}
            Samsung
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              className="accent-orange-500 cursor-pointer"
              type="checkbox"
              checked={deviceFilters.includes("Redmi")}
              onChange={() => toggleDevice("Redmi")}
            />{" "}
            Redmi
          </label>
        </div>
      </div>

      {/* Best Selling */}
      {isSearchMode && (
        <div className="border-t py-3">
          <h3 className="font-medium text-base md:text-[18px] mb-2">
            Best Selling
          </h3>
          <div className="space-y-1 text-sm md:text-[16px] text-[#626262]">
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Power Bank
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Phone Charger
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Adapter
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input className="accent-orange-500 cursor-pointer" type="checkbox" /> Cover
            </label>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-11/12 pt-6 md:pt-10 pb-[56px] mx-auto">
      {/* Display category name or search query */}
      {isSearchMode && searchQuery ? (
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          Search results for &quot;{searchQuery}&quot;
        </h1>
      ) : categoryName ? (
        <h1 className="text-xl md:text-2xl font-semibold mb-2">
          {categoryName}
        </h1>
      ) : null}
      
      {subtitle && (
        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
          {subtitle}
        </p>
      )}

      {loading ? (
        <CategoryPageSkeleton />
      ) : (
        <>
          {/* Mobile Filter + Sort Bar */}
          <div className="flex xl:hidden items-center justify-between bg-[#f4f4f4] rounded-xl p-3 mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-[#626262]"
            >
              <FiFilter className="text-lg" />
              <span>Filter</span>
            </button>

            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border px-2 py-2 text-xs text-[#626262] rounded-md bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="a-z">A-Z</option>
            </select>
          </div>

          {/* Mobile Filter Drawer */}
          <div
            className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${
              isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsFilterOpen(false)}
          />

          <div
            className={`fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 xl:hidden flex flex-col transform transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-base">Filters</span>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">{SidebarContent}</div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-4">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden xl:block xl:w-[340px] 2xl:w-[355px]">
              {SidebarContent}
            </div>

            {/* Products List */}
            <div className="w-full xl:flex-1 2xl:w-[1368px]">
              {/* Desktop Sort Bar */}
              <div className="hidden xl:flex justify-between rounded-xl bg-[#f4f4f4] p-4 mb-6 items-center">
                <div className="text-[16px] text-[#626262] font-medium">
                  Showing {filteredProducts.length} out of {totalProducts} Products
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border px-2 py-2 text-[#626262] rounded-md text-sm"
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="a-z">A-Z</option>
                </select>
              </div>

              {/* Mobile product count */}
              <div className="xl:hidden mb-3 text-xs text-[#626262]">
                Showing {filteredProducts.length} out of {totalProducts} Products
              </div>

              {/* Products Grid with Loading Overlay */}
              <div className="relative">
                {isFilterLoading && (
                  <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">Filtering...</span>
                    </div>
                  </div>
                )}
                <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 && !isFilterLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 md:mt-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      &lt; Back
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                            currentPage === page
                              ? "bg-black text-white border-black"
                              : "hover:bg-gray-100 border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 border rounded-md text-xs md:text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
