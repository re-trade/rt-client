import { authApi, IResponseObject } from '@retrade/util';

export type TReportSellerProfile = {
  reportSellerId: string;
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

const acceptReport = async (id: string): Promise<IResponseObject<null>> => {
  const response = await authApi.default.patch<IResponseObject<null>>(
    `/report-seller/accept/${id}`,
  );
  return response.data;
};

const rejectReport = async (id: string): Promise<IResponseObject<null>> => {
  const response = await authApi.default.patch<IResponseObject<null>>(
    `/report-seller/reject/${id}`,
  );
  return response.data;
};

export { acceptReport, getReports, rejectReport };
