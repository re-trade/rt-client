import { authApi, IResponseObject } from '@retrade/util';

export type TBankProfile = {
  id: string;
  name: string;
  code: string;
  bin: string;
  url: string;

};

export type TWithdrawProfile = {
  id: string;
  amount: number;
  status: string;
  timestamp: string;
  bankBin: string;
  bankName: string;
  bankUrl: string;

};

const getWithdraws = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TWithdrawProfile[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TWithdrawProfile[]>>(`/wallets/me/withdraw`, {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch {
    return undefined;
  }
};

const getBanks = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TBankProfile[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TBankProfile[]>>(`/wallets/banks`, {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    if (result.data.success && result.status === 200) {
      return result.data;
    }
  } catch {
    return undefined;
  }
};
const approveWithdraw = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(`/wallets/withdraw/${id}/approve`);
  if (result.data.success) {
    return result.data;
  } else return undefined;
};



export { getWithdraws, getBanks, approveWithdraw };
