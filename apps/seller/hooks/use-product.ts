'use client';
import { productApi, TProduct } from '@/service/product.api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface FilterState {
  search: string;
  status: string;
  verified: string;
  category: string;
  brand: string;
  priceRange: string;
}

export default function useProduct() {
  const [productList, setProductList] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: '',
    verified: '',
    category: '',
    brand: '',
    priceRange: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      const queryBuilder = new URLSearchParams();
      if (filter.search) {
        queryBuilder.set('search', filter.search);
      }
      if (filter.status) {
        queryBuilder.set('status', filter.status);
      }
      if (filter.verified) {
        queryBuilder.set('verified', filter.verified);
      }
      if (filter.category) {
        queryBuilder.set('category', filter.category);
      }
      if (filter.brand) {
        queryBuilder.set('brand', filter.brand);
      }
      if (filter.priceRange) {
        queryBuilder.set('basePrice', filter.priceRange);
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
      status: '',
      verified: '',
      category: '',
      brand: '',
      priceRange: '',
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      if (filter.search && !product.name.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }

      if (filter.status && product.status !== filter.status) {
        return false;
      }

      if (filter.verified) {
        const isVerified = filter.verified === 'true';
        if (product.verified !== isVerified) {
          return false;
        }
      }

      if (filter.category && !product.categories.some((c) => c.name === filter.category)) {
        return false;
      }

      if (filter.brand && product.brand !== filter.brand) {
        return false;
      }

      if (filter.priceRange) {
        const [min, max] = filter.priceRange.split('-').map(Number);
        if (
          min !== undefined &&
          max !== undefined &&
          (product.currentPrice < min || product.currentPrice > max)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [productList, filter]);

  const filterOptions = useMemo(() => {
    const brands = [...new Set(productList.map((p) => p.brand))];
    const categories = [...new Set(productList.flatMap((p) => p.categories.map((c) => c.name)))];
    return {
      brands,
      categories,
      priceRanges: [
        { label: 'Dưới 100,000đ', value: '0-100000' },
        { label: '100,000đ - 500,000đ', value: '100000-500000' },
        { label: '500,000đ - 1,000,000đ', value: '500000-1000000' },
        { label: '1,000,000đ - 5,000,000đ', value: '1000000-5000000' },
        { label: 'Trên 5,000,000đ', value: '5000000-999999999' },
      ],
    };
  }, [productList]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filter).filter((value) => value !== '').length;
  }, [filter]);

  const stats = useMemo(() => {
    const totalProducts = productList.length;
    const activeProducts = productList.filter((p) => p.status === 'ACTIVE').length;
    const verifiedProducts = productList.filter((p) => p.verified).length;
    const totalValue = productList.reduce((sum, p) => sum + p.currentPrice * p.quantity, 0);

    return {
      totalProducts,
      activeProducts,
      verifiedProducts,
      totalValue,
    };
  }, [productList]);

  return {
    productList,
    filteredProducts,
    filterOptions,
    filter,
    setFilter,
    activeFiltersCount,
    stats,
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
  };
}
