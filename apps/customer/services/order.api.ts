import { authApi, IResponseObject } from '@retrade/util';

export interface CreateOrderRequest {
  productIds: string[];
  voucherCode?: string;
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

export interface OrderCombo {
  comboId: string;
  sellerId: string;
  sellerName: string;
  grandPrice: number;
  status: string;
  itemIds: string[];
}

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

  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const response = await authApi.default.get<IResponseObject<OrderResponse>>(
        `/orders/${orderId}`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch order');
    } catch (error) {
      throw error;
    }
  },

  async getMyOrders(): Promise<OrderResponse[]> {
    try {
      const response = await authApi.default.get<IResponseObject<OrderResponse[]>>('/orders');
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch orders');
    } catch (error) {
      throw error;
    }
  },
};
