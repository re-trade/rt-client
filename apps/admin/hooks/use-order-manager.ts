'use client';

import { orderApi, TOrder} from '@/services/order.api';
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

export { useOrderManager };
