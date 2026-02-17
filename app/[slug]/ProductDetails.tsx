import React from 'react';

interface ProductDetailsProps {
  description: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ description }) => {
  return (
    <div className="w-full mx-auto py-2 ">
      <article 
        className="dynamic-content-renderer"
        dangerouslySetInnerHTML={{ __html: description }} 
      />
    </div>
  );
};

export default ProductDetails;