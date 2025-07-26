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
  discount: number;
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

export interface OrdersResponse {
  content: OrderCombo[];
  messages: string[];
  code: string;
  success: boolean;
  pagination: PaginationInfo;
}

export interface GetOrdersParams {
  page?: number;
  size?: number;
  status?: string;
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

  async getMyOrders(params: GetOrdersParams = {}): Promise<OrdersResponse> {
    try {
      const { page = 0, size = 10, status } = params;
      let url = `/orders/customer/combo?page=${page}&size=${size}`;

      if (status) {
        url += `&status=${status}`;
      }

      const response = await authApi.default.get<OrdersResponse>(url);
      if (response.data.success) {
        return response.data;
      }
      throw new Error('Failed to fetch orders');
    } catch (error) {
      throw error;
    }
  },
};

// Legacy interface for backward compatibility
export interface VoucherApplication {
  voucherId: string;
  voucherCode: string;
  voucherType: string;
  discountAmount: number;
  discountType: string;
  applied: boolean;
  message: string;
}

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
  voucherApplication: VoucherApplication;
  paymentMethod: PaymentMethod;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
