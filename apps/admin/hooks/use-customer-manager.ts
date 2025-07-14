'use client';

import {
  disableCustomer,
  enableCustomer,
  getCustomer,
  TCustomerProfile,
} from '@/services/customer.api';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useCustomerManager = () => {
  const [customers, setCustomers] = useState<TCustomerProfile[]>([]);
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
      const result = await getCustomer(page, pageSize, searchQuery);
      if (result?.success) {
        setCustomers(result.content || []);
        setTotal(result.content?.length || 0);
      } else {
        setCustomers([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  const handleDisableCustomer = useCallback(
    async (id: string) => {
      try {
        const result = await disableCustomer(id);
        if (result?.success) {
          await fetchSeller();
          return true;
        }
        setError('Failed to disable customer');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to disable customer');
        return false;
      }
    },
    [fetchSeller],
  );

  const handleEnableCustomer = useCallback(
    async (id: string) => {
      try {
        const result = await enableCustomer(id);
        if (result?.success) {
          await fetchSeller();
          return true;
        }
        setError('Failed to enable customer');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to enable customer');
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
      verified: customers?.filter((customer) => customer.enabled)?.length || 0,
      pending: customers?.filter((customer) => !customer.enabled)?.length || 0,
    }),
    [customers, total],
  );

  return {
    page,
    setPage,
    customers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    pageSize,
    stats,
    refresh: fetchSeller,
    disableCustomer: handleDisableCustomer,
    enableCustomer: handleEnableCustomer,
  };
};

export { useCustomerManager };
