'use client';

import {
  disableCustomer,
  enableCustomer,
  getCustomers,
  TCustomerProfile,
} from '@/services/customer.api';
import { useCallback, useEffect, useState } from 'react';

const useCustomerManager = () => {
  const [customers, setCustomers] = useState<TCustomerProfile[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchCustomers = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCustomers((customPage ?? page) - 1, pageSize, searchQuery);

        if (response && response.success) {
          setCustomers(response.content || []);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalCustomers(response.pagination?.totalElements ?? response.content?.length ?? 0);
        } else {
          setCustomers([]);
          setMaxPage(1);
          setTotalCustomers(0);
          setError(response?.message || 'Failed to get customers');
        }
      } catch (err) {
        setCustomers([]);
        setMaxPage(1);
        setTotalCustomers(0);
        setError(err instanceof Error ? err.message : 'Failed to get customers');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const refetch = () => fetchCustomers();
  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fetchCustomers(searchQuery, newPage);
  };
  const searchCustomers = (searchQuery: string) => {
    setPage(1);
    fetchCustomers(searchQuery, 1);
  };

  const handleBanCustomer = useCallback(
    async (id: string) => {
      try {
        const result = await disableCustomer(id);
        if (result?.success) {
          await fetchCustomers();
          return true;
        }
        setError('Failed to ban customer');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to ban customer');
        return false;
      }
    },
    [fetchCustomers],
  );

  const handleUnbanCustomer = useCallback(
    async (id: string) => {
      try {
        const result = await enableCustomer(id);
        if (result?.success) {
          await fetchCustomers();
          return true;
        }
        setError('Failed to unban customer');
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unban customer');
        return false;
      }
    },
    [fetchCustomers],
  );

  return {
    customers,
    page,
    maxPage,
    totalCustomers,
    loading,
    error,
    refetch,
    goToPage,
    searchCustomers,
    handleBanCustomer,
    handleUnbanCustomer,
  };
};

export { useCustomerManager };
