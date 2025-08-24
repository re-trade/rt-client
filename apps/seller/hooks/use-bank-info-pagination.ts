'use client';
import { BankInfor, walletApi } from '@/service/wallet.api';
import { useCallback, useEffect, useState } from 'react';

export function useBankInfoPagination() {
  const [bankInfos, setBankInfos] = useState<BankInfor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
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

  const fetchBankInfos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await walletApi.getBankInfosPaginated(
        page - 1,
        pageSize,
        debouncedSearchTerm,
      );

      setBankInfos(response.bankInfos);
      setTotal(response.totalElements);
      setTotalPage(response.totalPages);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Lỗi khi tải thông tin ngân hàng: ${errorMessage}`);
      setBankInfos([]);
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

  const refreshBankInfos = () => {
    fetchBankInfos();
  };

  useEffect(() => {
    fetchBankInfos();
  }, [fetchBankInfos]);

  return {
    bankInfos,
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
    setBankInfos,
    fetchBankInfos,
    refreshBankInfos,
    handleSearch,
    handleKeyPress,
  };
}
