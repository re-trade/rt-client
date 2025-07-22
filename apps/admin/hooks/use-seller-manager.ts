'use client';

import { banSeller, getSellers, TSellerProfile, unbanSeller } from '@/services/seller.api';
import { useCallback, useEffect, useState } from 'react';

const useSellerManager = () => {
  const [sellers, setSellers] = useState<TSellerProfile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalSellers, setTotalSellers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchSellers = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSellers((customPage ?? page) - 1, pageSize, searchQuery);

        if (response && response.success) {
          setSellers(response.content || []);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalSellers(response.pagination?.totalElements ?? response.content?.length ?? 0);
        } else {
          setSellers([]);
          setMaxPage(1);
          setTotalSellers(0);
          setError(response?.message || 'Fail to get sellers');
        }
      } catch (err) {
        setSellers([]);
        setMaxPage(1);
        setTotalSellers(0);
        setError(err instanceof Error ? err.message : 'Fail to get sellers');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const refetch = () => fetchSellers();
  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fetchSellers(searchQuery, newPage);
  };
  const searchSellers = (searchQuery: string) => {
    setPage(1);
    fetchSellers(searchQuery, 1);
  };

  const handleBanSeller = useCallback(
    async (id: string) => {
      try {
        const result = await banSeller(id);
        if (result?.success) {
          await fetchSellers();
          return true;
        }
        setError('Failed to ban seller');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to ban seller');
        return false;
      }
    },
    [fetchSellers],
  );

  const handleUnbanSeller = useCallback(
    async (id: string) => {
      try {
        const result = await unbanSeller(id);
        if (result?.success) {
          await fetchSellers();
          return true;
        }
        setError('Failed to unban seller');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unban seller');
        return false;
      }
    },
    [fetchSellers],
  );

  return {
    sellers,
    page,
    maxPage,
    totalSellers,
    loading,
    error,
    refetch,
    goToPage,
    searchSellers,
    handleBanSeller,
    handleUnbanSeller,
  };
};

export { useSellerManager };
