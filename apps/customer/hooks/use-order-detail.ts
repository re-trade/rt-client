'use client';

import { orderStatusApi, OrderStatusResponse } from '@/services/order-status.api';
import { orderApi, OrderCombo } from '@/services/order.api';
import { useCallback, useEffect, useState } from 'react';

export interface OrderState {
  currentOrder: OrderCombo | null;
  orderStatuses: OrderStatusResponse[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useOrderDetail(orderId: string) {
  const [orderState, setOrderState] = useState<OrderState>({
    currentOrder: null,
    orderStatuses: [],
    isLoading: false,
    error: null,
    success: false,
  });

  const getAllOrderStatus = useCallback(async () => {
    const result = await orderStatusApi.getOrderStatuses();
    setOrderState((prev) => ({
      ...prev,
      orderStatuses: result,
    }));
  }, []);

  const getOrderById = useCallback(async () => {
    setOrderState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await orderApi.getOrderById(orderId);

      setOrderState((prev) => ({
        ...prev,
        currentOrder: response,
        isLoading: false,
        error: null,
      }));

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải đơn hàng';

      setOrderState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, [orderId]);

  useEffect(() => {
    getOrderById();
    getAllOrderStatus();
  }, [getAllOrderStatus, getOrderById]);

  return {
    ...orderState,
    getOrderById,
  };
}

export default useOrderDetail;
