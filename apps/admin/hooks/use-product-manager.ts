'use client';

import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

const useProductManager = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchProducts = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await productApi.getAllProducts(
          (customPage ?? page) - 1,
          pageSize,
          searchQuery,
        );
        if (response.success) {
          setProducts(response.content as any);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalProducts(response.pagination?.totalElements ?? 0);
        } else {
          setProducts([]);
          setMaxPage(1);
          setTotalProducts(0);
          setError(response.message || 'Lỗi khi tải sản phẩm');
        }
      } catch (err) {
        setProducts([]);
        setMaxPage(1);
        setTotalProducts(0);
        setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = () => fetchProducts();
  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fetchProducts(searchQuery, newPage);
  };
  const searchProducts = (searchQuery: string) => {
    setPage(1);
    fetchProducts(searchQuery, 1);
  };

  // TODO: Implement deleteProduct, verifyProduct, unverifyProduct if needed

  return {
    products,
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    refetch,
    goToPage,
    searchProducts,
    // deleteProduct,
    // verifyProduct,
    // unverifyProduct,
  };
};

export { useProductManager };
