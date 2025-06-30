'use client';

import { productApi, TProduct, TProductFilter } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

export function useProductList() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [allProducts, setAllProducts] = useState<TProduct[]>([]);
  const [filter, setFilter] = useState<TProductFilter>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [isPaginating, setIsPaginating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  const PAGE_SIZE = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.searchProducts(0, PAGE_SIZE);
      const products = response || [];
      setProducts(products);
      setAllProducts(products);
      setPage(0);
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchFilter = useCallback(async () => {
    setFilterLoading(true);
    setFilterError(null);
    try {
      const response = await productApi.getProductFilter(keywords);
      setFilter(response);
    } catch {
      setFilterError('Không thể tải filter. Vui lòng thử lại sau.');
    } finally {
      setFilterLoading(false);
    }
  }, [keywords]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = useCallback((updated: TProductFilter) => {
    setFilter(updated);
  }, []);

  const loadMore = useCallback(async () => {
    setIsPaginating(true);
    try {
      const nextPage = page;
      const response = await productApi.searchProducts(nextPage, PAGE_SIZE, filter);
      const moreProducts = response || [];
      setAllProducts((prev) => [...prev, ...moreProducts]);
      setPage((prev) => prev + 1);
    } catch {
      setError('Không thể tải thêm sản phẩm.');
    } finally {
      setIsPaginating(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchProducts();
    fetchFilter();
  }, [fetchProducts, fetchFilter]);

  return {
    loading,
    isPaginating,
    filterLoading,
    error,
    filterError,
    products,
    allProducts,
    filter,
    keywords,
    setKeywords,
    handleFilterChange,
    refetch,
    loadMore,
  };
}
