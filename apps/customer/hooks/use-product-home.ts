'use client';
import { Category, getCategoriesInternal } from '@/services/category.api';
import { HomeStats, productApi, TProduct } from '@/services/product.api';
import { useCallback, useEffect, useState } from 'react';

export function useProductHome() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<TProduct[]>([]);
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await getCategoriesInternal({
        visible: true,
        size: 50,
      });
      setCategories(response.content || []);
    } catch {
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (categoryId?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (categoryId) {
        params.set('categoryId', categoryId.toString());
      }

      params.set('verified', 'true');

      const response = await productApi.searchProducts(0, 8, params.toString());
      const products = response.content || [];
      setProducts(products);
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHomeStats = useCallback(async () => {
    const homeStatsResponse = await productApi.getHomeStats();
    if (homeStatsResponse) {
      setHomeStats(homeStatsResponse);
    }
  }, []);

  const fetchProductBestSeller = useCallback(async () => {
    const response = await productApi.getproductBestSellers();
    if (response) {
      setBestSellerProducts(response);
    }
  }, []);

  const selectCategory = useCallback(
    (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
      fetchProducts(categoryId);
    },
    [fetchProducts],
  );

  const refetch = useCallback(() => {
    fetchProducts(selectedCategoryId);
  }, [fetchProducts, selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchHomeStats();
    fetchProductBestSeller();
  }, [fetchCategories, fetchProducts, fetchHomeStats, fetchProductBestSeller]);

  return {
    loading,
    categoriesLoading,
    error,
    products,
    categories,
    selectedCategoryId,
    selectCategory,
    bestSellerProducts,
    refetch,
    homeStats,
  };
}
