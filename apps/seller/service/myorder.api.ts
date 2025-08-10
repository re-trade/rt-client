import { authApi, IResponseObject } from '@retrade/util';

export interface OrderDestination {
  customerName: string;
  phone: string;
  state: string;
  country: string;
  district: string;
  ward: string;
  addressLine: string;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  itemThumbnail: string;
  productId: string;
  basePrice: number;
  quantity: number;
}

export interface OrderCombo {
  comboId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl?: string;
  orderStatusId: string;
  orderStatus: string;
  grandPrice: number;
  items: OrderItem[];
  destination: OrderDestination;
  createDate?: string;
  updateDate?: string;
}

// Response for order detail endpoint
export interface OrderDetailResponse {
  content: OrderCombo;
  messages: string[];
  code: string;
  success: boolean;
  pagination: null;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface OrderStatsResponse {
  totalOrders: number;
  totalOrdersBeingDelivered: number;
  totalOrdersCompleted: number;
  totalPaymentCost: number;
}

export interface OrdersResponse {
  content: OrderCombo[];
  messages: string[];
  code: string;
  success: boolean;
  pagination: PaginationInfo;
}

export const myOrderApi = {
  async getOrderById(orderId: string): Promise<OrderCombo> {
    try {
      const response = await authApi.default.get<OrderDetailResponse>(
        `/orders/customer/combo/${orderId}`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch order');
    } catch (error) {
      throw error;
    }
  },

  async getMyOrders(page: number = 0, size: number = 10, query?: string): Promise<OrdersResponse> {
    try {
      const response = await authApi.default.get<OrdersResponse>('/orders/customer/combo', {
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      });
      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to fetch orders');
    } catch (error) {
      throw error;
    }
  },

  async getOrderStats(): Promise<OrderStatsResponse> {
    try {
      const response =
        await authApi.default.get<IResponseObject<OrderStatsResponse>>('/orders/customer-stats');
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch order stats');
    } catch (error) {
      throw error;
    }
  },
};
