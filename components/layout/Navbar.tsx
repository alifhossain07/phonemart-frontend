"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiGift,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import MarqueeSlider from "./MarqueeSlider";

// ------------------ TYPES ------------------
// type Subcategory = {
//   name: string;
//   children: string[];
// };

// type NavbarCategoryAPI = {
//   id: number;
//   name: string;
//   slug: string;
//   banner?: string;
// };

type APICategory = {
  id: string | number;
  name: string;
  slug: string;
  banner?: string | null;
  cover_image?: string | null;
  icon?: string | null;
  children?: APICategory[];
};

type SuggestionItem = {
  name?: string;
  title?: string;
  query?: string;
  slug?: string;
  image?: string | null;
  thumbnail?: string | null;
  cover_image?: string | null;
  thumbnail_image?: string | null;
  photo?: string | null;
  photos?: Array<{ path?: string }>;
  price?: number | string | null;
  sale_price?: number | string | null;
  offer_price?: number | string | null;
  main_price?: number | string | null;
  stroked_price?: number | string | null;
  meta?: {
    price?: number | string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type Category = {
  id: string | number;
  name: string;
  slug: string;
};

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const { cart, setCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  // let suggestTimeout: NodeJS.Timeout;
  const suggestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDesktopLogout, setShowDesktopLogout] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const handleCloseMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMenuOpen(false);
    }, 300);
  };

  // ✅ CATEGORIES FROM EXPRESS BACKEND
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ SIMPLE LINKS (NOT CATEGORIES)
  const simplePages = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Authentication", href: "/login" },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        
        if (!res.ok) {
          console.error("Categories API error:", res.status, res.statusText);
          return;
        }

        const json = await res.json();
        const apiCategories = json.data || [];

        const formatted: Category[] = apiCategories.map((cat: APICategory) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        }));

        setCategories(formatted);
      } catch (error) {
        console.error("Navbar category error:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleSearchSubmit = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return;
  // Close suggestions and clear search
  setShowSuggestions(false);
  setSuggestions([]);
 
  setShowMobileSearch(false);
  // Navigate to search page
  router.push(`/products/search?q=${encodeURIComponent(trimmed)}`);
};

  // Fetch logo from business settings
  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch("/api/business-settings", { cache: "no-store" });
        if (!res.ok) {
          console.error("Business settings API error:", res.status, res.statusText);
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          // Data is already an object format from the API route
          const headerLogo = json.data.header_logo;
          if (headerLogo) {
            setLogoUrl(headerLogo);
          }
        }
      } catch (error) {
        console.error("Navbar logo fetch error:", error);
      }
    }
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowDesktopLogout(false);
      }
      // Add desktop search suggestions close logic
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        showMobileSearch &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    toast.success("Successfully logged out");
  };


  return (
    <>
      {/* ========= HEADER ========= */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        {/* MARQUEE ANNOUNCEMENT BAR */}
        <div className="hidden md:block">
          <MarqueeSlider />
        </div>

        {/* MIDDLE LOGO + SEARCH */}
        <div className="w-11/12 mx-auto py-1 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex justify-between w-full md:w-full lg:w-auto items-center">
            <button className="text-2xl text-orange-500 lg:hidden" onClick={() => setMenuOpen(true)}>
              <FiMenu />
            </button>
            <Link href="/">
              <Image
                src={logoUrl || ""}
                width={120}
                height={120}
                alt="Logo"
                className="xl:w-[110px] py-1 xl:h-[94px] w-32 h-16 "
              />
            </Link>

            <div className="flex lg:hidden items-center text-orange-500 gap-4">
              {/* SEARCH ICON */}
              <button onClick={() => setShowMobileSearch(!showMobileSearch)}>
                <IoSearch className="text-2xl" />
              </button>

             {/* CART ICON */}
<button onClick={() => setCartOpen(true)} className="relative">
  <IoCartOutline className="text-2xl" />
  {cart.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] leading-none px-1 py-1 rounded-full border border-white">
      {cart.length.toString().padStart(2, "0")}
    </span>
  )}
