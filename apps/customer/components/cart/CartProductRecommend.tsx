'use client';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@components/product/ProductCard';
import ProductCardSkeleton from '@components/product/ProductCardSkeleton';
import { useState } from 'react';
import CartProductRecommendEmpty from './CartProductRecommendEmpty';

interface CartProductRecommendProps extends ReturnType<typeof useCart> {
  isLoading?: boolean;
}

export default function CartProductRecommend({
  products,
  productsLoading,
  refreshProducts,
  isLoading = false,
}: CartProductRecommendProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProducts(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading || productsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <CartProductRecommendEmpty onRefresh={handleRefresh} isRefreshing={isRefreshing} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {products.slice(0, 6).map((item) => (
        <ProductCard
          key={item.id}
          id={item.id}
          image={item.thumbnail}
          name={item.name}
          price={item.currentPrice}
          brand={item.brand}
          shortDescription={item.shortDescription}
          verified={item.verified}
          sellerShopName={item.sellerShopName}
        />
      ))}
    </div>
  );
}
