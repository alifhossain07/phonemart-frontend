"use client";

import React from "react";
import Image from "next/image";

interface ProductItem {
  id: number;
  slug: string;
  name: string;
  thumbnail_image: string;
  has_discount: boolean;
  discount?: string;
  stroked_price?: string;
  main_price: string;
  rating?: number;
  sales?: number;
}

interface ProductListProps {
  relatedProducts: ProductItem[];
  recentlyViewed: ProductItem[];
}

const ProductList: React.FC<ProductListProps> = ({ relatedProducts, recentlyViewed }) => {
  const renderProduct = (product: ProductItem) => (
    <div
      key={product.id}
      className="flex items-center gap-3 border-b border-gray-200 py-3 last:border-b-0"
    >
      <div className="w-36 h-24 relative flex-shrink-0">
        <Image
          src={product.thumbnail_image}
          alt={product.name}
          fill
          className="object-fill rounded"
        />
        {product.has_discount && product.discount && (
          <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr rounded-bl">
            {product.discount}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-1">
        {/* Availability can be derived from sales if needed */}
        <p className="text-[18px] font-medium">{product.name}</p>
        <div className="flex items-center gap-2 text-orange-500 font-semibold">
          <span className="text-[22px]">{product.main_price}</span>
          {product.stroked_price && (
            <span className="text-gray-400 line-through text-[12px]">
              {product.stroked_price}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-auto rounded-xl">
      {relatedProducts.length > 0 && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Related Products</h3>
          <div className="space-y-2">{relatedProducts.map(renderProduct)}</div>
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="h-auto bg-white rounded-xl p-5">
          <h3 className="text-lg font-semibold border-b-2 pb-3">Recently Viewed Products</h3>
          <div className="space-y-2">{recentlyViewed.map(renderProduct)}</div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
