'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { productApi, TProduct } from '@/services/product.api';
import ProductFilter from '@/components/common/FillterProduct';
import { StoreIcon, SparklesIcon, TagIcon, BadgeCheckIcon } from 'lucide-react';
export default function ProductListPage() {
  const [filter, setFilter] = useState({
    name: '',
    categories: [],
    brands: [],
  });

  const [products, setProducts] = useState<TProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const listProduct = await productApi.getProducts();
      setProducts(listProduct);
    };
    fetchProducts();
  }, []);
  console.log('Products:', products);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  // Lọc sản phẩm theo filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.name
        ?.toLowerCase()
        .includes(filter.name.toLowerCase());
      const matchesBrand =
        filter.brands.length === 0 || filter.brands.includes(product.brand);
      // Nếu bạn có categories trong TProduct, hãy lọc theo nó ở đây
      return matchesName && matchesBrand;
    });
  }, [products, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-4 space-y-6 bg-white p-6 rounded-xl shadow-sm">
            <ProductFilter filter={filter} onChange={handleFilterChange} />
          </div>
        </aside>

        <main className="md:col-span-3">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Products ({filteredProducts.length})
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
              >
                <div className="relative h-48">
                  {/* Product Image */}
                  <Image
                    src={product.thumbnail || '/placeholder.jpg'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover"
                  />

                  {/* Discount Badge */}
                  {product.discount !== '0%' && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                      -{product.discount}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{product.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 gap-1">
                    <BadgeCheckIcon className="w-4 h-4 text-blue-500" />
                    <span>Thương hiệu: {product.brand}</span>
                  </div>

                  {/* Store Name with Icon */}
                  <div className="flex items-center text-sm text-gray-600 gap-1">
                    <StoreIcon className="w-4 h-4 text-purple-500" />
                    <span>{product.sellerShopName}</span>
                  </div>

                  {/* Price */}
                  <p className="text-red-600 font-bold text-lg pt-2">
                    {(product.currentPrice || 0).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
