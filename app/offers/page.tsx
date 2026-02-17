"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";

interface FlashDeal {
  id: string;
  slug: string;
  title: string;
  banner: string | null;
  background_color: string;
  text_color: string;
  date: number;
  start_date: string | Date;
  end_date: string | Date;
  products: {
    data: Array<unknown>;
  };
}

export default function OffersPage() {
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const response = await fetch('/api/flash-deals');
        const result = await response.json();
        
        if (result.success && result.data) {
          setFlashDeals(result.data);
        }
      } catch (error) {
        console.error("Error fetching flash deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

  const getDateRange = (deal: FlashDeal) => {
    const startDate = new Date(deal.start_date);
    const endDate = new Date(deal.end_date);
    
    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString("en-US", { month: "short" });
    const startYear = startDate.getFullYear();
    
    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleString("en-US", { month: "short" });
    const endYear = endDate.getFullYear();
    
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  };

  if (loading) {
    return (
      <main className="w-full bg-white">
        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading offers...</p>
          </div>
        </section>
      </main>
    );
  }

  if (flashDeals.length === 0) {
    return (
      <main className="w-full bg-white">
        <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
              Latest Offers
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No flash deals available at the moment.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full bg-white">
      <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10">
        {/* Page heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
            Latest Flash Deals & Offers
          </h1>
          <p className="text-gray-600 mt-2">
            Limited time offers on selected products
          </p>
        </div>

        {/* Grid of flash deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {flashDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/flash-deals/${deal.slug}`}
              className="block rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 bg-white border border-gray-200"
            >
              {/* Banner Image */}
              {deal.banner ? (
                <div className="relative w-full h-52 sm:h-64 md:h-72">
                  <Image
                    src={deal.banner}
                    alt={deal.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div 
                  className="relative w-full h-52 sm:h-64 md:h-72 flex items-center justify-center"
                  style={{ 
                    backgroundColor: deal.background_color || '#000000',
                    color: deal.text_color || '#ffffff'
                  }}
                >
                  <h2 className="text-2xl font-bold text-center px-4">{deal.title}</h2>
                </div>
              )}

              {/* Deal Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{deal.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FiCalendar className="text-gray-500" />
                  <span>{getDateRange(deal)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {deal.products?.data?.length || 0} Product{deal.products?.data?.length !== 1 ? 's' : ''} Available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}