import { IPaginationResponse, IResponseObject } from '@retrade/util';
import { authApi } from '@retrade/util/src/api/instance';

export type TOrder = {
  orderId: string;
  customerId: string;
  customerName: string;
  destination: {
    customerName: string;
    phone: string;
    state: string;
    country: string;
    district: string;
    ward: string;
    addressLine: string;
  };
  items: {
    productId: string;
    productName: string;
    productThumbnail: string;
    sellerName: string;
    sellerId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    shortDescription: string;
  }[];
  orderCombos: {
    comboId: string;
    sellerId: string;
    sellerName: string;
    grandPrice: number;
    status: string;
    itemIds: string[];
  }[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: {
    id: string;
    name: string;
    code: string;
    type: string;
    description: string;
    imgUrl: string;
  };
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const orderApi = {
  async getAllOrders(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<IResponseObject<IPaginationResponse<TOrder>>> {
    try {
      const response = await authApi.default.get<IResponseObject<IPaginationResponse<TOrder>>>(
        '/orders',
        {
          params: {
            page,
            size,
            ...(query ? { query } : {}),
          },
        },
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        content: {
          content: [],
          page: 0,
          size: size,
          totalElements: 0,
          totalPages: 0,
        },
        message: 'Failed to fetch orders',
        messages: ['Failed to fetch orders'],
        code: 'ERROR',
      };
    }
  },

  async cancelOrder(orderId: string): Promise<TOrder> {
    const response = await unAuthApi.default.get<IResponseObject<TOrder>>(
      `/orders/cancel/${orderId}`,
    );
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Order not found');
  },
};
