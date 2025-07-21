import { authApi, IResponseObject } from '@retrade/util';

export type WalletBalance = {
  balance: number;
};

export type WithdrawalRequest = {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  processedDate: string;
  bankBin: string;
  bankName: string;
  bankUrl: string;
};

export type CreateWithdrawalRequest = {
  amount: number;
  bankBin: string;
  accountNumber: string;
  accountName: string;
};

export const getWalletBalance = async (): Promise<WalletBalance | undefined> => {
  try {
    const response =
      await authApi.default.get<IResponseObject<WalletBalance>>('/wallets/me/balance');
    return response.data.content;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return undefined;
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
): Promise<IResponseObject<WithdrawalRequest[]> | undefined> => {
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
  } catch {
    return undefined;
  }
};

/**
 * Create a new withdrawal request
 * @param withdrawalData Withdrawal request data
 */
export const createWithdrawal = async (
  withdrawalData: CreateWithdrawalRequest,
): Promise<IResponseObject<WithdrawalRequest> | undefined> => {
  try {
    const response = await authApi.default.post<IResponseObject<WithdrawalRequest>>(
      '/wallets/me/withdrawals',
      withdrawalData,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    return undefined;
  }
};

/**
 * Cancel a pending withdrawal request
 * @param id Withdrawal request ID
 */
export const cancelWithdrawal = async (id: string): Promise<IResponseObject<null> | undefined> => {
  try {
    const response = await authApi.default.delete<IResponseObject<null>>(
      `/wallets/me/withdraw/${id}/cancel`,
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling withdrawal:', error);
    return undefined;
  }
};
