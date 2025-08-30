'use client';

import { orderApi, TOrder, TOrderCombo } from '@/services/order.api';
import { useCallback, useEffect, useState } from 'react';

const useOrderManager = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchOrders = useCallback(
    async (searchQuery?: string, customPage?: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderApi.getAllOrders(
          (customPage ?? page) - 1,
          pageSize,
          searchQuery,
        );
        if (response.success) {
          setOrders(response.content as any);
          setMaxPage(response.pagination?.totalPages ?? 1);
          setTotalOrders(response.pagination?.totalElements ?? 0);
        } else {
          setOrders([]);
          setMaxPage(1);
          setTotalOrders(0);
          setError(response.message || 'Lỗi khi tải đơn hàng');
        }
      } catch (err) {
        setOrders([]);
        setMaxPage(1);
        setTotalOrders(0);
        setError(err instanceof Error ? err.message : 'Lỗi khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    },
    [page],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refetch = () => fetchOrders();
  const goToPage = (newPage: number, searchQuery?: string) => {
    setPage(newPage);
    fetchOrders(searchQuery, newPage);
  };
  const searchOrders = (searchQuery: string) => {
    setPage(1);
    fetchOrders(searchQuery, 1);
  };

  const cancelOrder = async (id: string) => {
    try {
      const result = await orderApi.cancelOrder(id);
      if (result) {
        await refetch();
      }
      return result;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Lỗi hoãn đơn hàng',
      };
    }
  };

  return {
    orders,
    page,
    maxPage,
    totalOrders,
    loading,
    error,
    refetch,
    goToPage,
    searchOrders,
    cancelOrder,
  };
};

const useOrderCombo = (comboId?: string) => {
  const [orderCombo, setOrderCombo] = useState<TOrderCombo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderCombo = useCallback(async () => {
    if (!comboId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrderCombo(comboId);
      if (response.success) {
        setOrderCombo(response.content);
      } else {
        setOrderCombo(null);
        setError(response.message || 'Lỗi khi tải thông tin đơn hàng');
      }
    } catch (err) {
      setOrderCombo(null);
      setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [comboId]);

  useEffect(() => {
    if (comboId) {
      fetchOrderCombo();
    }
  }, [fetchOrderCombo, comboId]);

  const refetch = () => fetchOrderCombo();

  return {
    orderCombo,
    loading,
    error,
    refetch,
  };
};

const useOrderComboManager = () => {
  const [orderCombos, setOrderCombos] = useState<TOrderCombo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrderCombos = useCallback(
    async (customPage?: number, customSearch?: string) => {
      setLoading(true);
      setError(null);
      try {
        const searchQuery = customSearch !== undefined ? customSearch : debouncedSearchTerm;
        const currentPage = customPage !== undefined ? customPage : page;

        const response = await orderApi.getAllOrderCombos(
          currentPage - 1,
          pageSize,
          searchQuery || undefined,
        );
        if (response.success) {
          setOrderCombos(response.content.content || []);
          setMaxPage(response.content.totalPages || 1);
          setTotalOrders(response.content.totalElements || 0);
        } else {
          setOrderCombos([]);
          setMaxPage(1);
          setTotalOrders(0);
          setError(response.message || 'Lỗi khi tải đơn hàng');
        }
      } catch (err) {
        setOrderCombos([]);
        setMaxPage(1);
        setTotalOrders(0);
        setError(err instanceof Error ? err.message : 'Lỗi khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    },
    [page, debouncedSearchTerm],
  );

  // Fetch data when debounced search term or page changes
  useEffect(() => {
    fetchOrderCombos();
  }, [fetchOrderCombos]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    if (page !== 1) {
      setPage(1);
    } else {
      fetchOrderCombos(1);
    }
  }, [debouncedSearchTerm]);

  const refetch = () => fetchOrderCombos();

  const goToPage = (newPage: number) => {
    setPage(newPage);
    fetchOrderCombos(newPage);
  };

  const updateSearchFilter = (search: string) => {
    setSearchTerm(search);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    orderCombos,
    page,
    maxPage,
    totalOrders,
    loading,
    error,
    searchTerm,
    refetch,
    goToPage,
    updateSearchFilter,
    clearSearch,
  };
};

export { useOrderCombo, useOrderComboManager, useOrderManager };
