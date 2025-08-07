'use client';
import { dashboardApi, OrderMetricResponse } from '@/service/dashboard.api';
import { OrderResponse, ordersApi } from '@/service/orders.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useOrder() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderMetric, setOrderMetric] = useState<OrderMetricResponse>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getAllOrdersBySeller(
        page - 1,
        pageSize,
        debouncedSearchTerm,
        statusFilter,
      );

      if (response && response.orders) {
        setOrders(response.orders);
        setTotal(response.totalElements);
        setTotalPage(response.totalPages);
      } else {
        setOrders([]);
        setTotal(0);
        setTotalPage(1);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Lỗi khi tải đơn hàng: ${errorMessage}`);
      setOrders([]);
      setTotalPage(1);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm, statusFilter]);

  const fetchOrderMetric = useCallback(async () => {
    try {
      const response = await dashboardApi().fetchOrderBasicMetric();
      if (response) {
        setOrderMetric(response);
      } else {
        setOrderMetric({
          totalOrder: 0,
          orderCompleted: 0,
          orderCancelled: 0,
          totalPaymentReceived: 0,
        });
      }
    } catch (error) {
      setOrderMetric({
        totalOrder: 0,
        orderCompleted: 0,
        orderCancelled: 0,
        totalPaymentReceived: 0,
      });
    }
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrders();
      await fetchOrderMetric();
      toast.success('Đã làm mới danh sách đơn hàng');
    } catch (error) {
      toast.error('Lỗi khi làm mới danh sách đơn hàng');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusUpdate = (comboId: string, newStatus: OrderResponse['orderStatus']) => {
    setOrders(
      orders.map((order) =>
        order.comboId === comboId
          ? {
              ...order,
              orderStatus: newStatus,
            }
          : order,
      ),
    );
    fetchOrderMetric();
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrderMetric();
  }, [fetchOrderMetric]);

  return {
    orders,
    orderMetric,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    statusFilter,
    refreshing,
    setPage,
    setPageSize,
    setSearchTerm,
    setStatusFilter,
    fetchOrders,
    handleRefresh,
    handleSearch,
    handleKeyPress,
    handleStatusUpdate,
  };
}
