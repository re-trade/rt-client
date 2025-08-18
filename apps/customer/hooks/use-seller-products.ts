'use client';

import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

export function useSellerProducts(sellerId: string) {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isPaginating, setIsPaginating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const PAGE_SIZE = 8;

  const fetchProducts = useCallback(async () => {
    if (page === 1) {
      setLoading(true);
    } else {
      setIsPaginating(true);
    }
    setError(null);

    try {
      const response = await productApi.getProductsBySeller(
        sellerId,
        page - 1,
        PAGE_SIZE,
        searchQuery,
      );
      if (response.success) {
        setProducts(response.content || []);
        setTotalPages(response.pagination?.totalPages ?? 1);
        setTotalElements(response.pagination?.totalElements ?? response.content?.length ?? 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải sản phẩm. Vui lòng thử lại sau.',
      );
      setProducts([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
      setIsPaginating(false);
    }
  }, [sellerId, page, searchQuery]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    setPage(1);
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [fetchProducts, sellerId]);

  return {
    products,
    loading,
    isPaginating,
    error,
    page,
    totalPages,
    totalElements,
    searchQuery,
    handlePageChange,
    handleSearch,
    refresh,
  };
}
