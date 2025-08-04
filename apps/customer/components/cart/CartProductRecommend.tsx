'use client';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@components/product/ProductCard';

export default function CartProductRecommend({ products }: ReturnType<typeof useCart>) {
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
