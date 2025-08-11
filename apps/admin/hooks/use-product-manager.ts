'use client';

import { productApi, type TProduct, type TProductFilter } from '@/services/product.api';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useRouter
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type TFilterSelected = {
  states: string[];
  categories: string[];
  seller: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
};

interface ApiResponse {
  success: boolean;
  content?: TProduct[];
  pagination?: {
    totalPages: number;
    totalElements: number;
  };
  message?: string;
}

const useProductManager = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Add router for URL manipulation
  const [products, setProducts] = useState<TProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TProductFilter>({
    states: [],
    categoriesAdvanceSearch: [],
    sellers: [],
    brands: [],
    minPrice: 0,
    maxPrice: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState<TFilterSelected>({
    states: [],
    categories: [],
    seller: '',
    brands: [],
    minPrice: 0,
    maxPrice: 0,
  });
  const keyword = searchParams.get('keyword') || '';
  const pageSize = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (selectedFilter.states.length)
        selectedFilter.states.forEach((s) => params.append('state', s));
      if (selectedFilter.categories.length)
        selectedFilter.categories.forEach((c) => params.append('categoryId', c));
      if (selectedFilter.brands.length)
        selectedFilter.brands.forEach((b) => params.append('brand', b));
      if (selectedFilter.seller) params.append('seller', selectedFilter.seller);
      if (selectedFilter.minPrice && selectedFilter.minPrice > 0) {
        if (selectedFilter.maxPrice && selectedFilter.maxPrice > 0) {
          params.append('currentPrice', `${selectedFilter.minPrice}..${selectedFilter.maxPrice}`);
        }
      } else if (selectedFilter.maxPrice && selectedFilter.maxPrice > 0) {
        params.append('currentPrice', `0..${selectedFilter.maxPrice}`);
      }
      params.append('verified', String(true));
      const response = await productApi.searchProducts(page - 1, pageSize, params.toString(), []);

      setProducts(response.content || []);
      setMaxPage(response.pagination?.totalPages ?? 1);
      setTotalProducts(response.pagination?.totalElements ?? 0);
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, selectedFilter]);

  const fetchFilter = useCallback(async () => {
    setFilterLoading(true);
    setFilterError(null);
    try {
      const response = await productApi.getProductFilter(keyword);
      setFilter(response);
    } catch {
      setFilterError('Không thể tải filter. Vui lòng thử lại sau.');
    } finally {
      setFilterLoading(false);
    }
  }, [keyword]);

  const searchProducts = useCallback(
    (searchQuery: string) => {
      setPage(1); // Reset to first page on new search
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('keyword', searchQuery);
      } else {
        params.delete('keyword'); // Remove keyword if empty
      }
      router.push(`?${params.toString()}`); // Update URL
    },
    [router, searchParams],
  );

  const goToPage = useCallback((newPage: number, searchQuery?: string) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((updated: TProductFilter) => {
    setFilter(updated);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterReset = useCallback(() => {
    setSelectedFilter({
      states: [],
      categories: [],
      seller: '',
      brands: [],
      minPrice: 0,
      maxPrice: 0,
    });
    setPage(1);
  }, []);

  const handleSelectedFilterChange = useCallback(
    (key: keyof TFilterSelected, value: string | string[] | number | number[]) => {
      setSelectedFilter((prev) => {
        const updated = { ...prev };
        if (key === 'seller') {
          updated.seller = updated.seller === value ? '' : (value as string);
        } else if (key === 'minPrice' || key === 'maxPrice') {
          updated[key] = value as number;
        } else if (Array.isArray(prev[key])) {
          const list = prev[key] as string[];
          updated[key] = list.includes(value as string)
            ? list.filter((item) => item !== value)
            : [...list, value as string];
        }
        return updated;
      });
      setPage(1);
    },
    [],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);

  const refetch = () => fetchProducts();

  const verifyProduct = async (id: string) => {
    try {
      const result = await productApi.verifyProduct(id);
      if (result.success) {
        await refetch();
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi xác minh sản phẩm';
      toast.error(errorMessage, { position: 'top-right' });
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const unverifyProduct = async (id: string) => {
    try {
      const result = await productApi.unverifyProduct(id);
      if (result.success) {
        await refetch();
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi hủy xác minh sản phẩm';
      toast.error(errorMessage, { position: 'top-right' });
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  return {
    products,
    page,
    maxPage,
    totalProducts,
    loading,
    error,
    filter,
    filterLoading,
    filterError,
    keyword,
    selectedFilter,
    setSelectedFilter,
    fetchProducts,
    fetchFilter,
    refetch,
    searchProducts, // Expose searchProducts
    goToPage, // Added missing goToPage export
    verifyProduct,
    unverifyProduct,
    handleFilterChange,
    handlePageChange,
    handleFilterReset,
    handleSelectedFilterChange,
  };
};

export { useProductManager };
