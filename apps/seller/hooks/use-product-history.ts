'use client';

import { productHistoryApi, TProductHistory } from '@/service/product-history.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseProductHistoryResult {
  productHistory: TProductHistory[];
  isLoading: boolean;
  error: string | null;
  refreshProductHistory: () => Promise<void>;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  changePage: (newPage: number) => void;
  changePageSize: (newSize: number) => void;
}

export default function useProductHistory(
  productId: string,
  initialPage: number = 0,
  initialPageSize: number = 10,
): UseProductHistoryResult {
  const [productHistory, setProductHistory] = useState<TProductHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalElements: 0,
    currentPage: 1,
    pageSize: initialPageSize,
  });

  const fetchProductHistory = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await productHistoryApi.getProductHistoryPaginated(productId, page, pageSize);
      setProductHistory(result.histories);
      setPagination({
        totalPages: result.totalPages,
        totalElements: result.totalElements,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử sản phẩm');
      toast.error('Không thể tải lịch sử sản phẩm', {
        description: 'Đã xảy ra lỗi khi tải dữ liệu lịch sử sản phẩm.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [productId, page, pageSize]);

  useEffect(() => {
    fetchProductHistory();
  }, [fetchProductHistory]);

  const changePage = (newPage: number) => {
    setPage(newPage - 1); // API uses 0-based indexing, but we present 1-based to users
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  const refreshProductHistory = async () => {
    await fetchProductHistory();
  };

  return {
    productHistory,
    isLoading,
    error,
    refreshProductHistory,
    pagination,
    changePage,
    changePageSize,
  };
}
