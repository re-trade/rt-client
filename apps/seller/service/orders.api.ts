import { authApi, IResponseObject } from '@retrade/util';

export interface SortState {
  field: string;
  direction: 'asc' | 'desc' | null;
}

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
    sort?: SortState[],
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

    if (sort && sort.length > 0 && sort[0].field && sort[0].direction !== null) {
      searchParams.set('sort', `${sort[0].field},${sort[0].direction}`);
    }

    const url = `/orders/seller/combo?${searchParams.toString()}`;
    const response = await authApi.default.get<IResponseObject<OrderResponse[]>>(url);

    const defaultResponse = {
      orders: [] as OrderResponse[],
      totalPages: 1,
      totalElements: 0,
      currentPage: 1,
      pageSize: size,
    };

    if (!response.data) {
      return defaultResponse;
    }

    const orders = response.data.success && response.data.content ? response.data.content : [];
    const pagination = response.data.pagination;

    return {
      orders,
      totalPages: pagination ? pagination.totalPages || 1 : 1,
      totalElements: pagination ? pagination.totalElements || orders.length : orders.length,
      currentPage: pagination ? (pagination.page || 0) + 1 : 1,
      pageSize: pagination ? pagination.size || size : size,
    };
  },
  async getOrderComboById(id: string) {
    const response = await authApi.default.get<IResponseObject<OrderResponse>>(
      `/orders/seller/combo/${id}`,
    );
    return response.data.success ? response.data.content : undefined;
  },
};
