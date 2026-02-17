"use client";

import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderComplete() {
  const [loading, setLoading] = useState(true);
  const [orderIdState, setOrderIdState] = useState<string | null>(null);
  const [customer, setCustomer] = useState<{ name: string; mobile: string; address?: string } | null>(null);
  const [items, setItems] = useState<Array<{ id: string | number; name: string; qty: number; price: number; variant?: string | null }>>([]);
  const [totals, setTotals] = useState<{
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    promoDiscount: number;
    total: number;
  } | null>(null);
  const [shipping, setShipping] = useState<{
    method: string;
    methodLabel: string;
    charge: number;
  } | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem("lastOrder") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setOrderIdState(orderId || parsed?.orderId || null);
        if (parsed?.customer) {
          setCustomer({ 
            name: parsed.customer.name || "", 
            mobile: parsed.customer.mobile || "",
            address: parsed.customer.address || ""
          });
        }
        if (Array.isArray(parsed?.items)) {
          // Debug: log items to check variant data
          console.log("Order items loaded:", parsed.items);
          parsed.items.forEach((item: { name?: string; variant?: unknown }, idx: number) => {
            if (item.variant) {
              console.log(`Item ${idx + 1} (${item.name}) has variant:`, item.variant);
            }
          });
          setItems(parsed.items);
        }
        if (parsed?.totals) {
          setTotals(parsed.totals);
        }
        if (parsed?.shipping) {
          setShipping(parsed.shipping);
        }
      } else {
        setOrderIdState(orderId);
      }
    } catch {
      setOrderIdState(orderId);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <Suspense fallback={<div className="w-full py-10 text-center">Loading...</div>}>
      <div className="w-full flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl border rounded-2xl p-6 md:p-12 bg-white shadow-sm text-center">
          
          {/* Loading Spinner */}
          {loading && (
            <div className="w-full flex justify-center py-6">
              <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && (
            <>
              {/* Success Header */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/tick.png"
                  alt="Success"
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">
                Order Completed!
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-8">
                Thank you. Your order has been received and is being processed.
              </p>

              {/* Unified Order Box */}
              <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden text-left mb-8">
                {/* Header/Customer Info Section */}
                <div className="p-5 border-b border-gray-200 bg-gray-100/50">
                   <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Order Details</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Order ID</p>
                      <p className="text-sm font-semibold text-gray-800">{orderIdState || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Customer</p>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{customer?.name || "N/A"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Contact</p>
                      <p className="text-sm font-semibold text-gray-800">{customer?.mobile || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Address</p>
                      <p className="text-sm font-semibold text-gray-800 break-words">{customer?.address || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items Purchased</h3>
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No item details available.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="flex gap-2 items-center">
                              <span className="bg-orange-100 text-blue-600 font-bold px-2 py-0.5 rounded text-xs">
                                {it.qty}x
                              </span>
                              <span className="font-medium text-gray-700">{it.name}</span>
                            </div>
                            {it.variant && it.variant.trim() !== "" && (
                              <p className="text-xs text-gray-500 ml-7">{it.variant}</p>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900">৳{(it.price * it.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="px-5 pb-5 border-t border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Billing Summary</h3>
                  {totals ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">৳{totals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold">৳{totals.discount.toLocaleString()}</span>
                      </div>
                      {totals.promoDiscount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span>Promo Discount</span>
                          <span className="font-semibold">-৳{totals.promoDiscount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">{shipping?.methodLabel || "Delivery"}</span>
                        <span className="font-semibold">৳{(shipping?.charge ?? totals.deliveryCharge).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t font-bold text-orange-600">
                        <span>Grand Total</span>
                        <span>৳{totals.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Summary unavailable.</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition-all active:scale-95"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}