import { authApi, IResponseObject } from '@retrade/util';

export type WalletBalance = {
  balance: number;
};

export type WithdrawalRequest = {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  processedDate?: string;
  createdDate: string;
  bankBin: string;
  bankName: string;
  bankUrl: string;
};

export type CreateWithdrawalRequest = {
  amount: number;
  bankProfileId: string;
  content: string;
};

export const getWalletBalance = async (): Promise<WalletBalance | undefined> => {
  try {
    const response =
      await authApi.default.get<IResponseObject<WalletBalance>>('/wallets/me/balance');
    if (response.data.success) {
      return response.data.content;
    } else {
      console.error('API returned error for wallet balance:', response.data);
      throw new Error(
        response.data.message || response.data.messages?.[0] || 'Không thể lấy số dư ví',
      );
    }
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
  }
};

/**
 * Gets the withdrawal history
 * @param page Page number
 * @param size Number of items per page
 */
export const getWithdrawals = async (
  page: number = 0,
  size: number = 10,
): Promise<IResponseObject<WithdrawalRequest[]>> => {
  try {
    const response = await authApi.default.get<IResponseObject<WithdrawalRequest[]>>(
      '/wallets/me/withdraw',
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data && typeof error.response.data === 'object') {
      return error.response.data as IResponseObject<WithdrawalRequest[]>;
    }
    const errorMsg =
      error.response?.status === 400
        ? 'Lỗi dữ liệu khi lấy lịch sử rút tiền'
        : error.response?.status === 401
          ? 'Bạn cần đăng nhập lại để tiếp tục'
          : error.response?.status === 403
            ? 'Bạn không có quyền thực hiện thao tác này'
            : 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    return {
      message: errorMsg,
      messages: [errorMsg],
      content: [],
      code: error.response?.status?.toString() || '500',
      success: false,
    };
  }
};

/**
 * Create a new withdrawal request
 * @param withdrawalData Withdrawal request data
 */
export const createWithdrawal = async (
  withdrawalData: CreateWithdrawalRequest,
): Promise<IResponseObject<WithdrawalRequest>> => {
  try {
    const response = await authApi.default.post<IResponseObject<WithdrawalRequest>>(
      '/wallets/withdraw',
      withdrawalData,
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data && typeof error.response.data === 'object') {
      return error.response.data as IResponseObject<WithdrawalRequest>;
    }
    const errorMsg =
      error.response?.status === 400
        ? 'Thông tin rút tiền không hợp lệ. Vui lòng kiểm tra lại.'
        : error.response?.status === 401
          ? 'Bạn cần đăng nhập lại để tiếp tục'
          : error.response?.status === 403
            ? 'Tài khoản của bạn không có quyền rút tiền'
            : error.response?.status === 422
              ? 'Số tiền không đủ hoặc thông tin tài khoản ngân hàng không hợp lệ'
              : 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    return {
      message: errorMsg,
      messages: [errorMsg],
      content: {} as WithdrawalRequest,
      code: error.response?.status?.toString() || '500',
      success: false,
    };
  }
};

/**
 * Cancel a pending withdrawal request
 * @param id Withdrawal request ID
 */
export const cancelWithdrawal = async (id: string): Promise<IResponseObject<null>> => {
  try {
    const response = await authApi.default.delete<IResponseObject<null>>(`/wallets/withdraw/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data && typeof error.response.data === 'object') {
      return error.response.data as IResponseObject<null>;
    }
    const errorMsg =
      error.response?.status === 400
        ? 'Không thể hủy yêu cầu rút tiền. Vui lòng thử lại sau.'
        : error.response?.status === 401
          ? 'Bạn cần đăng nhập lại để tiếp tục'
          : error.response?.status === 403
            ? 'Bạn không có quyền hủy yêu cầu này'
            : error.response?.status === 404
              ? 'Không tìm thấy yêu cầu rút tiền hoặc đã bị hủy trước đó'
              : error.response?.status === 422
                ? 'Không thể hủy yêu cầu đã được xử lý'
                : 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
    return {
      message: errorMsg,
      messages: [errorMsg],
      content: null,
      code: error.response?.status?.toString() || '500',
      success: false,
    };
  }
};
