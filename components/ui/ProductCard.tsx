"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { FaCartPlus, FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import ProductOptionsModal from "./ProductOptionsModal";
import toast from "react-hot-toast";

type Spec = {
  icon: string;
  text: string;
};

type Product = {
  id: number | string;
  slug: string;
  image: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: string | number;
  rating: number | string;
  reviews: number | string;
  featured_specs?: Spec[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const { accessToken, user } = useAuth();

  const checkWishlistStatus = useCallback(async () => {
    if (!accessToken || !product.id) return;

    try {
      const response = await fetch(`/api/wishlist/check/${product.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (result.result && result.data) {
        setIsInWishlist(result.data.in_wishlist || false);
      }
    } catch {
      // Silently fail - user might not be logged in
      setIsInWishlist(false);
    }
  }, [accessToken, product.id]);

  // Check if product is in wishlist when component mounts or user/auth changes
  useEffect(() => {
    if (accessToken && user && product.id) {
      checkWishlistStatus();
    } else {
      setIsInWishlist(false);
    }
  }, [accessToken, user, product.id, checkWishlistStatus]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!accessToken || !user) {
      toast.error("Please log in to add items to your wishlist");
      return;
    }

    if (!product.id) {
      toast.error("Invalid product");
      return;
    }

    setIsLoadingWishlist(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });

        const result = await response.json();

        if (result.result) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          throw new Error(result.message || 'Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });

        const result = await response.json();

        if (result.result) {
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        } else {
          throw new Error(result.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wishlist';
      toast.error(errorMessage);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-md shadow-lg hover:shadow-md transition relative flex flex-col justify-between w-full max-w-sm mx-auto">

        {/* ---------- IMAGE ---------- */}
        <Link
          href={`/${product.slug}`}
          className="relative flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden mx-2 mt-2"
        >
          <div
            className="
              w-full relative
              aspect-[1/1]        /* mobile: compact square */
              sm:aspect-[4/3]     /* tablet */
              md:aspect-[5/4]     /* desktop */
            "
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain sm:scale-95 md:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Discount Badge */}
            <span
              className="
                absolute top-1 left-1
                bg-green-100 text-green-600
                text-[8px] sm:text-xs md:text-sm
                font-semibold
                px-1.5 py-0.5 sm:px-2 sm:py-1
                rounded-md
              "
            >
              {product.discount}
            </span>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              disabled={isLoadingWishlist}
              className={`
                absolute top-1 right-1
                z-10
                p-1 sm:p-1.5 md:p-2
                rounded-md
                transition-all
                shadow-sm
                ${isInWishlist 
                  ? 'text-red-500 bg-red-100 hover:bg-red-200' 
                  : 'text-gray-600 bg-white hover:bg-gray-100 hover:text-red-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FaHeart 
                className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWishlist ? 'fill-current' : ''}`}
              />
            </button>
          </div>
        </Link>

        {/* ---------- TITLE ---------- */}
        <Link href={`/${product.slug}`}>
          <h3 className="mt-3 mx-2 text-gray-800 font-medium text-[14px] sm:text-sm md:text-lg xl:text-[18px] line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* ---------- PRICE ---------- */}
        <div className="flex flex-col px-2 py-1 gap-1">
          <span className="text-[#1e40af] font-bold text-lg sm:text-base md:text-xl lg:text-2xl">
            ৳{product.price}
          </span>
          <span className="text-gray-400 line-through text-xs sm:text-sm md:text-md">
            ৳{product.oldPrice}
          </span>
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="flex items-center justify-between mx-2 mb-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            ({product.rating})
          </div>

          <button
            onClick={() => setOptionsOpen(true)}
            className="
              bg-black text-white
              p-2 sm:p-1.5 md:p-2.5
              rounded-md
              hover:bg-gray-800 transition
            "
          >
            <FaCartPlus size={18} />
          </button>
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      <ProductOptionsModal
        slug={product.slug}
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  );
}
