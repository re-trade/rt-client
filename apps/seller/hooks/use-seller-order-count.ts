'use client';

import { dashboardApi, DashboardOrderCountResponse } from '@/service/dashboard.api';
import { useCallback, useEffect, useState } from 'react';

interface UseSellerOrderCountsState {
  orderCounts: DashboardOrderCountResponse[];
  isLoading: boolean;
  error: string | null;
}

export const orderStatusConfig = {
  PENDING: {
    label: 'Chờ thanh toán',
    color: '#f59e0b',
    group: 'pending',
  },
  PAYMENT_CONFIRMATION: {
    label: 'Xác nhận thanh toán',
    color: '#3b82f6',
    group: 'pending',
  },
  PREPARING: {
    label: 'Đang xử lý',
    color: '#8b5cf6',
    group: 'processing',
  },
  DELIVERING: {
    label: 'Đang giao',
    color: '#10b981',
    group: 'processing',
  },
  DELIVERED: {
    label: 'Đã giao',
    color: '#059669',
    group: 'completed',
  },
  RETRIEVED: {
    label: 'Đã lấy hàng',
    color: '#3b82f6',
    group: 'completed',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: '#22c55e',
    group: 'completed',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: '#ef4444',
    group: 'problem',
  },
  RETURN_REQUESTED: {
    label: 'Đổi/Trả hàng',
    color: '#f97316',
    group: 'problem',
  },
  RETURNED: {
    label: 'Đã trả hàng',
    color: '#6366f1',
    group: 'problem',
  },
  DEFAULT: {
    label: 'Không xác định',
    color: '#6b7280',
    group: 'other',
  },
};

export type OrderStatusCode = keyof typeof orderStatusConfig;

export function useSellerOrderCount() {
  const [state, setState] = useState<UseSellerOrderCountsState>({
    orderCounts: [],
    isLoading: false,
    error: null,
  });

  const fetchOrderCounts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await dashboardApi().fetchSellerOrderCount();
      setState((prev) => ({
        ...prev,
        orderCounts: response,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching order counts:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Không thể tải dữ liệu số lượng đơn hàng',
      }));
    }
  }, []);

  // Format data for display with proper status names and colors
  // Group similar statuses together for better chart readability
  const formatOrderCountsData = useCallback(() => {
    // First map all order counts with their configuration
    const mappedCounts = state.orderCounts.map((orderCount) => {
      const statusCode = orderCount.code as OrderStatusCode;
      const config =
        statusCode in orderStatusConfig ? orderStatusConfig[statusCode] : orderStatusConfig.DEFAULT;

      return {
        code: orderCount.code,
        count: orderCount.count,
        label: config.label,
        color: config.color,
        group: config.group,
      };
    });

    // Group by status group for consolidated view
    const groupedData = mappedCounts.reduce(
      (acc, item) => {
        // Create group key for grouping similar statuses
        const groupKey = item.group || 'other';

        if (!acc[groupKey]) {
          // First status in this group
          acc[groupKey] = {
            code: groupKey,
            count: item.count,
            label: getGroupLabel(groupKey),
            color: item.color,
            statuses: [item],
          };
        } else {
          // Add count to existing group
          acc[groupKey].count += item.count;
          acc[groupKey].statuses.push(item);
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(groupedData);
  }, [state.orderCounts]);

  // Get label for grouped statuses
  const getGroupLabel = (group: string): string => {
    switch (group) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'problem':
        return 'Có vấn đề';
      default:
        return 'Khác';
    }
  };

  // Get total number of orders
  const getTotalOrderCount = useCallback(() => {
    return state.orderCounts.reduce((sum, item) => sum + item.count, 0);
  }, [state.orderCounts]);

  useEffect(() => {
    fetchOrderCounts();
  }, [fetchOrderCounts]);

  return {
    orderCounts: state.orderCounts,
    formattedOrderCounts: formatOrderCountsData(),
    totalOrders: getTotalOrderCount(),
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchOrderCounts,
    orderStatusConfig,
  };
}
