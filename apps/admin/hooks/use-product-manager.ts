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
      const apiPage = currentPage - 1;
      const pageSize = 10;
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

  const goToPage = useCallback(
    (newPage: number, searchQuery?: string) => {
      if (newPage >= 1 && newPage <= maxPage) {
        fetchProducts(newPage, searchQuery);
      }
    },
    [maxPage, fetchProducts],
  );

  const searchProducts = useCallback(
    (query: string) => {
      fetchProducts(1, query);
    },
    [fetchProducts],
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      try {
        const response = await productApi.deleteProduct(productId);
        if (response.success) {
          await fetchProducts(page);
          return { success: true, message: 'Xóa sản phẩm thành công' };
        } else {
          return { success: false, message: response.message || 'Xóa sản phẩm thất bại' };
        }
      } catch (error: any) {
        console.error('Error deleting product:', error);
        let errorMessage = 'Có lỗi xảy ra khi xóa sản phẩm';
        if (
          error.message?.includes('access token') ||
          error.message?.includes('Token expired') ||
          error.message?.includes('Phiên đăng nhập đã hết hạn')
        ) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.';
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else if (error.message?.includes('401')) {
          errorMessage = 'Không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.';
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }
        return { success: false, message: errorMessage };
      }
    },
    [fetchProducts, page],
  );

  const verifyProduct = useCallback(
    async (productId: string) => {
      try {
        const response = await productApi.verifyProduct(productId);
        if (response.success) {
          await fetchProducts(page);
          return { success: true, message: 'Duyệt sản phẩm thành công' };
        } else {
          return { success: false, message: response.message || 'Duyệt sản phẩm thất bại' };
        }
      } catch (error: any) {
        return { success: false, message: error.message || 'Duyệt sản phẩm thất bại' };
      }
    },
    [fetchProducts, page],
  );

  const unverifyProduct = useCallback(
    async (productId: string) => {
      try {
        const response = await productApi.unverifyProduct(productId);
        if (response.success) {
          await fetchProducts(page);
          return { success: true, message: 'Không duyệt sản phẩm thành công' };
        } else {
          return { success: false, message: response.message || 'Không duyệt sản phẩm thất bại' };
        }
      } catch (error: any) {
        return { success: false, message: error.message || 'Không duyệt sản phẩm thất bại' };
      }
    },
    [fetchProducts, page],
  );

  useEffect(() => {
    fetchProducts(1);
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
    deleteProduct,
    verifyProduct,
    unverifyProduct,
  };
};

export { useProductManager };
