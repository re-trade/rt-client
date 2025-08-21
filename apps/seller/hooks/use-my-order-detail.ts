'use client';

import { myOrderApi, OrderCombo } from '@/service/myorder.api';
import { orderStatusApi, OrderStatusResponse } from '@/service/orderStatus.api';
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
import { useCallback, useEffect, useState } from 'react';

export const statusConfig = {
  PENDING: {
    label: 'Chưa thanh toán',
    description: 'Đơn hàng chưa được thanh toán',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CreditCard,
  },
  PAYMENT_CONFIRMATION: {
    label: 'Đã thanh toán',
    description: 'Thanh toán đã được thực hiện, chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: BadgeCheck,
  },
  PREPARING: {
    label: 'Đang chuẩn bị',
    description: 'Đơn hàng đang được chuẩn bị để giao',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Package,
  },
  DELIVERING: {
    label: 'Đang giao',
    description: 'Đơn hàng đang trong quá trình vận chuyển',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Đã giao',
    description: 'Đơn hàng đã được giao thành công',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: CheckCircle,
  },
  RETRIEVED: {
    label: 'Đã lấy hàng',
    description: 'Khách hàng đã lấy hàng thành công',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package,
  },
  CANCELLED: {
    label: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  PAYMENT_CANCELLED: {
    label: 'Hủy thanh toán',
    description: 'Thanh toán đã bị hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Ban,
  },
  PAYMENT_FAILED: {
    label: 'Thanh toán thất bại',
    description: 'Thanh toán không thành công',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  RETURNING: {
    label: 'Đang trả hàng',
    description: 'Đơn hàng đang trong quá trình trả lại',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: RotateCcw,
  },
  RETURN_REQUESTED: {
    label: 'Yêu cầu trả hàng',
    description: 'Khách hàng đã gửi yêu cầu trả hàng',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: ArrowLeftRight,
  },
  RETURN_APPROVED: {
    label: 'Đồng ý trả hàng',
    description: 'Yêu cầu trả hàng đã được chấp thuận',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ThumbsUp,
  },
  RETURN_REJECTED: {
    label: 'Từ chối trả hàng',
    description: 'Yêu cầu trả hàng đã bị từ chối',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: ThumbsDown,
  },
  RETURNED: {
    label: 'Đã trả hàng',
    description: 'Hàng đã được trả lại thành công',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ArrowRightLeft,
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    description: 'Khách hàng đã được hoàn tiền',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ShieldCheck,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    description: 'Đơn hàng đã hoàn tất toàn bộ quy trình',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
  },
} as const;

export type OrderStatusCode = keyof typeof statusConfig;

type OrderStatusModel = {
  id: string;
  code: string;
  name: string;
  config: OrderStatusConfig;
};

type OrderStatusConfig = {
  code: string;
  label: string;
  description: string;
  color: string;
  icon: React.ElementType;
};

export interface OrderState {
  currentOrder: OrderCombo | null;
  orderStatuses: OrderStatusResponse[];
  orderStatusRecord: Record<string, OrderStatusModel>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useMyOrderDetail(orderId: string) {
  const [orderState, setOrderState] = useState<OrderState>({
    currentOrder: null,
    orderStatuses: [],
    orderStatusRecord: {},
    isLoading: false,
    error: null,
    success: false,
  });

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
          description: config?.description ?? '',
          icon: config?.icon ?? Package,
        },
      };
    });

    setOrderState((prev) => ({
      ...prev,
      orderStatuses: result,
      orderStatusRecord,
    }));
  }, []);

  const getOrderById = useCallback(async () => {
    setOrderState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await myOrderApi.getOrderById(orderId);

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

  const getStatusDisplay = (id: string) => {
    return (
      orderState.orderStatusRecord[id]?.config || {
        label: 'Chưa rõ',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Package,
        description: 'Chưa rõ',
      }
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    ...orderState,
    getOrderById,
    getStatusDisplay,
    formatPrice,
    formatDate,
  };
}

export default useMyOrderDetail;
