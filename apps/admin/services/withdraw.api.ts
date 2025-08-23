import { authApi, IResponseObject } from '@retrade/util';
import { storageApi } from './storage.api';

export type TWithdrawListItem = {
  id: string;
  amount: number;
  status: string;
  createdDate: string;
  processedDate: string | null;
  bankBin: string;
  bankName: string;
  bankUrl: string;
};

export type TWithdrawDetail = {
  id: string;
  amount: number;
  status: string;
  createdDate: string;
  processedDate: string | null;
  bankBin: string;
  bankName: string;
  bankUrl: string;
  proveUrl?: string;
  cancelReason?: string;
  username?: string;
  customerName?: string;
  customerAvatarUrl?: string;
  customerPhone?: string;
  customerEmail?: string;
  sellerName?: string;
  sellerAvatarUrl?: string;
  sellerPhone?: string;
  sellerEmail?: string;
};

export type TWithdrawProfile = TWithdrawListItem;

const getWithdraws = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TWithdrawListItem[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TWithdrawListItem[]>>(
      `/wallets/withdraw`,
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

const approveWithdraw = async (
  id: string,
  approved: boolean = true,
  imageFile?: File,
  rejectReason?: string,
): Promise<IResponseObject<void> | undefined> => {
  try {
    // First upload the file if provided
    let imageUrl: string | undefined;
    if (imageFile && approved) {
      imageUrl = await storageApi.fileUpload(imageFile);
      if (!imageUrl) {
        throw new Error('Failed to upload confirmation image');
      }
    }

    // Then submit the withdraw approval with the image URL
    const payload = {
      withdrawId: id,
      approved,
      imageReview: imageUrl,
      rejectReason,
    };

    const result = await authApi.default.post<IResponseObject<void>>(
      `/wallets/withdraw/review`,
      payload,
    );

    if (result.data.success) {
      return result.data;
    } else return undefined;
  } catch (error) {
    console.error('Error in approveWithdraw:', error);
    return undefined;
  }
};

const withdrawQr = async (id: string): Promise<Blob | undefined> => {
  try {
    const response = await authApi.default.get(`/wallets/me/withdraw/${id}/qr`, {
      responseType: 'blob',
      headers: {
        Accept: 'image/png',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(error.message || 'Failed to fetch QR code');
  }
};
const getWithdrawDetail = async (id: string): Promise<TWithdrawDetail | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TWithdrawDetail>>(
      `/wallets/withdraw/${id}`,
    );

    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching withdraw details:', error);
    return undefined;
  }
};

export { approveWithdraw, getWithdrawDetail, getWithdraws, withdrawQr };
