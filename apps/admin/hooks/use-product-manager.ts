'use client';

import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

const useProductManager = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const response = await productApi.searchProducts(page - 1, 10);
    if (!response.success) {
      setProducts([]);
    }
    setProducts(response.content || []);
    setMaxPage(response.pagination?.totalPages ?? 1);
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    page,
    maxPage,
  };
};

export { useProductManager };
