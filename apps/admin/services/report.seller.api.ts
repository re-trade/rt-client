import { authApi } from '@retrade/util';

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

const getEvidence = async (
  id: string,
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TEvidence[]> | undefined> => {
  try {
    const response = await authApi.default.get<IResponseObject<TEvidence[]>>(
      `/report-seller/${id}/evidences/SYSTEM`,
      {
        withCredentials: true,
        params: {
          page,
          size,
          ...(query ? { q: query } : {}),
        },
      },
    );

    if (response.data.success && response.status === 200) {
      return response.data;
    }
    return undefined;
  } catch (error: any) {
    console.error('Error fetching evidence:', error.response || error.message);
    return undefined;
  }
};


const postEvidence = async (
  id: string,
  data: { evidenceUrls: string[]; note: string },
): Promise<IResponseObject<TEvidence>> => {
  try {
    if (!id || id.trim() === '') {
      throw new Error('Report ID is required');
    }

    if (!data.evidenceUrls?.length && !data.note?.trim()) {
      throw new Error('Either evidence URLs or note is required');
    }

    const cleanData = {
      evidenceUrls: data.evidenceUrls.filter((url) => url && url.trim() !== ''),
      note: data.note?.trim() || '',
    };

    console.log('Posting evidence with:', { id: id, data: cleanData });

    const response = await authApi.default.post<IResponseObject<TEvidence>>(
      `/report-seller/${id}/evidences/system`,
      cleanData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );

    if (!response?.data) {
      throw new Error('No data returned from postEvidence');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error posting evidence:', error);
    throw new Error(error.message || 'Failed to post evidence');
  }
};

const uploadImage = async (file: File): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await authApi.storage.post<IResponseObject<string>>(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data.success ? response.data.content : undefined;
  } catch {
    return undefined;
  }
};

export { acceptReport, getEvidence, getReports, postEvidence, rejectReport, uploadImage };