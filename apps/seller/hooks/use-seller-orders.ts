'use client';

import { dashboardApi, DashboardOrderResponse } from '@/service/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerOrdersState {
  orders: DashboardOrderResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useSellerOrders() {
  const [state, setState] = useState<UseSellerOrdersState>({
    orders: [],
    isLoading: false,
    error: null,
  });

  const fetchOrders = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await dashboardApi().fetchSellerOrders();
      setState((prev) => ({
        ...prev,
        orders: response,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Không thể tải dữ liệu đơn hàng',
      }));
    }
  }, []);

  const formatOrdersData = useCallback(() => {
    return state.orders.map((order) => ({
      id: order.id,
      grandPrice: order.grandPrice,
      formattedPrice: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(order.grandPrice),
      createdDate: new Date(order.createdDate),
      formattedDate: new Date(order.createdDate).toLocaleDateString('vi-VN'),
      receiverName: order.receiverName,
    }));
  }, [state.orders]);

  const getOrdersByDay = useCallback(() => {
    const ordersByDay: Record<string, { count: number; total: number }> = {};

    state.orders.forEach((order) => {
      const date = new Date(order.createdDate).toLocaleDateString('vi-VN');

      if (!ordersByDay[date]) {
        ordersByDay[date] = { count: 0, total: 0 };
      }

      ordersByDay[date].count += 1;
      ordersByDay[date].total += order.grandPrice;
    });

    return Object.entries(ordersByDay).map(([date, data]) => ({
      date,
      count: data.count,
      total: data.total,
      formattedTotal: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(data.total),
    }));
  }, [state.orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders: state.orders,
    formattedOrders: formatOrdersData(),
    ordersByDay: getOrdersByDay(),
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchOrders,
  };
}
