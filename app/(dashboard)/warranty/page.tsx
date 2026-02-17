"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface WarrantyClaim {
  id: string;
  order_code: string;
  product_name: string;
  product_image?: string;
  issue_description: string;
  status: string;
  days_in_warranty: number;
  estimated_days: number | null;
  estimated_return_date: string | null;
  admin_notes: string | null;
  created_at: string;
}

export default function WarrantyPage() {
  const { accessToken, loading: authLoading } = useAuth();
  const [warranties, setWarranties] = useState<WarrantyClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchWarranties = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      let url = '/api/warranty';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to fetch warranty claims');
      }

      setWarranties(result.data || []);
    } catch (error: unknown) {
      console.error('Error fetching warranties:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load warranty claims';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusFilter]);

  useEffect(() => {
    if (!authLoading) {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      fetchWarranties();
    }
  }, [accessToken, authLoading, statusFilter, fetchWarranties]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your warranty claims</h1>
        <Link href="/login" className="text-orange-600 hover:text-orange-700">Login here</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-screen">
      <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Warranty Claims</h1>
        <Link 
          href="/warranty/claim"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Submit New Claim
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Warranty Claims List */}
      {warranties.length === 0 ? (
        <div className="bg-[#F9FAFB] rounded-2xl p-10 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">No warranty claims found!</h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed mb-6">
            You haven&apos;t submitted any warranty claims yet. If you have a product issue, you can submit a warranty claim.
          </p>
          <Link 
            href="/warranty/claim"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Submit Warranty Claim
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {warranties.map((warranty) => (
            <div key={warranty.id} className="bg-[#F3F4F6] rounded-xl p-5 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Product Image */}
                {warranty.product_image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={warranty.product_image}
                      alt={warranty.product_name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                
                {/* Warranty Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{warranty.product_name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Order Code:</span> {warranty.order_code}</p>
                        <p><span className="font-medium">Issue:</span> {warranty.issue_description}</p>
                        <p><span className="font-medium">Days in Warranty:</span> {warranty.days_in_warranty} days</p>
                        {warranty.estimated_return_date && (
                          <p><span className="font-medium">Estimated Return:</span> {new Date(warranty.estimated_return_date).toLocaleDateString()}</p>
                        )}
                        {warranty.admin_notes && (
                          <p><span className="font-medium">Admin Notes:</span> {warranty.admin_notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(warranty.status)}`}>
                        {warranty.status.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(warranty.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

