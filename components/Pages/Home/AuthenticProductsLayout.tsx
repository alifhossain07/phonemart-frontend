"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AuthenticProductsLayoutSkeleton from "@/components/Skeletons/AuthenticProductsLayoutSkeleton";

type InfoRow = {
  [key: string]: string;
};

type ApiData = {
  banner_image_one?: string;
  banner_image_two?: string;
  image?: string;
  title?: string;
  description?: string;
  info_rows?: InfoRow[];
};

const AuthenticProductsLayout: React.FC = () => {
  const [data] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract title and paragraph from info row or use direct fields
  const extractTitleAndParagraph = (item: InfoRow | null) => {
    if (!item) {
      return { title: "", paragraph: "" };
    }

    const titleKey = Object.keys(item).find((key) => key.startsWith("title_"));
    const paragraphKey = Object.keys(item).find((key) =>
      key.startsWith("paragraph_")
    );

    return {
      title: titleKey ? item[titleKey] : "",
      paragraph: paragraphKey ? item[paragraphKey] : "",
    };
  };

  // API removed - home info SEO data will be loaded from new Express.js admin panel
  useEffect(() => {
    setLoading(false);
  }, []);

  // Loading state
  if (loading) {
    return <AuthenticProductsLayoutSkeleton />;
  }

  if (!data) {
    return null;
  }

  // Get title and paragraph - try from first info_row, or use direct fields
  let title = "";
  let paragraph = "";

  if (data.info_rows && data.info_rows.length > 0) {
    const extracted = extractTitleAndParagraph(data.info_rows[0]);
    title = extracted.title;
    paragraph = extracted.paragraph;
  } else if (data.title) {
    title = data.title;
    paragraph = data.description || "";
  }

  // Get image - prefer banner_image_one, then banner_image_two, then image
  const imageUrl = data.banner_image_one || data.banner_image_two || data.image || "";

  // Don't render if no content
  if (!title && !paragraph && !imageUrl) {
    return null;
  }

  return (
    <div className="w-11/12 bg-green-200 p-10 mx-auto rounded-2xl my-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT COLUMN - Title and Paragraph */}
        <div className="flex flex-col justify-center">
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>
          )}
          {paragraph && (
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {paragraph}
            </p>
          )}
        </div>

        {/* RIGHT COLUMN - Image */}
        {imageUrl && (
          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center min-h-[400px]">
            <Image
              src={imageUrl}
              alt={title || "Authentic Products"}
              width={600}
              height={500}
              className="object-contain w-full h-full rounded-lg"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticProductsLayout;