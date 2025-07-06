'use client';

import { TProduct } from '@/services/product.api';
import ProductCard from '@components/product/ProductCard';

interface RelatedProductsProps {
  products: TProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) {
    return (
      <div className="text-gray-500 flex items-center justify-between">
        <p>Không có sản phẩm liên quan.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.currentPrice}
          image={product.thumbnail}
          shortDescription={product.shortDescription}
          brand={product.brand}
          verified={product.verified}
          sellerShopName={product.sellerShopName}
        />
      ))}
    </div>
  );
}
