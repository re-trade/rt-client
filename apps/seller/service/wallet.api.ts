import { authApi, IResponseObject } from '@retrade/util';

export type WalletResponse = {
  accountId: string;
  balance: number;
};
export type BankResponse = {
  id: string;
  name: string;
  code: string;
  url: string;
  bin: string;
};
export type WithdrawHistoryResponse = {
  id: string;
  amount: number;
  bankUrl?: string;
  bankName?: string;
  bankBin?: string;
  status: string;
  processedDate: string;
};
export const walletApi = {
  async getWalletBySeller(): Promise<WalletResponse> {
    const response =
      await authApi.default.get<IResponseObject<WalletResponse>>(`/wallets/me/balance`);
    return response.data.content;
  },
  async getTheBanks(page: number = 0, size: number = 15, query?: string): Promise<BankResponse[]> {
    const response = await authApi.default.get<IResponseObject<BankResponse[]>>(`/banks`, {
      params: {
        page,
        size,
        ...(query ? { query } : {}),
      },
    });
    return response.data.success ? response.data.content : [];
  },
  async getWithdrawHistory(
    page: number = 0,
    size: number = 15,
    query?: string,
  ): Promise<WithdrawHistoryResponse[]> {
    const response = await authApi.default.get<IResponseObject<WithdrawHistoryResponse[]>>(
      `/wallets/me/withdraw`,
      {
        params: {
          page,
          size,
          ...(query ? { query } : {}),
        },
      },
    );
    return response.data.success ? response.data.content : [];
  },
};
