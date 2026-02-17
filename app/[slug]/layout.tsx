// app/[slug]/layout.tsx  (SERVER COMPONENT – no "use client")

import type { Metadata } from "next";
import React from "react";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;
const SITE_URL = "https://sannai.com.bd";

type ProductSEO = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_image?: string | null;
  slug?: string | null;
};

type Product = {
  id: number;
  name: string;
  description: string;
  thumbnail_image?: string | null;
  photos?: { path: string }[];
  seo?: ProductSEO | null;

  // extra fields used in schema (all optional to be safe)
  main_price?: number | string | null;
  brand?: { name?: string | null } | null;
  current_stock?: number | null;
  slug?: string | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// Fetch a single product by slug from API
async function getProduct(slug: string): Promise<Product | null> {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY");
      return null;
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const url = `${baseUrl}/api/v2/products/${slug}`;
    
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store", // always fresh for SEO
    });

    if (!res.ok) return null;

    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return null;
    }

    return json.data[0] as Product;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product not found | Sannai Technology",
      description: "The requested product could not be found.",
    };
  }

  const seo = product.seo ?? {};

  const title = seo.meta_title || product.name;

  // Strip HTML from description and clamp length
  const rawDescription =
    seo.meta_description ||
    (typeof product.description === "string" ? product.description : "");
  const description = stripHtml(rawDescription).slice(0, 160);

  const image =
    seo.meta_image ||
    product.thumbnail_image ||
    product.photos?.[0]?.path ||
    undefined;

  const keywords =
    typeof seo.meta_keywords === "string"
      ? seo.meta_keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined;

  const urlSlug = seo.slug || params.slug;
  const url = `${SITE_URL}/${urlSlug}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Layout + JSON-LD Product schema
export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  // If product not found, just render children without schema
  if (!product) {
    return <>{children}</>;
  }

  const seo = product.seo ?? {};

  const rawDescription =
    seo.meta_description ||
    (typeof product.description === "string" ? product.description : "");
  const plainDescription = stripHtml(rawDescription).slice(0, 160);

  // Build image list (thumbnail + gallery)
  const imageUrls: string[] = [];
  if (product.thumbnail_image) imageUrls.push(product.thumbnail_image);
  if (product.photos && product.photos.length > 0) {
    imageUrls.push(
      ...product.photos
        .map((p) => p?.path)
        .filter((p): p is string => !!p)
    );
  }
  const uniqueImages = Array.from(new Set(imageUrls));

  const urlSlug = seo.slug || product.slug || params.slug;
  const url = `${SITE_URL}/${urlSlug}`;

  // Basic price parsing so schema always gets a number
  const rawPrice = product.main_price;
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : rawPrice
      ? Number(
          String(rawPrice)
            .replace(/[^\d.]/g, "")
            .trim()
        ) || undefined
      : undefined;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: plainDescription,
    image: uniqueImages,
    sku: String(product.id),
    brand: product.brand?.name
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    offers: price
      ? {
          "@type": "Offer",
          url,
          priceCurrency: "BDT",
          price,
          availability:
            (product.current_stock ?? 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // NOTE: must be a JSON string, not an object
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      {children}
    </>
  );
}