"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LuCopy } from "react-icons/lu";
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { generateInvoice } from '@/app/utils/invoiceGenerator';

interface OrderItem {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  image?: string;
  product_image?: string;
  qty?: number;
  quantity?: number;
  price: number;
  total: number;
  variant?: string;
}

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  shipping_cost: number;
  final_amount: number;
  delivery_status: string;
  payment_status: string;
  payment_method: string;
}

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { accessToken, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    if (!accessToken || !orderId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch order details');
      }

      setOrder(result.data);
    } catch (error: unknown) {
      console.error('Error fetching order details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load order details';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken, orderId]);

  useEffect(() => {
    if (!authLoading && accessToken && orderId) {
      fetchOrderDetails();
    } else if (!authLoading && !accessToken) {
      setLoading(false);
    }
  }, [accessToken, authLoading, orderId, fetchOrderDetails]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateInvoice = () => {
    if (!order || generatingInvoice) return;
    
    setGeneratingInvoice(true);
    try {
      generateInvoice(order);
      toast.success('Invoice generated successfully!');
    } catch (error: unknown) {
      console.error('Error generating invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate invoice';
      toast.error(errorMessage);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Please log in to view order details</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Order not found</h2>
          <Link 
            href="/orders" 
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Go back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link 
          href="/orders" 
          className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          Go Back
        </Link>
      </div>

      {/* Top Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Order ID with Dashed Border */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Order ID #{order.order_code}
              <button onClick={() => handleCopy(order.order_code)} className="text-gray-400 hover:text-gray-600">
                <LuCopy size={18} />
              </button>
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(order.delivery_status)}`}>
                {order.delivery_status}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(order.payment_status)}`}>
                {order.payment_status}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerateInvoice}
          disabled={generatingInvoice || !order}
          className="bg-[#E9672B] hover:bg-[#d55b24] disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          {generatingInvoice ? 'Generating...' : 'Generate Invoice'}
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4 mb-8">
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => {
            const productName = item.name || item.product_name || 'Product';
            const productImage = item.image || item.product_image;
            const quantity = item.qty || item.quantity || 1;
            
            return (
              <div key={index} className="bg-[#F9FAFB] rounded-xl p-4 flex gap-4 border border-gray-50">
                <div className="w-24 h-24 bg-white rounded-lg flex-shrink-0 border border-gray-100 p-2">
                  {productImage ? (
                    <Image 
                      src={productImage}
                      alt={productName}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900">{productName}</h4>
                  {item.variant && (
                    <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mt-1">Qty: {quantity}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-lg font-bold text-[#E9672B]">৳{item.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">× {quantity}</p>
                    <p className="text-lg font-bold text-gray-900 ml-auto">
                      Total: ৳{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-8">No items found</p>
        )}
      </div>

      {/* Bottom Grid: Address and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Shipping Address
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Name:</span> {order.customer.name}</p>
            <p><span className="font-medium text-gray-800">Mobile:</span> {order.customer.mobile}</p>
            {order.customer.email && (
              <p><span className="font-medium text-gray-800">Email:</span> {order.customer.email}</p>
            )}
            <p className="leading-relaxed">
              <span className="font-medium text-gray-800">Address:</span> {order.customer.address || 'N/A'}
            </p>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Total Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Price</span>
              <span className="font-semibold text-gray-900">৳{order.total_amount.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-৳{order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold text-gray-900">৳{order.shipping_cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-bold text-gray-900">৳{order.final_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900 capitalize">{order.payment_method || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
