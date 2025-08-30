'use client';
import { dashboardApi, SellerProductMetricResponse } from '@/service/dashboard.api';
import { productApi, ProductFilterResponse, TProduct } from '@/service/product.api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface RetradeFilterState {
  search: string;
  status: string;
  verified: string;
  category: string;
  brand: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc' | null;
}

export default function useRetradeProduct() {
  const [productList, setProductList] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<ProductFilterResponse | null>(null);
  const [productMetric, setProductMetric] = useState<SellerProductMetricResponse>({
    productActivate: 0,
    productQuantity: 0,
    productApprove: 0,
    totalPrice: 0,
  });
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortState>({ field: '', direction: null });
  const [filter, setFilter] = useState<RetradeFilterState>({
    search: '',
    status: '',
    verified: '',
    category: '',
    brand: '',
    priceRange: '',
    minPrice: 0,
    maxPrice: 0,
  });

  const fetchFilterOptions = useCallback(async () => {
    try {
      const filterData = await productApi.getProductFilter();
      if (filterData) {
        setFilterOptions(filterData);
      }
    } catch (error) {
      toast.error('Lỗi khi tải tùy chọn lọc');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const queryBuilder = new URLSearchParams();
      if (filter.search) {
        queryBuilder.set('keyword', filter.search);
      }
      if (filter.status) {
        queryBuilder.set('status', filter.status);
      }
      if (filter.verified) {
        queryBuilder.set('verified', filter.verified);
      }
      if (filter.category) {
        queryBuilder.set('categoryId', filter.category);
      }
      if (filter.brand) {
        queryBuilder.set('brand', filter.brand);
      }
      if (filter.priceRange) {
        const [min, max] = filter.priceRange.split('-');
        queryBuilder.set('currentPrice', `${min}..${max}`);
      }

      setLoading(true);
      const sortParams: { field: string; direction: 'asc' | 'desc' | null }[] =
        sort.field && sort.direction ? [{ field: sort.field, direction: sort.direction }] : [];

      const response = await productApi.getRetradeProducts(
        currentPage - 1,
        pageSize,
        sortParams,
        queryBuilder.toString(),
      );

      if (response.products) {
        setProductList(response.products);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm retrade');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter, sort]);

  const fetchProductMetric = useCallback(async () => {
    try {
      const response = await dashboardApi().fetchSellerProductMetric();
      if (response) {
        setProductMetric(response);
      }
    } catch (error) {
      console.error('Error fetching product metrics:', error);
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProducts();
      toast.success('Đã làm mới danh sách sản phẩm retrade');
    } catch (error) {
      toast.error('Lỗi khi làm mới danh sách sản phẩm');
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setFilter({
      search: '',
      status: '',
      verified: '',
      category: '',
      brand: '',
      priceRange: '',
      minPrice: 0,
      maxPrice: 0,
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchFilterOptions();
  }, [fetchProducts, fetchFilterOptions]);

  useEffect(() => {
    fetchProducts();
  }, [filter, currentPage, pageSize, sort, fetchProducts]);

  useEffect(() => {
    fetchProductMetric();
  }, [fetchProductMetric]);

  type PriceRange = { label: string; value: string };

  function generatePriceRanges(minPrice: number, maxPrice: number): PriceRange[] {
    const ranges: PriceRange[] = [];
    const step = Math.ceil((maxPrice - minPrice) / 5);

    for (let i = 0; i < 5; i++) {
      const start = minPrice + step * i;
      const end = i === 4 ? maxPrice : start + step;

      const label =
        i === 4
          ? `Trên ${formatCurrency(start)}`
          : `${formatCurrency(start)} - ${formatCurrency(end)}`;
      const value = `${start}-${end}`;

      ranges.push({ label, value });
    }

    return ranges;
  }

  function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    });
  }

  const availableFilterOptions = useMemo(() => {
    const maxPrice = filterOptions?.maxPrice || 10000000;
    const minPrice = filterOptions?.minPrice || 0;
    const brands = filterOptions?.brands || [];
    const categories = filterOptions?.categoriesAdvanceSearch || [];
    const states = filterOptions?.states || [];

    const priceRanges = generatePriceRanges(minPrice, maxPrice);

    return {
      brands,
      categories,
      states,
      minPrice,
      maxPrice,
      priceRanges,
    };
  }, [filterOptions]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filter).filter(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'minPrice' || key === 'maxPrice') return value !== 0;
      return value !== '';
    }).length;
  }, [filter]);

  const handleSortChange = (field: string) => {
    if (sort.field === field) {
      const nextDirection =
        sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc';
      setSort({ field, direction: nextDirection });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  return {
    productList,
    setProductList,
    filterOptions: availableFilterOptions,
    filter,
    setFilter,
    activeFiltersCount,
    loading,
    showFilters,
    refreshing,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setShowFilters,
    setRefreshing,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    clearFilters,
    fetchProducts,
    productMetric,
    sort,
    setSort,
    handleSortChange,
  };
}
