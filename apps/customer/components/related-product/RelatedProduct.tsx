'use client';

import { TProduct } from '@/services/product.api';
import ProductCard from '@components/product/ProductCard';
import ProductSectionEmpty from '@components/product/ProductSectionEmpty';
import { Grid3X3 } from 'lucide-react';

interface RelatedProductsProps {
  products: TProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) {
    return (
      <ProductSectionEmpty
        title="Không có sản phẩm liên quan"
        description="Hiện tại chúng tôi chưa tìm thấy sản phẩm liên quan nào cho sản phẩm này."
        icon={Grid3X3}
        showBrowseButton={true}
        showRefreshButton={false}
        showCategories={false}
        browseButtonText="Xem thêm sản phẩm"
        browseButtonPath="/product"
        size="sm"
      />
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
