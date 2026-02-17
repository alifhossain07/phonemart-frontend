"use client";

import React, { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import NewsLetterBannerSkeleton from "@/components/Skeletons/NewsLetterBannerSkeleton";

type HomeBottomBanner = {
  id?: string;
  image: string;
  title: string;
  subtitle?: string;
  icons?: unknown[];
};

const NewsletterBanner: React.FC = () => {
  const [data, setData] = useState<HomeBottomBanner | null>(null);
  const [loading, setLoading] = useState(true);

  // -------- FORMAT TITLE --------
  const formatTitle = (title: string) => {
    if (!title) return '';
    return title
      .replace(/\*(.*?)\*/g, (_, text) => {
        return `<span class="underline underline-offset-4">${text}</span>`;
      })
      .replace(/\n/g, "<br/>");
  };

  useEffect(() => {
    const fetchNewsletterBanner = async () => {
      try {
        const response = await fetch('/api/newsletter-banner');
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching newsletter banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletterBanner();
  }, []);

  // -------- LOADING --------
  if (loading) {
    return <NewsLetterBannerSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="w-11/12 pb-10 mx-auto mt-12">
      <div
        className="bg-gradient-to-r from-orange-400 to-orange-600 h-[400px] rounded-xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 text-white relative overflow-hidden"
        style={{
          ...(data.image ? {
            backgroundImage: `url(${data.image})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat"
          } : {})
        }}
      >
        {/* Dark Overlay for better text readability */}
        {data.image && (
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        )}

        {/* Left Side */}
        <div className="relative z-10 flex flex-col items-start gap-5 max-w-lg text-center md:text-left">
          <div className="space-y-2">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug"
              dangerouslySetInnerHTML={{ __html: formatTitle(data.title) }}
            />
            {data.subtitle && (
              <p className="text-white/90 text-sm md:text-base opacity-90">
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-transparent border border-white/60 rounded-full px-4 py-2 w-full sm:w-auto">
              <FiMail className="text-white/80 mr-2 text-lg" />
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent outline-none placeholder-white/70 text-white text-sm w-full sm:w-64"
              />
            </div>

            <button className="bg-white text-orange-600 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition w-full sm:w-auto">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
