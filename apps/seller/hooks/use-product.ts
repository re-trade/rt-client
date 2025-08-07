'use client';
import { dashboardApi, SellerProductMetricResponse } from '@/service/dashboard.api';
import { productApi, ProductFilterResponse, TProduct } from '@/service/product.api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface FilterState {
  search: string;
  status: string;
  verified: string;
  category: string;
  brand: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
}

export default function useProduct() {
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
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: 'all',
    verified: 'all',
    category: 'all',
    brand: 'all',
    priceRange: 'all',
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
      console.error('Error fetching filter options:', error);
      toast.error('Lỗi khi tải tùy chọn lọc');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const queryBuilder = new URLSearchParams();
      if (filter.search) {
        queryBuilder.set('keyword', filter.search);
      }
      if (filter.status && filter.status !== 'all') {
        queryBuilder.set('status', filter.status);
      }
      if (filter.verified && filter.verified !== 'all') {
        queryBuilder.set('verified', filter.verified);
      }
      if (filter.category && filter.category !== 'all') {
        queryBuilder.set('categoryId', filter.category);
      }
      if (filter.brand && filter.brand !== 'all') {
        queryBuilder.set('brand', filter.brand);
      }
      if (filter.priceRange && filter.priceRange !== 'all') {
        const [min, max] = filter.priceRange.split('-');
        queryBuilder.set('currentPrice', `${min}..${max}`);
      }
      setLoading(true);
      const query = queryBuilder.toString();
      const response = await productApi.getProducts(
        currentPage - 1,
        pageSize,
        query ? query : undefined,
      );
      if (response.products) {
        setProductList(response.products);
        setTotalPages(response.totalPages);
        setTotalItems(response.totalElements);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter]);

  const fetchProductMetric = useCallback(async () => {
    const response = await dashboardApi().fetchSellerProductMetric();
    if (response) {
      setProductMetric(response);
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
      toast.success('Đã làm mới danh sách sản phẩm');
    } catch (error) {
      console.error('Error refreshing products:', error);
      toast.error('Lỗi khi làm mới danh sách sản phẩm');
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setFilter({
      search: '',
      status: 'all',
      verified: 'all',
      category: 'all',
      brand: 'all',
      priceRange: 'all',
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
  }, [filter, currentPage, pageSize, fetchProducts]);

  useEffect(() => {
    fetchProductMetric();
  }, [fetchProductMetric]);

  const availableFilterOptions = useMemo(() => {
    const maxPrice = filterOptions?.maxPrice || 10000000;
    const minPrice = filterOptions?.minPrice || 0;
    const brands = filterOptions?.brands || [];
    const categories = filterOptions?.categoriesAdvanceSearch || [];
    const states = filterOptions?.states || [];

    return {
      brands,
      categories,
      states,
      minPrice,
      maxPrice,
      priceRanges: [
        { label: 'Dưới 100,000đ', value: `0-${Math.min(100000, maxPrice)}` },
        { label: '100,000đ - 500,000đ', value: '100000-500000' },
        { label: '500,000đ - 1,000,000đ', value: '500000-1000000' },
        { label: '1,000,000đ - 5,000,000đ', value: '1000000-5000000' },
        { label: `Trên 5,000,000đ`, value: `5000000-${maxPrice}` },
      ],
    };
  }, [filterOptions]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filter).filter(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'minPrice' || key === 'maxPrice') return value !== 0;
      return value !== 'all';
    }).length;
  }, [filter]);

  return {
    productList,
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
  };
}
