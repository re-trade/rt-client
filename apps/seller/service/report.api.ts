import { authApi, IResponseObject } from '@retrade/util';

type SellerReportResponse = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string;
  customerId: string;
  productId: string;
  orderId: string;
  typeReport: string;
  content: string;
  createdAt: string;
  resolutionStatus: string;
  resolutionDetail: string;
  resolutionDate: string;
};

type SellerReportEvidenceResponse = {
  id: string;
  senderRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  notes: string;
  evidenceUrls: string[];
  createdAt: string;
};

export const reportSellerApi = {
  getReportSellers: async (
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<{
    content: SellerReportResponse[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      const response = await authApi.default.get<IResponseObject<SellerReportResponse[]>>(
        '/report-seller/seller/me',
        {
          params: { page, size, q: query },
        },
      );
      const data = response.data;
      return {
        content: data.content,
        page: data.pagination?.page || 0,
        size: data.pagination?.size || 10,
        totalElements: data.pagination?.totalElements || 0,
        totalPages: data.pagination?.totalPages || 0,
      };
    } catch {
      return {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
      };
    }
  },
  getReportSellerEvidences: async (
    id: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: SellerReportEvidenceResponse[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }> => {
    try {
      const response = await authApi.default.get<IResponseObject<SellerReportEvidenceResponse[]>>(
        `/report-seller/${id}/evidences/SELLER`,
        {
          params: {
            page,
            size,
          },
        },
      );
      const data = response.data;
      return {
        content: data.content,
        page: data.pagination?.page || 0,
        size: data.pagination?.size || 10,
        totalElements: data.pagination?.totalElements || 0,
        totalPages: data.pagination?.totalPages || 0,
      };
    } catch {
      return {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
      };
    }
  },
  sendSellerEvidence: async (id: string, note: string, evidenceUrls: string[]) => {
    try {
      const response = await authApi.default.post<IResponseObject<SellerReportEvidenceResponse>>(
        `/report-seller/${id}/evidences/seller`,
        {
          note,
          evidenceUrls,
        },
      );
      return response.data;
    } catch {
      return undefined;
    }
  },
};
export type { SellerReportEvidenceResponse, SellerReportResponse };
