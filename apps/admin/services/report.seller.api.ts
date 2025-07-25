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

export type TEvidence = {
  id: string;
  senderRole: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  notes: string;
  evidenceUrls: string[];
};

interface IResponseObject<T> {
  code: string;
  success: boolean;
  messages: string[];
  content: T;
  pagination?: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

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
    `/report-seller/${id}/accept`,
  );
  return response.data;
};

const rejectReport = async (id: string): Promise<IResponseObject<null>> => {
  const response = await authApi.default.patch<IResponseObject<null>>(
    `/report-seller/${id}/reject`,
  );
  return response.data;
};

 

const getEvidence = async (id: string): Promise<TEvidence[]> => {
  try {
    const response = await authApi.default.get<IResponseObject<TEvidence[]>>(
      `/report-seller/${id}/evidences/SYSTEM`,
      {
        withCredentials: true,
      }
    );
    return response.data.content || []; 
  } catch (error) {
    throw error;
  }
};

export { acceptReport, getReports, rejectReport, getEvidence };
