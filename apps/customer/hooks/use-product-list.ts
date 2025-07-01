'use client';

import { productApi, TProduct, TProductFilter } from '@/services/product.api';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export type TFilterSelected = {
  states: string[];
  categories: string[];
  seller: string;
  brands: string[];
  priceRange: number;
};
export function useProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<TProduct[]>([]);
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
    priceRange: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [isPaginating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const keyword = searchParams.get('keyword') || '';
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const PAGE_SIZE = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (keyword) params.append('keyword', keyword);
      if (selectedFilter.states.length)
        selectedFilter.states.forEach((s) => params.append('states', s));
      if (selectedFilter.categories.length)
        selectedFilter.categories.forEach((c) => params.append('categories', c));
      if (selectedFilter.brands.length)
        selectedFilter.brands.forEach((b) => params.append('brands', b));
      if (selectedFilter.seller) params.append('seller', selectedFilter.seller);
      if (selectedFilter.priceRange)
        params.append('currentPrice', `0..${selectedFilter.priceRange}`);

      const response = await productApi.searchProducts(page - 1, PAGE_SIZE, params.toString());

      setProducts(response.content || []);
      setMaxPage(response.pagination?.totalPages ?? 1);
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

  const handleFilterChange = useCallback((updated: TProductFilter) => {
    setFilter(updated);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectedFilterChange = useCallback(
    (key: keyof TFilterSelected, value: string | string[] | number | number[]) => {
      setSelectedFilter((prev) => {
        const updated = { ...prev };
        if (key === 'seller') {
          if (updated.seller === value) {
            updated.seller = '';
          } else {
            updated.seller = value as string;
          }
        } else if (key === 'priceRange') {
          updated[key] = value as number;
        } else if (Array.isArray(prev[key])) {
          const list = prev[key] as string[];
          updated[key] = list.includes(value as string)
            ? list.filter((item) => item !== value)
            : [...list, value as string];
        }
        return updated;
      });
      setPage(0);
    },
    [],
  );

  const handleFilterReset = useCallback(() => {
    setSelectedFilter({
      states: [],
      categories: [],
      seller: '',
      brands: [],
      priceRange: 0,
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, selectedFilter]);

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);

  return {
    loading,
    isPaginating,
    filterLoading,
    error,
    filterError,
    products,
    filter,
    keyword,
    handleFilterChange,
    handlePageChange,
    handleFilterReset,
    handleSelectedFilterChange,
    selectedFilter,
    setSelectedFilter,
    page,
    setPage,
    maxPage,
    setMaxPage,
  };
}
