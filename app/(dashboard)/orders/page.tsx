"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { LuCopy } from "react-icons/lu";
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import { generateInvoice } from '@/app/utils/invoiceGenerator';

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  final_amount: number;
  delivery_status: string;
  payment_status: string;
}

interface OrderCardProps {
  order: Order;
  accessToken: string;
}

const OrderCard = ({ order, accessToken }: OrderCardProps) => {
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard!");
  };

  const handleGenerateInvoice = async () => {
    if (generatingInvoice) return;
    
    setGeneratingInvoice(true);
    try {
      const response = await fetch(`/api/user/orders/${order.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch order details');
      }

      generateInvoice(result.data);
      toast.success('Invoice generated successfully!');
    } catch (error: unknown) {
      console.error('Error generating invoice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate invoice';
      toast.error(errorMessage);
    } finally {
      setGeneratingInvoice(false);
    }
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

  return (
    <div className="bg-[#F3F4F6] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      {/* Order ID Section with Dashed Border */}
      <div className="border-2 border-dashed border-gray-400 rounded-xl p-3 flex items-center justify-between min-w-[280px] bg-transparent">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Order ID #{order.order_code}
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
            <span className="text-xs text-gray-600 font-medium">
              ৳{order.final_amount.toLocaleString()}
            </span>
          </div>
        </div>
        <button 
          onClick={() => handleCopy(order.order_code)}
          className="text-gray-500 hover:text-gray-800 transition-colors p-2"
          title="Copy Order ID"
        >
          <LuCopy size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link 
          href={`/orderdetails?id=${order.id}`}
          className="flex-1 md:flex-none bg-[#D1D5DB] hover:bg-gray-400 text-gray-800 font-bold px-8 py-2.5 rounded-lg transition-colors text-center"
        >
          Details
        </Link>
        <button 
          onClick={handleGenerateInvoice}
          disabled={generatingInvoice}
          className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          {generatingInvoice ? 'Generating...' : 'Generate Invoice'}
        </button>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { accessToken, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user/orders?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      setOrders(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error: unknown) {
      console.error('Error fetching orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    if (!authLoading) {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      fetchOrders();
    }
  }, [accessToken, authLoading, page, fetchOrders]);

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Please log in to view your orders</h1>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 pb-4 border-b border-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
      </div>

      {/* List of Orders */}
      {orders.length === 0 ? (
        <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">No orders found!</h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} accessToken={accessToken!} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
