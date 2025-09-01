import { authApi, IResponseObject } from '@retrade/util';

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  addressId: string;
}

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

export const orderApi = {
  async createOrder(payload: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await authApi.default.post<IResponseObject<OrderResponse>>(
        '/orders',
        payload,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to create order');
    } catch (error) {
      throw error;
    }
  },

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

  async getOrderDetailById(orderId: string): Promise<OrderDetailResponse> {
    try {
      const response = await authApi.default.get<IResponseObject<OrderDetailResponse>>(
        `/orders/${orderId}`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch order details');
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

  async cancelOrder(orderId: string, reason: string): Promise<void> {
    try {
      const response = await authApi.default.put<IResponseObject<void>>(
        `/orders/combo/customer/cancel`,
        {
          orderComboId: orderId,
          reason,
        },
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to cancel order');
    } catch (error) {
      throw error;
    }
  },

  async completeOrder(orderId: string): Promise<void> {
    try {
      const response = await authApi.default.put<IResponseObject<void>>(
        `/orders/combo/${orderId}/customer/completed`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to complete order');
    } catch (error) {
      throw error;
    }
  },

  async requestReturn(orderId: string, reason: string): Promise<OrderCombo> {
    try {
      const response = await authApi.default.post<OrderDetailResponse>(
        `/orders/customer/combo/${orderId}/return-request`,
        { reason },
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to request return');
    } catch (error) {
      throw error;
    }
  },

  async confirmRetrieved(orderId: string): Promise<void> {
    try {
      const response = await authApi.default.put<IResponseObject<void>>(
        `/orders/combo/${orderId}/customer/delivery-confirmed`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to confirm retrieved status');
    } catch (error) {
      throw error;
    }
  },

  async getCustomerOrderComboCanReport(
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: OrderCombo[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }> {
    try {
      const response = await authApi.default.get<IResponseObject<OrderCombo[]>>(
        '/orders/customer/combo/can-report',
        {
          params: { page, size },
        },
      );
      const data = response.data;
      if (data.success) {
        return {
          content: data.content,
          page: data.pagination?.page || 0,
          size: data.pagination?.size || 0,
          totalPages: data.pagination?.totalPages || 0,
          totalElements: data.pagination?.totalElements || 0,
        };
      } else {
        return {
          content: [],
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        };
      }
    } catch {
      return {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
      };
    }
  },
};

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

export interface OrderResponse {
  orderId: string;
  customerId: string;
  customerName: string;
  destination: OrderDestination;
  items: OrderItem[];
  orderCombos: OrderCombo[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailItem {
  productId: string;
  productName: string;
  productThumbnail: string;
  sellerName: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  shortDescription: string;
}

export interface OrderDetailCombo {
  comboId: string;
  sellerId: string;
  sellerName: string;
  grandPrice: number;
  status: string;
  itemIds: string[];
}

export interface OrderDetailResponse {
  orderId: string;
  customerId: string;
  customerName: string;
  destination: OrderDestination;
  items: OrderDetailItem[];
  orderCombos: OrderDetailCombo[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
