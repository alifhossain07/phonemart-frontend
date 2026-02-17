"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_code: string;
  items: Array<{
    id: string;
    name: string;
    image?: string;
    qty: number;
    price: number;
  }>;
  created_at: string;
}

export default function WarrantyClaimPage() {
  const { accessToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/orders?page=1', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch orders');
      }

      setOrders(result.data || []);
    } catch (error: unknown) {
      console.error('Error fetching orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!authLoading) {
      if (!accessToken) {
        router.push('/login');
        return;
      }
      fetchOrders();
    }
  }, [accessToken, authLoading, router, fetchOrders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder || !selectedProduct || !issueDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!accessToken) {
      toast.error('You must be logged in');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/warranty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          order_id: selectedOrder,
          product_id: selectedProduct,
          issue_description: issueDescription.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to submit warranty claim');
      }

      toast.success('Warranty claim submitted successfully!');
      router.push('/warranty');
    } catch (error: unknown) {
      console.error('Error submitting warranty claim:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit warranty claim';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);
  const availableProducts = selectedOrderData?.items || [];

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
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Submit Warranty Claim</h1>
        <p className="text-sm text-gray-600 mt-2">Select an order and product to submit a warranty claim</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Selection */}
        <div>
          <label className="block text-sm font-semibold mb-2">Select Order *</label>
          <select
            value={selectedOrder}
            onChange={(e) => {
              setSelectedOrder(e.target.value);
              setSelectedProduct(''); // Reset product when order changes
            }}
            required
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an order...</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.order_code} - {new Date(order.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        {selectedOrder && (
          <div>
            <label className="block text-sm font-semibold mb-2">Select Product *</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a product...</option>
              {availableProducts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Qty: {item.qty})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Issue Description *</label>
          <textarea
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            required
            rows={5}
            placeholder="Describe the issue with your product in detail..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Please provide as much detail as possible about the issue</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/warranty"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Warranty Claim'}
          </button>
        </div>
      </form>
    </div>
  );
}

