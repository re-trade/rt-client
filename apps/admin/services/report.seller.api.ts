import { authApi, IResponseObject } from '@retrade/util';

export type TReportSellerProfile = {
  id: string;
  customerId: string;
  productId: string;
  orderId: string;
  sellerId: string;
  typeReport: string;
  content: string;
  image: string;
  createdAt: string;
  resolutionStatus: string;
  resolutionDetail: string;
  resolutionDate: string;
  adminId: string;
};

const getReports = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TReportSellerProfile[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TReportSellerProfile[]>>(
      `/report-seller`,
      {
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      },
    );
    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch {
    return undefined;
  }
};

const acceptReport = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(`/report-seller/${id}`);
  if (result.data.success) {
    return result.data;
  } else return undefined;
};

export { acceptReport, getReports };
