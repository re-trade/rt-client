'use client';

import { getSellers, TSellerProfile } from '@/services/seller.api';
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
      console.log(result);
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
  };
};

export { useSellerManager };
