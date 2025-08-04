import { authApi, IResponseObject } from '@retrade/util';

export type OrderResponse = {
  comboId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string;
  orderStatus: {
    id: string;
    name: string;
    code: string;
  };
  paymentStatus: string;
  grandPrice: number;
  createDate: string;
  updateDate: string;
  items: {
    itemId: string;
    itemName: string;
    itemThumbnail: string;
    productId: string;
    basePrice: number;
    discount: number;
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
};

export const ordersApi = {
  async getAllOrdersBySeller(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<{
    orders: OrderResponse[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  }> {
    const response = await authApi.default.get<IResponseObject<OrderResponse[]>>(
      `/orders/seller/combo`,
      {
        params: {
          page,
          size,
          ...(query ? { query } : {}),
        },
      },
    );
    const orders = response.data.success ? response.data.content : [];
    return {
      orders,
      totalPages: response.data.pagination?.totalPages || 1,
      totalElements: response.data.pagination?.totalElements || orders.length,
      currentPage: (response.data.pagination?.page || 0) + 1,
      pageSize: response.data.pagination?.size || size,
    };
  },
};
