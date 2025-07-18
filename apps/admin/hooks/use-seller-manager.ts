'use client';

import { banSeller, getSellers, TSellerProfile, unbanSeller } from '@/services/seller.api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useSellerManager = () => {
  const [sellers, setSellers] = useState<TSellerProfile[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;

  const fetchSeller = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSellers(page, pageSize, searchQuery);
      if (result?.success) {
        setSellers(result.content || []);
        setTotal(result.content?.length || 0);
      } else {
        setSellers([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sellers');
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  const handleBanSeller = useCallback(
    async (id: string) => {
      try {
        const result = await banSeller(id);
        if (result?.success) {
          await fetchSeller();
          return true;
        }
        setError('Failed to ban seller');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to ban seller');
        return false;
      }
    },
    [fetchSeller],
  );

  const handleUnbanSeller = useCallback(
    async (id: string) => {
      try {
        const result = await unbanSeller(id);
        if (result?.success) {
          await fetchSeller();
          return true;
        }
        setError('Failed to unban seller');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unban seller');
        return false;
      }
    },
    [fetchSeller],
  );

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  const stats = useMemo(
    () => ({
      total: total,
      verified: sellers?.filter((seller) => seller.verified)?.length || 0,
      pending: sellers?.filter((seller) => !seller.verified)?.length || 0,
    }),
    [sellers, total],
  );

  return {
    page,
    setPage,
    sellers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    pageSize,
    stats,
    refresh: fetchSeller,
    banSeller: handleBanSeller,
    unbanSeller: handleUnbanSeller,
  };
};

export { useSellerManager };
