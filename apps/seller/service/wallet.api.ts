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
  accountNumber: string;
  processedDate: string;
  createdDate: string;
};

export type PaginatedWithdrawHistoryResponse = {
  withdrawHistory: WithdrawHistoryResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type PaginatedBankInfoResponse = {
  bankInfos: BankInfor[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
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
};
export const walletApi = {
  async getWalletBySeller(): Promise<IResponseObject<WalletResponse>> {
    const response =
      await authApi.default.get<IResponseObject<WalletResponse>>(`/wallets/me/balance`);
    return response.data;
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
  async getWithdrawHistoryPaginated(
    page: number = 0,
    size: number = 15,
    query?: string,
  ): Promise<PaginatedWithdrawHistoryResponse> {
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

    const defaultResponse = {
      withdrawHistory: [] as WithdrawHistoryResponse[],
      totalPages: 1,
      totalElements: 0,
      currentPage: 1,
      pageSize: size,
    };

    if (!response.data) {
      return defaultResponse;
    }

    const withdrawHistory =
      response.data.success && response.data.content ? response.data.content : [];
    const pagination = response.data.pagination;

    return {
      withdrawHistory,
      totalPages: pagination ? pagination.totalPages || 1 : 1,
      totalElements: pagination
        ? pagination.totalElements || withdrawHistory.length
        : withdrawHistory.length,
      currentPage: pagination ? (pagination.page || 0) + 1 : 1,
      pageSize: pagination ? pagination.size || size : size,
    };
  },
  async createWithdraw(
    withdraw: WithdrawCreate,
  ): Promise<IResponseObject<WithdrawHistoryResponse>> {
    const response = await authApi.default.post<IResponseObject<WithdrawHistoryResponse>>(
      `wallets/withdraw`,
      withdraw,
    );
    return response.data;
  },
  async createBankInfor(bankInfor: CreateBankInfor): Promise<IResponseObject<BankInfor>> {
    const response = await authApi.default.post<IResponseObject<BankInfor>>(
      `/customers/me/bank-info`,
      bankInfor,
    );
    return response.data;
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
  async getBankInfosPaginated(
    page: number = 0,
    size: number = 15,
    query?: string,
  ): Promise<PaginatedBankInfoResponse> {
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

    const defaultResponse = {
      bankInfos: [] as BankInfor[],
      totalPages: 1,
      totalElements: 0,
      currentPage: 1,
      pageSize: size,
    };

    try {
      if (!response.data) {
        return defaultResponse;
      }

      const bankInfos = response.data.success && response.data.content ? response.data.content : [];
      const pagination = response.data.pagination;

      return {
        bankInfos,
        totalPages: pagination ? pagination.totalPages || 1 : 1,
        totalElements: pagination ? pagination.totalElements || bankInfos.length : bankInfos.length,
        currentPage: pagination ? (pagination.page || 0) + 1 : 1,
        pageSize: pagination ? pagination.size || size : size,
      };
    } catch (error) {
      return defaultResponse;
    }
  },
  async updateBankInfor(
    id: string,
    bankInfor: CreateBankInfor,
  ): Promise<IResponseObject<BankInfor>> {
    const response = await authApi.default.put<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}`,
      bankInfor,
    );
    return response.data;
  },
  async deleteBankInfor(id: string): Promise<IResponseObject<BankInfor>> {
    const response = await authApi.default.delete<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}`,
    );
    return response.data;
  },
  async setIsDefaultBankInfor(id: string, isDefault: boolean): Promise<IResponseObject<BankInfor>> {
    const response = await authApi.default.put<IResponseObject<BankInfor>>(
      `/customers/me/bank-info/${id}/default`,
      { isDefault },
    );
    return response.data;
  },
};