</button>
            </div>


          </div>


          {/* DESKTOP BUTTONS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* SEARCH */}
            <div ref={desktopSearchRef} className="relative w-full md:w-96 xl:w-[260px] 2xl:w-[550px] mr-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (suggestTimeoutRef.current) {
                    clearTimeout(suggestTimeoutRef.current);
                  }

                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    return;
                  }

                  if (!value.trim()) {
                    setSuggestions([]);
                    setShowSuggestions(false);
                    setIsSuggestLoading(false);
                    return;
                  }

                  setIsSuggestLoading(true);
                  suggestTimeoutRef.current = setTimeout(async () => {
                    try {
                      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}&limit=8`);
                      if (!res.ok) {
                        throw new Error("Failed to fetch suggestions");
                      }
                      const json = await res.json();
                      const items: SuggestionItem[] = (json.data || []).map((item: { name: string; slug: string; image?: string; thumbnail_image?: string; price?: number; type?: string }) => ({
                        name: item.name,
                        slug: item.slug,
                        image: item.image || item.thumbnail_image || "",
                        price: item.price || null,
                        type: item.type || "product"
                      }));
                      setSuggestions(items);
                      setShowSuggestions(items.length > 0);
                    } catch (err) {
                      console.error("Desktop suggestion fetch error:", err);
                      setSuggestions([]);
                      setShowSuggestions(false);
                    } finally {
                      setIsSuggestLoading(false);
                    }
                  }, 300);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(searchTerm);
                  }
                }}
                placeholder="Search your Favourite Accessories."
                className="w-full text-white bg-black border border-black rounded-xl py-2 px-4"
              />
              <div className="absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center gap-2">
                {isSuggestLoading && (
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <button
                  type="button"
                  onClick={() => handleSearchSubmit(searchTerm)}
                  className="bg-white text-black p-2 rounded-md"
                >
                  <FiSearch />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                  {suggestions.map((item: SuggestionItem, idx: number) => {
                    const label = item.name || item.title || item.query || "";
                    const slug = item.slug;
                    const image = 
                      item.image || 
                      item.thumbnail || 
                      item.cover_image || 
                      item.thumbnail_image ||
                      item.photo ||
                      item.photos?.[0]?.path ||
                      null;
                    const price =
                      item.price ||
                      item.sale_price ||
                      item.offer_price ||
                      item.main_price ||
                      item.stroked_price ||
                      (item.meta && item.meta.price) ||
                      null;

                    const isCategory = item.type === 'category';
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setShowSuggestions(false);
                          setSuggestions([]);
                          setSearchTerm("");
                          
                          if (isCategory && slug) {
                            router.push(`/products/${slug}`);
                          } else if (slug && !isCategory) {
                            router.push(`/products/${slug}`);
                          } else {
                            handleSearchSubmit(label);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="flex-1 flex flex-col items-start min-w-0">
                          <span className="text-gray-800 line-clamp-1 font-medium">{label}</span>
                          {price !== null && price !== undefined && price !== "" && typeof price === 'number' && (
                            <span className="text-xs text-orange-600 font-semibold mt-0.5">
                              ৳{price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {image && image !== "" && (
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                            <Image
                              src={image}
                              alt={label}
                              fill
                              sizes="64px"
                              className="object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {isSuggestLoading && (
                    <div className="px-3 py-2 text-xs text-gray-500">Loading…</div>
                  )}
                </div>
              )}
            </div>

            <Link 
              href="/flash-deals"
              className="flex items-center gap-1 text-white px-5 mr-5 py-2 rounded-xl text-sm"
              style={{ background: "linear-gradient(to bottom, #1e40af, #3b82f6)" }}
            >
              <FiGift className="text-base mr-1 animate-pulseScaleColor" /> Offers
            </Link>

            {/* LANGUAGE DROPDOWN */}
            {/* <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="border  px-5 py-1 h-[40px] flex items-center gap-2 rounded-md bg-[#eaeaea]"
              >
                <span className="underline">English</span>
                <FiChevronDown className="text-black text-2xl" />
              </button>

              <div
                className={`absolute left-0 top-full mt-2 bg-[#eaeaea] border border-gray-300 rounded-md shadow-md w-32 z-50 transition-all ${open ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Bangla</button>
              </div>
            </div> */}

            {/* CART */}
           
          <button onClick={() => setCartOpen(true)} className="bg-[#eaeaea] px-5 py-1 h-[40px] rounded-md flex items-center 2xl:gap-3 gap-1 text-sm">
              <FiShoppingCart className="text-2xl" />
              <div>
               
                <span className="2xl:text-base text-[14px] mt-2">*{cart.length.toString().padStart(2, "0")} Items</span>
              </div>
            </button>


            {/* PROFILE / AUTH */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className="border border-gray-400 px-5 py-2 h-[46px] rounded-md flex items-center gap-2 text-sm bg-white"
                  onClick={() => setShowDesktopLogout(prev => !prev)}
                >
                  <FiUser className="text-2xl" />
                  <div className="text-left">
                    <h1 className="text-base">Hi, {user.name.split(" ")[0]}</h1>
                    <p className="text-xs text-gray-500">
                      {user.phone || user.email || "Customer"}
                    </p>
                  </div>
                </button>

                {showDesktopLogout && (
                  <div
                    className="
          absolute right-0 mt-1
          w-full
          bg-white
          shadow-lg
          transform origin-top
          animate-[fadeInDown_0.18s_ease-out]
          rounded-md
          overflow-hidden
        "
                  >
                    <Link
                      href="/profile"
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                      onClick={() => setShowDesktopLogout(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 border-none bg-transparent"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="bg-[#eaeaea] px-5 py-1 h-[40px] rounded-md flex items-center gap-1 text-sm">
                <Link href="/login" className="flex items-center gap-2">
                  <FiUser className="text-2xl" />
                  {/* <div> */}
                    <h1 className="2xl:text-base text-[14px]">Login</h1>

                  {/* </div> */}
                </Link>
              </button>
            )}
          </div>
        </div>


        {/* ========= DESKTOP NAV ========= */}
        <div className="bg-[#1e40af] hidden lg:block">
          <div className="w-11/12 mx-auto flex justify-between items-center h-10">
            <ul className="flex gap-6 text-white text-sm">
              {/* CATEGORIES - SIMPLE LINKS (NO DROPDOWNS) */}
              {categories.map((category, i) => (
                <li key={i}>
                  <Link 
                    href={`/products/${category.slug}`} 
                    className="hover:text-gray-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}

              {/* ALL BUTTON */}
              <li>
                <Link 
                  href="/products/all" 
                  className="hover:text-gray-200 font-semibold"
                >
                  All
                </Link>
              </li>

              {/* ⭐ SIMPLE LINKS (NOT CATEGORIES) */}
              {simplePages.map((page, i) => (
                <li key={i}>
                  <Link href={page.href} className="hover:text-gray-200">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      {showMobileSearch && (
  <div
    ref={searchRef}
    className="fixed top-[70px] left-0 w-full z-40 lg:hidden animate-[fadeDown_0.25s_ease-out]"
  >
    <div className="relative w-full ">
      <input
        type="text"
        value={mobileSearchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setMobileSearchTerm(value);

          if (suggestTimeoutRef.current) {
            clearTimeout(suggestTimeoutRef.current);
          }

          if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsSuggestLoading(false);
            return;
          }

          setIsSuggestLoading(true);
          suggestTimeoutRef.current = setTimeout(async () => {
            try {
              const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}&limit=8`);
              if (!res.ok) {
                throw new Error("Failed to fetch suggestions");
              }
              const json = await res.json();
              const items: SuggestionItem[] = (json.data || []).map((item: { name: string; slug: string; image?: string; thumbnail_image?: string; price?: number; type?: string }) => ({
                name: item.name,
                slug: item.slug,
                image: item.image || item.thumbnail_image || "",
                price: item.price || null,
                type: item.type || "product"
              }));
              setSuggestions(items);
              setShowSuggestions(items.length > 0);
            } catch (err) {
              console.error("Mobile suggestion fetch error:", err);
              setSuggestions([]);
              setShowSuggestions(false);
            } finally {
              setIsSuggestLoading(false);
            }
          }, 300);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchSubmit(mobileSearchTerm);
          }
        }}
        placeholder="Search your Favourite Accessories..."
        className="w-full bg-white text-black py-3 px-4 pr-12 rounded-md shadow-lg outline-none caret-black placeholder:text-gray-500"
      />
      {isSuggestLoading && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <div className="w-4 h-4 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 🔥 Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0  bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
          {suggestions.map((item: SuggestionItem, idx: number) => {
            const label = item.name || item.title || item.query || "";
            const slug = item.slug;
            const image = 
              item.image || 
              item.thumbnail || 
              item.cover_image || 
              item.thumbnail_image ||
              item.photo ||
              item.photos?.[0]?.path ||
              null;
            const price =
              item.price ||
              item.sale_price ||
              item.offer_price ||
              item.main_price ||
              item.stroked_price ||
              (item.meta && item.meta.price) ||
              null;

            const isCategory = item.type === 'category';
            
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setShowSuggestions(false);
                  setSuggestions([]);
                  setMobileSearchTerm("");
                  
                  if (isCategory && slug) {
                    router.push(`/products/${slug}`);
                  } else if (slug && !isCategory) {
                    router.push(`/products/${slug}`);
                  } else {
                    handleSearchSubmit(label);
                  }
                  setShowMobileSearch(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${idx < suggestions.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex-1 flex flex-col items-start min-w-0">
                  <span className="text-gray-800 line-clamp-1 font-medium">{label}</span>
                  {price !== null && price !== undefined && price !== "" && typeof price === 'number' && (
                    <span className="text-xs text-orange-600 font-semibold mt-0.5">
                      ৳{price.toLocaleString()}
                    </span>
                  )}
                </div>
                {image && image !== "" && (
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                    <Image
                      src={image}
                      alt={label}
                      fill
                      sizes="64px"
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
          {isSuggestLoading && (
            <div className="px-3 py-2 text-xs text-gray-500">Loading…</div>
          )}
        </div>
      )}
    </div>
  </div>
)}


      {/* Prevent overlap */}
      <div className="pt-[70px] xl:pt-[150px]"></div>

      {/* ========= MOBILE BOTTOM NAV ========= */}
      <div className="bg-orange-400 rounded-t-2xl   fixed bottom-0 left-0 w-full flex justify-around items-center py-2 text-white lg:hidden z-50">
        <Link href="/" className="flex flex-col items-center text-sm">
          <FiHome className="text-xl" />
          Home
        </Link>

        {/* <Link href="/offers" className="flex flex-col items-center text-sm"> */}
        <div className="flex flex-col items-center text-sm"> <FiGift className="text-xl" />
          Offers</div>
         
        {/* </Link> */}

        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center text-sm"
        >
          <span className="relative">
            <FiShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] leading-none px-1 py-1 rounded-full border border-white">
                {cart.length.toString().padStart(2, "0")}
              </span>
            )}
          </span>
          Cart
        </button>

         <button className=" flex flex-col items-center text-sm text-white lg:hidden" onClick={() => setMenuOpen(true)}>
              <FiMenu className="text-xl" />
              Menu
            </button>

        {/* <Link href="/login" className="flex flex-col items-center text-sm"> */}
        <Link href="/profile"className="flex flex-col items-center text-sm">
          <FiUser className="text-xl" />
          Profile
          {/* </div> */}
        </Link>
      </div>

      {/* ========= MOBILE SIDEBAR ========= */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 z-40 ${closing ? "opacity-0" : "opacity-100"}`}
            onClick={handleCloseMenu}
          ></div>

          {/* SIDEBAR */}
          <div
            className={`fixed left-0 top-0 w-72 sm:w-80 h-full bg-white shadow-lg z-50 overflow-y-auto ${closing ? "animate-slideOut" : "animate-slideIn"
              }`}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <Image src={logoUrl || "/images/likelogo.png"} width={120} height={120} alt="Logo" />
              <button className="text-3xl text-orange-500" onClick={handleCloseMenu}>
                <FiX />
              </button>
            </div>

            <ul className="p-4 space-y-3 text-gray-800">
              <button className="mt-1 w-full py-3 bg-gradient-to-b from-[#FFD522] to-[#FF6B01] text-white rounded-lg text-sm">
                Buy Dealer Products
              </button>

              {/* MOBILE CATEGORIES - SIMPLE LINKS */}
              {categories.map((cat, index) => (
                <li key={index}>
                  <Link
                    href={`/products/${cat.slug}`}
                    onClick={handleCloseMenu}
                    className="block py-2 text-sm hover:text-orange-500"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}

              {/* ⭐ SIMPLE PAGE LINKS (NO DROPDOWNS) */}
              <hr className="my-2" />
              {simplePages.map((page, i) => (
                <Link
                  key={i}
                  href={page.href}
                  onClick={handleCloseMenu}
                  className="block py-2 text-sm hover:text-orange-500"
                >
                  {page.name}
                </Link>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-[fadeIn_0.18s_ease-out]">
          <div className="bg-white rounded-lg shadow-xl px-6 py-5 w-80 max-w-[90%] text-center transform animate-[scaleIn_0.18s_ease-out]">
            <h2 className="text-lg font-semibold mb-2">
              Are you sure you want to log out?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You will need to log in again to access your account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
};

export default Navbar;
