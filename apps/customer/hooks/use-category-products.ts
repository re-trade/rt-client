'use client';

import { Category, getCategoryByIdInternal } from '@/services/category.api';
import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useCategoryProducts(categoryId: string) {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaginating, setIsPaginating] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const PAGE_SIZE = 12;

  const fetchCategoryInfo = useCallback(async () => {
    try {
      const response = await getCategoryByIdInternal(categoryId);
      setCategoryInfo(response);
    } catch {
      setError('Không thể tải thông tin danh mục. Vui lòng thử lại sau.');
    }
  }, [categoryId]);

  const fetchProducts = useCallback(async () => {
    if (page === 1 && !debouncedSearchTerm) {
      setLoading(true);
    } else if (page === 1 && debouncedSearchTerm) {
      setSearchLoading(true);
    } else {
      setIsPaginating(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('categoryId', categoryId);
      params.append('verified', String(true));

      if (debouncedSearchTerm) {
        params.append('keyword', debouncedSearchTerm);
      }

      const response = await productApi.searchProducts(page - 1, PAGE_SIZE, params.toString(), []);

      setProducts(response.content || []);
      setMaxPage(response.pagination?.totalPages ?? 1);
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setIsPaginating(false);
      setSearchLoading(false);
    }
  }, [categoryId, page, debouncedSearchTerm]);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
      fetchCategoryInfo();
    }
  }, [categoryId, fetchProducts, fetchCategoryInfo]);

  return {
    loading,
    isPaginating,
    searchLoading,
    error,
    products,
    categoryInfo,
    handlePageChange,
    handleSearchChange,
    clearSearch,
    searchTerm,
    page,
    maxPage,
  };
}
