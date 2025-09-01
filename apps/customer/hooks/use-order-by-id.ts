'use client';

import { orderApi, OrderDetailResponse } from '@/services/order.api';
import { useEffect, useState } from 'react';

export function useOrderById(orderId: string) {
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id) {
      setOrder(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = await orderApi.getOrderDetailById(id);
      console.log(orderData);
      setOrder(orderData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  const refetch = () => {
    if (orderId) {
      fetchOrder(orderId);
    }
  };

  return {
    order,
    isLoading,
    error,
    refetch,
  };
}
