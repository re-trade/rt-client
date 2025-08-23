'use client';
import { revenueApi, RevenueResponse } from '@/service/revenue.api';
import { useCallback, useEffect, useState } from 'react';

export function useRevenuePagination() {
  const [revenues, setRevenues] = useState<RevenueResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRevenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await revenueApi.getRevenueBySeller(
        page - 1,
        pageSize,
        debouncedSearchTerm,
        statusFilter,
      );

      setRevenues(response.revenues);
      setTotal(response.totalElements);
      setTotalPage(response.totalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Lỗi khi tải dữ liệu doanh thu: ${errorMessage}`);
      setRevenues([]);
      setTotalPage(1);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm, statusFilter]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, [fetchRevenues]);

  return {
    revenues,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    statusFilter,
    setPage,
    setPageSize,
    setSearchTerm,
    setStatusFilter,
    fetchRevenues,
    handleSearch,
    handleKeyPress,
  };
}
