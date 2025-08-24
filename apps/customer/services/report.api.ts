import { authApi, IResponseObject } from '@retrade/util';

export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type ReportType =
  | 'Sản phẩm không đúng mô tả'
  | 'Chất lượng sản phẩm kém'
  | 'Giao hàng chậm'
  | 'Thái độ phục vụ không tốt'
  | 'Không giao hàng'
  | 'Sản phẩm giả/nhái'
  | 'Khác';

export type CustomerReportResponse = {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatarUrl: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string;
  productId: string;
  orderId: string;
  typeReport: string;
  content: string;
  createdAt: string;
  resolutionStatus: ReportStatus;
  resolutionDetail: string;
  resolutionDate: string;
};

export type CustomerReportEvidenceResponse = {
  id: string;
  senderRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  notes: string;
  evidenceUrls: string[];
  createdAt: string;
};

export type CreateReportRequest = {
  sellerId: string;
  typeReport: string;
  content: string;
  orderId?: string;
  productId: string;
  evidenceUrls?: string[];
};

export type ReportFormData = {
  comboId: string;
  sellerId: string;
  productId: string;
  typeReport: ReportType;
  content: string;
  evidenceUrls: string[];
};

export type ReportFormErrors = {
  comboId?: string;
  productId?: string;
  typeReport?: string;
  content?: string;
  evidenceUrls?: string;
  general?: string;
};

export type ReportListFilters = {
  status?: ReportStatus;
  typeReport?: ReportType;
  dateFrom?: string;
  dateTo?: string;
  query?: string;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export const customerReportApi = {
  getMyReports: async (
    page: number = 0,
    size: number = 10,
    filters?: ReportListFilters,
  ): Promise<PaginatedResponse<CustomerReportResponse>> => {
    try {
      const params: Record<string, any> = { page, size };

      if (filters?.query) params.q = filters.query;
      if (filters?.status) params.status = filters.status;
      if (filters?.typeReport) params.typeReport = filters.typeReport;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;

      const response = await authApi.default.get<IResponseObject<CustomerReportResponse[]>>(
        '/report-seller/customer/me',
        { params },
      );

      const data = response.data;
      if (!data.success) {
        throw new Error(data.messages?.[0] || 'Failed to fetch reports');
      }

      return {
        content: data.content || [],
        page: data.pagination?.page || 0,
        size: data.pagination?.size || 10,
        totalElements: data.pagination?.totalElements || 0,
        totalPages: data.pagination?.totalPages || 0,
      };
    } catch (error) {
      throw error;
    }
  },
  getReportById: async (id: string): Promise<CustomerReportResponse> => {
    try {
      const response = await authApi.default.get<IResponseObject<CustomerReportResponse>>(
        `/report-seller/${id}/customer`,
      );

      if (!response.data.success) {
        throw new Error(response.data.messages?.[0] || 'Failed to fetch report');
      }

      return response.data.content;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },
  getReportEvidences: async (
    id: string,
    page: number = 0,
    size: number = 10,
  ): Promise<PaginatedResponse<CustomerReportEvidenceResponse>> => {
    try {
      const response = await authApi.default.get<IResponseObject<CustomerReportEvidenceResponse[]>>(
        `/report-seller/${id}/evidences/CUSTOMER`,
        {
          params: { page, size },
        },
      );

      const data = response.data;
      if (!data.success) {
        throw new Error(data.messages?.[0] || 'Failed to fetch evidences');
      }

      return {
        content: data.content || [],
        page: data.pagination?.page || 0,
        size: data.pagination?.size || 10,
        totalElements: data.pagination?.totalElements || 0,
        totalPages: data.pagination?.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching evidences:', error);
      throw error;
    }
  },

  createReport: async (payload: CreateReportRequest): Promise<CustomerReportResponse> => {
    try {
      const response = await authApi.default.post<IResponseObject<CustomerReportResponse>>(
        '/report-seller',
        payload,
      );

      if (!response.data.success) {
        throw new Error(response.data.messages?.[0] || 'Failed to create report');
      }

      return response.data.content;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  sendCustomerEvidence: async (
    id: string,
    note: string,
    evidenceUrls: string[],
  ): Promise<CustomerReportEvidenceResponse> => {
    try {
      const response = await authApi.default.post<IResponseObject<CustomerReportEvidenceResponse>>(
        `/report-seller/${id}/evidences/customer`,
        {
          note,
          evidenceUrls,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.messages?.[0] || 'Failed to send evidence');
      }

      return response.data.content;
    } catch (error) {
      console.error('Error sending evidence:', error);
      throw error;
    }
  },

  getReportTypes: async (): Promise<ReportType[]> => {
    try {
      return [
        'Sản phẩm không đúng mô tả',
        'Chất lượng sản phẩm kém',
        'Giao hàng chậm',
        'Thái độ phục vụ không tốt',
        'Không giao hàng',
        'Sản phẩm giả/nhái',
        'Khác',
      ];
    } catch (error) {
      return ['Khác'];
    }
  },
};
