"use client";

import React, { useEffect, useState } from "react";

interface MarqueeItem {
  id: string;
  text: string;
  order: number;
}

const MarqueeSlider = () => {
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarquee() {
      try {
        const res = await fetch("/api/marquee", { cache: "no-store" });
        if (!res.ok) {
          console.error("Marquee API error:", res.status, res.statusText);
          return;
        }
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setMarqueeItems(json.data);
        }
      } catch (error) {
        console.error("Marquee fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMarquee();
  }, []);

  if (loading || marqueeItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1e40af] text-white overflow-hidden relative">
      <div className="marquee-wrapper">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Render multiple copies for seamless loop */}
          {[...Array(2)].map((_, copyIndex) => (
            <div key={copyIndex} className="flex items-center">
              {marqueeItems.map((item, index) => (
                <React.Fragment key={`${copyIndex}-${item.id}`}>
                  <span className="text-sm md:text-base font-medium px-8">
                    {item.text}
                  </span>
                  {index < marqueeItems.length - 1 && (
                    <span className="mx-12 text-lg opacity-60">•••</span>
                  )}
                </React.Fragment>
              ))}
              {/* Add gap between sets */}
              <span className="mx-16 text-lg opacity-60">•••</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeSlider;

