"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface OrderCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string | null;
}

interface OrderData {
  orderId: string | null;
  customer: {
    name: string;
    mobile: string;
    address?: string;
  } | null;
  items: Array<{
    id: string | number;
    name: string;
    qty: number;
    price: number;
    variant?: string | null;
  }>;
  totals: {
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    promoDiscount: number;
    total: number;
  } | null;
  shipping: {
    method: string;
    methodLabel: string;
    charge: number;
  } | null;
}

export default function OrderCompleteModal({ isOpen, onClose, orderId }: OrderCompleteModalProps) {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData>({
    orderId: null,
    customer: null,
    items: [],
    totals: null,
    shipping: null,
  });

  useEffect(() => {
    if (!isOpen) return;

    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("lastOrder") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrderData({
          orderId: orderId || parsed?.orderId || null,
          customer: parsed?.customer
            ? {
                name: parsed.customer.name || "",
                mobile: parsed.customer.mobile || "",
                address: parsed.customer.address || "",
              }
            : null,
          items: Array.isArray(parsed?.items) ? parsed.items : [],
          totals: parsed?.totals || null,
          shipping: parsed?.shipping || null,
        });
      } else {
        setOrderData((prev) => ({
          ...prev,
          orderId: orderId || null,
        }));
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      setOrderData((prev) => ({
        ...prev,
        orderId: orderId || null,
      }));
    } finally {
      setLoading(false);
    }
  }, [isOpen, orderId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-3 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[80vh] md:max-h-[75vh] bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Loading Spinner */}
          {loading && (
            <div className="w-full flex justify-center py-4 sm:py-5 md:py-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && (
            <>
              {/* Success Header */}
              <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
                <Image
                  src="/images/successTick.png"
                  alt="Success"
                  width={50}
                  height={50}
                  className="sm:w-[60px] sm:h-[60px] md:w-[110px] md:h-[110px] object-contain"
                />
              </div>

              <h1 className="text-xl sm:text-2xl md:text-2xl font-medium text-green-500 mb-1 sm:mb-2 text-center">
                Congratulations!
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">
                Your order has been successfully placed and being processed.
                <div>
                     
                      <p className="text-xs sm:text-[18px] tracking-wide mt-3 font-medium text-blue-500">
                       Order ID:  {orderData.orderId || "N/A"}
                      </p>
                    </div>
              </p>
              

              {/* Unified Order Box */}
              <div className="w-full bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden text-left mb-4 sm:mb-6 md:mb-8">
                {/* Header/Customer Info Section */}
                <div className="p-3 sm:p-4 md:p-5 border-b border-gray-200 bg-gray-100/50">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-2 sm:mb-3 md:mb-4">
                    Order Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    
                    <div>
                      <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold">Customer</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">
                        {orderData.customer?.name || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold">Contact</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">
                        {orderData.customer?.mobile || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-bold">Address</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words line-clamp-2 sm:line-clamp-none">
                        {orderData.customer?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 sm:mb-3">
                    Items Purchased
                  </h3>
                  {orderData.items.length === 0 ? (
                    <p className="text-xs sm:text-sm text-gray-400 italic">No item details available.</p>
                  ) : (
                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      {orderData.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-100 pb-1.5 sm:pb-2 last:border-0 last:pb-0"
                        >
                          <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0 pr-2">
                            <div className="flex gap-1.5 sm:gap-2 items-center">
                              <span className="bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-xs shrink-0">
                                {it.qty}x
                              </span>
                              <span className="font-medium text-gray-700 truncate">{it.name}</span>
                            </div>
                            {it.variant && it.variant.trim() !== "" && (
                              <p className="text-[10px] sm:text-xs text-gray-500 ml-5 sm:ml-7 truncate">{it.variant}</p>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 shrink-0 text-xs sm:text-sm">
                            ৳{(it.price * it.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5 border-t border-gray-200">
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 sm:mb-3">
                    Billing Summary
                  </h3>
                  {orderData.totals ? (
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">
                          ৳{orderData.totals.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold">
                          ৳{orderData.totals.discount.toLocaleString()}
                        </span>
                      </div>
                      {orderData.totals.promoDiscount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span>Promo Discount</span>
                          <span className="font-semibold">
                            -৳{orderData.totals.promoDiscount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-[10px] sm:text-xs">
                          {orderData.shipping?.methodLabel || "Delivery"}
                        </span>
                        <span className="font-semibold">
                          ৳{(
                            orderData.shipping?.charge ?? orderData.totals.deliveryCharge
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t font-bold text-blue-600 text-sm sm:text-base">
                        <span>Grand Total</span>
                        <span>৳{orderData.totals.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400 italic">Summary unavailable.</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/"
                  onClick={handleContinueShopping}
                  className="w-full sm:w-auto bg-blue-700 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md hover:bg-orange-600 transition-all active:scale-95 text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

