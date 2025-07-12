'use client';

import { productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

const useProductManager = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (currentPage: number = page, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Tính toán page cho API (API sử dụng 0-based indexing)
      const apiPage = currentPage - 1;
      const pageSize = 10; // 10 sản phẩm mỗi trang
      
      // Sử dụng API mới getAllProducts với pagination và search
      const response = await productApi.getAllProducts(apiPage, pageSize, searchQuery);
      
      if (response.success) {
        setProducts(response.content || []);
        setTotalProducts(response.pagination?.totalElements || 0);
        setMaxPage(response.pagination?.totalPages || 1);
        setPage(currentPage);
      } else {
        setProducts([]);
        setError(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((newPage: number, searchQuery?: string) => {
    if (newPage >= 1 && newPage <= maxPage) {
      fetchProducts(newPage, searchQuery);
    }
  }, [maxPage, fetchProducts]);

  const searchProducts = useCallback((query: string) => {
    fetchProducts(1, query); // Reset về trang 1 khi search
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(1); // Load trang đầu tiên khi component mount
  }, []);

  return {
    products,
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    refetch: () => fetchProducts(page),
    goToPage,
    searchProducts,
  };
};

export { useProductManager };
