'use client';

import { orderStatusApi, OrderStatusResponse } from '@/services/order-status.api';
import { orderApi, OrderCombo, OrdersResponse } from '@/services/order.api';
import {
  ArrowLeftRight,
  ArrowRightLeft,
  BadgeCheck,
  Ban,
  CheckCircle,
  CreditCard,
  Package,
  RotateCcw,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Truck,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export const statusConfig = {
  PENDING: {
    label: 'Chưa thanh toán',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CreditCard,
  },
  PAYMENT_CONFIRMATION: {
    label: 'Đã thanh toán',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: BadgeCheck,
  },
  PREPARING: {
    label: 'Đang chuẩn bị',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
  },
  DELIVERING: {
    label: 'Đang giao',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Đã giao',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  PAYMENT_CANCELLED: {
    label: 'Hủy thanh toán',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Ban,
  },
  PAYMENT_FAILED: {
    label: 'Thanh toán thất bại',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  RETURNING: {
    label: 'Đang trả hàng',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: RotateCcw,
  },
  RETURN_REQUESTED: {
    label: 'Yêu cầu trả hàng',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: ArrowLeftRight,
  },
  RETURN_APPROVED: {
    label: 'Đồng ý trả hàng',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ThumbsUp,
  },
  RETURN_REJECTED: {
    label: 'Từ chối trả hàng',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: ThumbsDown,
  },
  RETURNED: {
    label: 'Đã trả hàng',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ArrowRightLeft,
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ShieldCheck,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
  },
} as const;

export type OrderStatusCode = keyof typeof statusConfig;

export interface OrderState {
  currentOrder: OrderCombo | null;
  orders: OrderCombo[];
  orderStatuses: OrderStatusResponse[];
  orderStatusRecord: Record<string, OrderStatusModel>;
  selectedOrderStatuses: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  } | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  success: boolean;
}

type OrderStatusModel = {
  id: string;
  code: string;
  name: string;
  config: OrderStatusConfig;
};

type OrderStatusConfig = {
  code: string;
  label: string;
  color: string;
  icon: React.ElementType;
};

export function useOrder() {
  const [orderState, setOrderState] = useState<OrderState>({
    currentOrder: null,
    orders: [],
    orderStatuses: [],
    orderStatusRecord: {},
    selectedOrderStatuses: null,
    pagination: null,
    isLoading: false,
    isCreating: false,
    error: null,
    success: false,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const getAllOrderStatus = useCallback(async () => {
    const result = await orderStatusApi.getOrderStatuses();

    const orderStatusRecord: Record<string, OrderStatusModel> = {};

    result.forEach((item) => {
      const config = statusConfig[item.code as OrderStatusCode];

      orderStatusRecord[item.id] = {
        id: item.id,
        code: item.code,
        name: item.name,
        config: {
          code: item.code,
          label: config?.label ?? item.name,
          color: config?.color ?? '',
          icon: config?.icon ?? null,
        },
      };
    });

    setOrderState((prev) => ({
      ...prev,
      orderStatuses: result,
      orderStatusRecord,
    }));
  }, []);



  const getMyOrders = useCallback(
    async (
      page?: number,
      search?: string,
      statusFilter?: string | null,
    ): Promise<OrdersResponse | null> => {
      setOrderState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const query = new URLSearchParams();
        const searchValue = search !== undefined ? search : debouncedSearchTerm;
        const statusFilterValue =
          statusFilter !== undefined ? statusFilter : orderState.selectedOrderStatuses;
        const currentPage = page !== undefined ? page : orderState.pagination?.page || 0;

        if (searchValue) {
          query.append('keyword', searchValue);
        }
        if (statusFilterValue && statusFilterValue !== 'all') {
          query.append('orderStatusId', statusFilterValue);
        }

        const response = await orderApi.getMyOrders(currentPage, 6, query.toString());

        setOrderState((prev) => ({
          ...prev,
          orders: response.content,
          pagination: response.pagination,
          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Không thể tải danh sách đ�n hàng';

        setOrderState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [orderState.pagination?.page, debouncedSearchTerm, orderState.selectedOrderStatuses],
  );

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      getMyOrders();
      getAllOrderStatus();
      return;
    }

    getMyOrders();
  }, [debouncedSearchTerm, getAllOrderStatus, getMyOrders, orderState.selectedOrderStatuses]);

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders, orderState.pagination?.page]);

  useEffect(() => {
    getAllOrderStatus();
  }, [getAllOrderStatus]);

  const resetOrderState = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setOrderState({
      currentOrder: null,
      orders: [],
      pagination: null,
      orderStatuses: [],
      orderStatusRecord: {},
      selectedOrderStatuses: null,
      isLoading: false,
      isCreating: false,
      error: null,
      success: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const clearCurrentOrder = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      currentOrder: null,
      error: null,
    }));
  }, []);

  const updateSearchFilter = useCallback((search: string) => {
    setSearchTerm(search);
    setOrderState((prev) => ({
      ...prev,
      pagination: prev.pagination ? { ...prev.pagination, page: 0 } : null,
    }));
  }, []);

  const getStatusDisplay = (id: string) => {
    return (
      orderState.orderStatusRecord[id]?.config || {
        label: 'Không xác định',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Package,
      }
    );
  };

  const updateOrderStatusFilter = useCallback((orderStatusId: string | null) => {
    setOrderState((prev) => ({
      ...prev,
      selectedOrderStatuses: orderStatusId,
      pagination: prev.pagination ? { ...prev.pagination, page: 0 } : null,
    }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setOrderState((prev) => ({
      ...prev,
      pagination: prev.pagination ? { ...prev.pagination, page: page - 1 } : null, // Convert to 0-based index
    }));
  }, []);

  const nextPage = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      pagination:
        prev.pagination && prev.pagination.page < prev.pagination.totalPages - 1
          ? { ...prev.pagination, page: prev.pagination.page + 1 }
          : prev.pagination,
    }));
  }, []);

  const previousPage = useCallback(() => {
    setOrderState((prev) => ({
      ...prev,
      pagination:
        prev.pagination && prev.pagination.page > 0
          ? { ...prev.pagination, page: prev.pagination.page - 1 }
          : prev.pagination,
    }));
  }, []);

  return {
    ...orderState,
    search: searchTerm,
    getMyOrders,
    resetOrderState,
    clearError,
    clearCurrentOrder,
    updateSearchFilter,
    updateOrderStatusFilter,
    getStatusDisplay,
    goToPage,
    nextPage,
    previousPage,
  };
}
