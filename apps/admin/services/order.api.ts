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

export type TOrderCombo = {
  comboId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string;
  orderStatusId: string;
  orderStatus: {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
  };
  grandPrice: number;
  items: {
    itemId: string;
    itemName: string;
    itemThumbnail: string;
    productId: string;
    basePrice: number;
    quantity: number;
  }[];
  destination: {
    customerName: string;
    phone: string;
    state: string;
    country: string;
    district: string;
    ward: string;
    addressLine: string;
  };
  createDate: string;
  updateDate: string;
  paymentStatus: string;
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
    const response = await authApi.default.get<IResponseObject<TOrder>>(
      `/orders/cancel/${orderId}`,
    );
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Order not found');
  },

  async getOrderCombo(comboId: string): Promise<IResponseObject<TOrderCombo>> {
    try {
      const response = await authApi.default.get<IResponseObject<TOrderCombo>>(
        `/orders/admin/combo/${comboId}`,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        content: {} as TOrderCombo,
        message: 'Failed to fetch order combo',
        messages: ['Failed to fetch order combo'],
        code: 'ERROR',
      };
    }
  },

  async getAllOrderCombos(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<IResponseObject<IPaginationResponse<TOrderCombo>>> {
    try {
      const response = await authApi.default.get<IResponseObject<TOrderCombo[]>>('/orders/combo', {
        params: {
          page,
          size,
          ...(query ? { query } : {}),
        },
      });
      // Transform direct array response to pagination format
      if (response.data.success && Array.isArray(response.data.content)) {
        const content = response.data.content;
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedContent = content.slice(startIndex, endIndex);
        const totalPages = Math.max(1, Math.ceil(content.length / size));

        return {
          success: true,
          content: {
            content: paginatedContent,
            page: page,
            size: size,
            totalElements: content.length,
            totalPages: totalPages,
          },
          message: response.data.message,
          messages: response.data.messages,
          code: response.data.code,
        };
      }

      return response.data as IResponseObject<IPaginationResponse<TOrderCombo>>;
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
        message: 'Failed to fetch order combos',
        messages: ['Failed to fetch order combos'],
        code: 'ERROR',
      };
    }
  },
};
