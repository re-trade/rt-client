import { authApi, IResponseObject } from '@retrade/util';

export enum DeliveryTypeEnum {
  MANUAL = 'MANUAL',
  GRAB = 'GRAB',
  GIAO_HANG_TIET_KIEM = 'GIAO_HANG_TIET_KIEM',
  VIETTEL_POST = 'VIETTEL_POST',
}

export type CreateOrderHistory = {
  orderComboId: string;
  notes: string;
  newStatusId: string;
  deliveryCode?: string;
  deliveryType?: DeliveryTypeEnum;
  deliveryEvidenceImages?: string[];
};

export type OrderHistoryResponse = {
  id: string;
  orderComboId: string;
  oldOrderStatus: {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
  };
  newOrderStatus: {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
  };
  sellerId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const orderHistoryApi = {
  async updateStatusOrder(orderHistory: CreateOrderHistory): Promise<{
    result?: OrderHistoryResponse;
    success: boolean;
    message: string[];
  }> {
    try {
      const response = await authApi.default.post<IResponseObject<OrderHistoryResponse>>(
        `/order-history`,
        orderHistory,
      );
      const data = response.data;
      return {
        result: data.content,
        success: data.success,
        message: data.messages,
      };
    } catch (_) {
      return {
        success: false,
        message: ['Lỗi khi cập nhập trạng thái đơn hàng'],
      };
    }
  },
};
