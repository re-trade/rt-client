import { authApi, IResponseObject } from '@retrade/util';
export type RevenueResponse = {
  orderComboId: string;
  feeAmount: number;
  createdDate: string;
  feePercent: number;
  totalPrice: number;
  netAmount: number;
  status: {
    id: string;
    name: string;
    code: string;
  };
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

export type RevenueStatsResponse = {
  totalRevenue: number;
  totalOrder: number;
  totalItemsSold: number;
  averageOrderValue: number;
};

export const revenueApi = {
  async getRevenueBySeller(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<RevenueResponse[]> {
    const response = await authApi.default.get<IResponseObject<RevenueResponse[]>>(
      `/revenue/my-revenue`,
      {
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      },
    );
    return response.data.success ? response.data.content : [];
  },
  async getRevenuStatsBySeller(): Promise<RevenueStatsResponse> {
    const response =
      await authApi.default.get<IResponseObject<RevenueStatsResponse>>(`/revenue/stats`);
    return response.data.success
      ? response.data.content
      : {
          totalRevenue: 0,
          totalOrder: 0,
          totalItemsSold: 0,
          averageOrderValue: 0,
        };
  },
};
