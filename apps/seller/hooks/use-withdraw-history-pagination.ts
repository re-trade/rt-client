'use client';
import { walletApi, WithdrawHistoryResponse } from '@/service/wallet.api';
import { useCallback, useEffect, useState } from 'react';

export function useWithdrawHistoryPagination() {
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistoryResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchWithdrawHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.getWithdrawHistoryPaginated(
        page - 1,
        pageSize,
        debouncedSearchTerm,
      );

      setWithdrawHistory(response.withdrawHistory);
      setTotal(response.totalElements);
      setTotalPage(response.totalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Lỗi khi tải lịch sử rút tiền: ${errorMessage}`);
      setWithdrawHistory([]);
      setTotalPage(1);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchWithdrawHistory();
  }, [fetchWithdrawHistory]);

  return {
    withdrawHistory,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
    fetchWithdrawHistory,
    handleSearch,
    handleKeyPress,
  };
}
