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
    keyword?: string,
    status?: string,
  ): Promise<{
    orders: OrderResponse[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  }> {
    const searchParams = new URLSearchParams();

    searchParams.set('page', page.toString());
    searchParams.set('size', size.toString());

    if (keyword?.trim()) {
      searchParams.set('q', `keyword=${keyword.trim()}`);
    }
    if (status && status !== 'all') {
      searchParams.set('orderStatus', status);
    }
    const url = `/orders/seller/combo?${searchParams.toString()}`;
    const response = await authApi.default.get<IResponseObject<OrderResponse[]>>(url);
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
