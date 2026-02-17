"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FaHeart, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductOptionsModal from '@/components/ui/ProductOptionsModal';

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  thumbnail_image?: string;
  main_price: number;
  base_price?: number;
  discount_type?: string;
  discount_value?: number;
  current_stock?: number;
  rating?: number;
}

export default function WishlistPage() {
  const { accessToken, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');

  const fetchWishlist = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch wishlist');
      }

      setProducts(result.data || []);
    } catch (error: unknown) {
      console.error('Error fetching wishlist:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wishlist';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!authLoading) {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      fetchWishlist();
    }
  }, [accessToken, authLoading, fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!accessToken) return;

    setRemovingId(productId);
    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to remove from wishlist');
      }

      toast.success('Removed from wishlist');
      // Remove from local state
      setProducts(products.filter(p => p.id !== productId));
    } catch (error: unknown) {
      console.error('Error removing from wishlist:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist';
      toast.error(errorMessage);
    } finally {
      setRemovingId(null);
    }
  };

  const calculatePrice = (product: WishlistProduct) => {
    if (product.main_price) return product.main_price;
    if (product.base_price) {
      let price = product.base_price;
      if (product.discount_type === 'percentage' && product.discount_value) {
        price = price * (1 - product.discount_value / 100);
      } else if (product.discount_type === 'fixed' && product.discount_value) {
        price = price - product.discount_value;
      }
      return Math.max(0, price);
    }
    return 0;
  };

  const calculateDiscount = (product: WishlistProduct) => {
    if (product.base_price && product.discount_type && product.discount_value) {
      if (product.discount_type === 'percentage') {
        return product.base_price * (product.discount_value / 100);
      } else {
        return product.discount_value;
      }
    }
    return 0;
  };

  const handleBuyClick = (slug: string) => {
    setSelectedProductSlug(slug);
    setOptionsOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Please log in to view your wishlist</h1>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        {/* Header Section */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        </div>

        {/* Empty State / No Products Section */}
        {products.length === 0 ? (
          <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center mb-8 border border-gray-50">
            <div className="relative mb-4">
              <div className="bg-white p-4 rounded-full shadow-sm">
                <FaHeart size={60} className="text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your wishlist is empty!</h2>
            <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
              Your wishlist is as empty as a library during a zombie apocalypse! Time to fill it up with your dreams, desires, and a few items that might save you from the undead...or at least bring a smile to your face!
            </p>
            <Link 
              href="/"
              className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const price = calculatePrice(product);
              const discount = calculateDiscount(product);
              const oldPrice = product.base_price || product.main_price || price;
              
              return (
                <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Image Container */}
                  <div className="relative p-4 bg-[#F3F4F6] m-3 rounded-lg flex justify-center">
                    <Link href={`/${product.slug}`}>
                      {product.thumbnail_image ? (
                        <Image 
                          src={product.thumbnail_image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="h-48 object-contain"
                        />
                      ) : (
                        <div className="w-full h-48 bg-white rounded flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </Link>
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      disabled={removingId === product.id}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      <FaHeart 
                        size={20} 
                        className={removingId === product.id ? 'text-gray-400' : 'text-red-500 fill-red-500'} 
                      />
                    </button>

                    {/* Save Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-[#008D41] text-white text-xs font-bold px-3 py-1.5 rounded-br-lg rounded-tl-lg">
                        Save ৳{discount.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 pt-0">
                    <Link href={`/${product.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mb-2">
                      Stock: <span className={`font-medium ${(product.current_stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(product.current_stock || 0) > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </p>
                    
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <FaStar className="text-yellow-400" size={12} />
                        <span className="text-xs text-gray-500">({product.rating})</span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-bold text-blue-600">৳{price.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">৳{oldPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleBuyClick(product.slug)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
                    >
                      Buy Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Options Modal */}
      {optionsOpen && (
        <ProductOptionsModal
          slug={selectedProductSlug}
          open={optionsOpen}
          onClose={() => {
            setOptionsOpen(false);
            setSelectedProductSlug('');
          }}
        />
      )}
    </>
  );
}
