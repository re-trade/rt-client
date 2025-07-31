import { authApi, IResponseObject } from '@retrade/util';

type DashboardMetricCode =
  | 'TOTAL_PRODUCTS'
  | 'REVENUE'
  | 'TOTAL_ORDERS'
  | 'RETURN_RATE'
  | 'AVERAGE_VOTE'
  | 'ACTIVE_PRODUCTS'
  | 'SOLD_RATE'
  | 'VERIFIED_RATE';

type DashboardMetricResponse = {
  code: DashboardMetricCode;
  value: number;
  change: number;
};

type DashboardOrderResponse = {
  id: string;
  grandPrice: number;
  createdDate: string;
  receiverName: string;
};

type DashboardOrderCountResponse = {
  code: string;
  count: number;
};

type DashboardBestProductResponse = {
  productName: string;
  quantitySold: number;
  revenue: number;
};

type DashboardRevenueResponse = {
  month: number;
  total: number;
};

const dashboardApi = () => {
  const fetchSellerDashboardMetric = async (fromDate: Date, toDate: Date) => {
    const fromDateISO = fromDate.toISOString().slice(0, 19);
    const toDateISO = toDate.toISOString().slice(0, 19);
    const response = await authApi.default.get<IResponseObject<DashboardMetricResponse[]>>(
      '/dashboard/seller/metric',
      {
        params: {
          fromDate: fromDateISO,
          toDate: toDateISO,
        },
      },
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  };

  const fetchSellerOrders = async (): Promise<DashboardOrderResponse[]> => {
    const response =
      await authApi.default.get<IResponseObject<DashboardOrderResponse[]>>(
        '/dashboard/seller/order',
      );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  };

  const fetchSellerOrderCount = async (): Promise<DashboardOrderCountResponse[]> => {
    const response = await authApi.default.get<IResponseObject<DashboardOrderCountResponse[]>>(
      '/dashboard/seller/order-count',
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  };

  const fetchSellerBestProduct = async (): Promise<DashboardBestProductResponse[]> => {
    const response = await authApi.default.get<IResponseObject<DashboardBestProductResponse[]>>(
      '/dashboard/seller/best-product',
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  };

  const fetchSellerRevenue = async (year: number): Promise<DashboardRevenueResponse[]> => {
    const response = await authApi.default.get<IResponseObject<DashboardRevenueResponse[]>>(
      '/dashboard/seller/revenue',
      {
        params: { year },
      },
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  };

  return {
    fetchSellerDashboardMetric,
    fetchSellerOrders,
    fetchSellerOrderCount,
    fetchSellerBestProduct,
    fetchSellerRevenue,
  };
};

export { dashboardApi };

export type {
  DashboardBestProductResponse,
  DashboardMetricCode,
  DashboardMetricResponse,
  DashboardOrderCountResponse,
  DashboardOrderResponse,
  DashboardRevenueResponse,
};
