import { authApi, unAuthApi } from '@retrade/util';

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

export type TProduct = {
  id: string;
  name: string;
  sellerId: string;
  sellerShopName: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  condition: string;
  brand: string;
  quantity: number;
  warrantyExpiryDate: string;
  model: string;
  currentPrice: number;
  categories: { id: string; name: string }[];
  tags: string[];
  keywords?: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  avgVote: number;
};

export type TSellerProfile = {
  id: string;
  shopName: string;
  accountId: string;
  description: string;
  addressLine: string;
  district: string;
  ward: string;
  state: string;
  avatarUrl: string;
  email: string;
  background: string;
  phoneNumber: string;
  verified: boolean;
  avgVote: number;
  createdAt: string;
  updatedAt: string;
};

export type TSellerMetricResponse = {
  productQuantity: number;
  avgVote: number;
  totalOrder: number;
  totalOrderSold: number;
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
  data: { evidenceUrls?: string[]; evidenceFiles?: File[]; note: string },
): Promise<IResponseObject<TEvidence>> => {
  try {
    if (!id || id.trim() === '') {
      throw new Error('Report ID is required');
    }

    if (!data.evidenceUrls?.length && !data.evidenceFiles?.length && !data.note?.trim()) {
      throw new Error('Either evidence URLs, files, or note is required');
    }

    let evidenceUrls = data.evidenceUrls?.filter((url) => url && url.trim() !== '') || [];
    if (data.evidenceFiles && data.evidenceFiles.length > 0) {
      try {
        const uploadPromises = data.evidenceFiles.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url): url is string => typeof url === 'string');

        if (validUrls.length === 0) {
          throw new Error('Failed to upload any files');
        }

        if (validUrls.length < data.evidenceFiles.length) {
          console.warn(
            `Only ${validUrls.length} of ${data.evidenceFiles.length} files were uploaded successfully`,
          );
        }

        evidenceUrls = [...evidenceUrls, ...validUrls];
      } catch (error: any) {
        console.error('Error uploading files:', error);
        throw new Error(`Failed to upload files: ${error?.message || 'Unknown error'}`);
      }
    }

    // Ensure we have something to submit
    if (evidenceUrls.length === 0 && !data.note?.trim()) {
      throw new Error(
        'No valid evidence to submit. Please provide either valid files, URLs, or a note.',
      );
    }

    const cleanData = {
      evidenceUrls: evidenceUrls,
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
  // Validate file before uploading
  if (!file) {
    throw new Error('Invalid file provided');
  }

  // Check file size (10MB limit)
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    throw new Error(`File "${file.name}" exceeds maximum size of 10MB`);
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `File "${file.name}" has unsupported format. Supported formats: images, PDF, and Word documents`,
    );
  }

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

    if (!response.data.success || !response.data.content) {
      throw new Error(`Server rejected the file "${file.name}"`);
    }

    return response.data.content;
  } catch (error: any) {
    console.error(`Error uploading file "${file.name}":`, error);
    throw new Error(`Failed to upload "${file.name}": ${error?.message || 'Unknown error'}`);
  }
};

const getProduct = async (id: string): Promise<TProduct | undefined> => {
  try {
    const response = await unAuthApi.default.get<IResponseObject<TProduct>>(`/products/${id}`);
    if (response.data.success) {
      return response.data.content;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching product:', error);
    return undefined;
  }
};

const getSellerProfile = async (id: string): Promise<TSellerProfile | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TSellerProfile>>(`/sellers/${id}`);
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return undefined;
  }
};

const getSellerMetric = async (id: string): Promise<TSellerMetricResponse | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TSellerMetricResponse>>(
      `/sellers/${id}/metric`,
    );
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching seller metrics:', error);
    return undefined;
  }
};

const getReportById = async (id: string): Promise<TReportSellerProfile | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TReportSellerProfile>>(
      `/report-seller/${id}`,
    );
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching report details:', error);
    return undefined;
  }
};

export {
  acceptReport,
  getEvidence,
  getProduct,
  getReportById,
  getReports,
  getSellerMetric,
  getSellerProfile,
  postEvidence,
  rejectReport,
  uploadImage,
};
