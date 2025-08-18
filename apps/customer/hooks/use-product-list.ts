'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { productApi, TProduct, TProductFilter } from '@/services/product.api';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export type TFilterSelected = {
  states: string[];
  categories: string[];
  seller: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
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
    minPrice: 0,
    maxPrice: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [isPaginating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const keyword = searchParams.get('keyword') || '';
  const [page, setPage] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const PAGE_SIZE = 9;

  // Debounce the selected filter to prevent excessive API calls during rapid changes
  const debouncedSelectedFilter = useDebounce(selectedFilter, 400);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (keyword) params.append('keyword', keyword);
      if (debouncedSelectedFilter.states.length)
        debouncedSelectedFilter.states.forEach((s) => params.append('state', s));
      if (debouncedSelectedFilter.categories.length)
        debouncedSelectedFilter.categories.forEach((c) => params.append('categoryId', c));
      if (debouncedSelectedFilter.brands.length)
        debouncedSelectedFilter.brands.forEach((b) => params.append('brand', b));
      if (debouncedSelectedFilter.seller) params.append('seller', debouncedSelectedFilter.seller);
      if (debouncedSelectedFilter.minPrice && debouncedSelectedFilter.minPrice > 0) {
        if (debouncedSelectedFilter.maxPrice && debouncedSelectedFilter.maxPrice > 0) {
          params.append(
            'currentPrice',
            `${debouncedSelectedFilter.minPrice}..${debouncedSelectedFilter.maxPrice}`,
          );
        }
      } else if (debouncedSelectedFilter.maxPrice && debouncedSelectedFilter.maxPrice > 0) {
        params.append('currentPrice', `0..${debouncedSelectedFilter.maxPrice}`);
      }
      params.append('verified', String(true));
      const response = await productApi.searchProducts(page - 1, PAGE_SIZE, params.toString(), []);

      setProducts(response.content || []);
      setTotalPages(response.pagination?.totalPages ?? 1);
      setTotalElements(response.pagination?.totalElements ?? response.content?.length ?? 0);
    } catch {
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [keyword, page, debouncedSelectedFilter]);

  const fetchFilter = useCallback(async () => {
    setFilterLoading(true);
    setFilterError(null);
    try {
      const filterResponse = await productApi.getProductFilter(keyword);
      setFilter(filterResponse);
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

  // Return filter as-is since count filtering is removed from API
  const getValidatedFilter = useCallback((): TProductFilter => {
    return filter;
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    filter: getValidatedFilter(),
    keyword,
    handleFilterChange,
    handlePageChange,
    handleFilterReset,
    handleSelectedFilterChange,
    selectedFilter,
    setSelectedFilter,
    page,
    setPage,
    totalElements,
    totalPages,
  };
}
