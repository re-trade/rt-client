'use client';

import { orderStatusApi, OrderStatusResponse } from '@/services/order-status.api';
import { orderApi, OrderCombo } from '@/services/order.api';
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

// Order status progression mapping (ascending order)
export const statusOrder = {
  PENDING: 1,
  PAYMENT_CONFIRMATION: 2,
  PREPARING: 3,
  DELIVERING: 4,
  DELIVERED: 5,
  RETRIEVED: 6,
  COMPLETED: 7,
  CANCELLED: 8,
  PAYMENT_CANCELLED: 9,
  PAYMENT_FAILED: 10,
  RETURNING: 11,
  RETURNED: 12,
  REFUNDED: 13,
  RETURN_REJECTED: 14,
  RETURN_REQUESTED: 15,
  RETURN_APPROVED: 16,
} as const;

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
  RETRIEVED: {
    label: 'Đã nhận hàng',
    description: 'Bạn có thể hoàn thành đơn hàng hoặc yêu cầu trả hàng',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Package,
  },
  DELIVERED: {
    label: 'Đã giao',
    description: 'Đơn hàng đã được giao thành công',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: CheckCircle,
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

export function useOrderDetail(orderId: string) {
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

  const getStatusDisplay = (id: string) => {
    return (
      orderState.orderStatusRecord[id]?.config || {
        label: 'Không xác định',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Package,
        description: 'Không xác định',
      }
    );
  };

  return {
    ...orderState,
    getOrderById,
    getStatusDisplay,
  };
}

export default useOrderDetail;
