'use client';
import { productApi, TProduct } from '@/services/product.api';
import ProductCard from '@components/product/ProductCard';
import { useEffect, useState } from 'react';

export default function RelatedProducts() {
  const [products, setProducts] = useState<TProduct[]>([]);
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await productApi.getProducts(0, 4);
      setProducts(response);
    };
    fetchProduct();
  });

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
