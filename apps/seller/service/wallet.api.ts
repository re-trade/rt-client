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
export type CreateBankInfor = {
  bankName: string;
  userBankName: string;
  accountNumber: string;
  bankBin: string;
  // isDefault?: boolean;
};
export type BankInfor = {
  id: string;
  bankName: string;
  accountNumber: string;
  userBankName: string;
  bankBin: string;
  // isDefault: boolean;
  addedDate: string;
};
export type WithdrawCreate = {
  amount: number;
  bankProfileId: string;
  content: string;
}
export const walletApi = {
  async getWalletBySeller(): Promise<WalletResponse> {
    const response =
      await authApi.default.get<IResponseObject<WalletResponse>>(`/wallets/me/balance`);
    return response.data.content;
  },
  async getTheBanks(page: number = 0, size: number = 100, query?: string): Promise<BankResponse[]> {
    const response = await authApi.default.get<IResponseObject<BankResponse[]>>(`/wallets/banks`, {
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
  async createWithdraw(withdraw: WithdrawCreate): Promise<WithdrawHistoryResponse> {
    const response = await authApi.default.post<IResponseObject<WithdrawHistoryResponse>>(
      `wallets/withdraw`,
      withdraw,
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Withdraw not created');
    } catch (error) {
      throw error;
    }
  },
  async createBankInfor(bankInfor: CreateBankInfor): Promise<BankInfor> {
    const response = await authApi.default.post<IResponseObject<BankInfor>>(
      `/customers/me/bank-info`,
      bankInfor,
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async getBankInfos(page: number = 0, size: number = 15, query?: string): Promise<BankInfor[]> {
    const response = await authApi.default.get<IResponseObject<BankInfor[]>>(
      `customers/me/bank-info`,
      {
        params: {
          page,
          size,
          ...(query ? { query } : {}),
        },
      },
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async updateBankInfor(id: string, bankInfor: CreateBankInfor): Promise<BankInfor> {
    const response = await authApi.default.put<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}`,
      bankInfor,
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async deleteBankInfor(id: string): Promise<BankInfor> {
    const response = await authApi.default.delete<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}`,
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async setIsDefaultBankInfor(id: string, isDefault: boolean): Promise<BankInfor> {
    const response = await authApi.default.put<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}/default`,
      { isDefault },
    );
    try {
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
};
