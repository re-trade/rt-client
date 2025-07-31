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

  return { fetchSellerDashboardMetric };
};
export { dashboardApi };
export type { DashboardMetricCode, DashboardMetricResponse };
