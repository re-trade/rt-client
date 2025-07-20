import { authApi, IResponseObject, unAuthApi } from '@retrade/util';

export interface BankResponse {
  id: number;
  name: string;
  code: string;
  bin: string;
  url: string;
}

export interface BankAccountRequest {
  accountNumber: string;
  bankBin: string;
  bankName: string;
  userBankName: string;
}

export interface BankAccountResponse {
  id: string;
  bankBin: string;
  bankName: string;
  accountNumber: string;
  userBankName: string;
  addedDate?: string;
}

const getUserBankAccounts = async (
  page: number = 0,
  size: number = 10,
): Promise<IResponseObject<BankAccountResponse[]> | undefined> => {
  const response = await authApi.default.get<IResponseObject<BankAccountResponse[]>>(
    '/customers/me/bank-info',
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};

const getBanks = async (
  page: number = 0,
  size: number = 10,
): Promise<IResponseObject<BankResponse[]> | undefined> => {
  const response = await unAuthApi.default.get<IResponseObject<BankResponse[]>>('/wallets/banks', {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

const getBankByBin = async (bin: string): Promise<BankResponse | undefined> => {
  const response = await unAuthApi.default.get<IResponseObject<BankResponse>>(
    `/wallets/banks/${bin}`,
  );
  return response.data.content;
};

const insertBankAccount = async (
  payload: BankAccountRequest,
): Promise<IResponseObject<BankAccountResponse> | undefined> => {
  const response = await authApi.default.post<IResponseObject<BankAccountResponse>>(
    '/customers/me/bank-info',
    payload,
  );
  return response.data;
};

const updateBankAccount = async (payload: BankAccountRequest, id: string) => {
  const response = await authApi.default.put<IResponseObject<BankAccountResponse>>(
    `/customers/me/bank-info/${id}`,
    payload,
  );
  return response.data;
};

export { getBankByBin, getBanks, getUserBankAccounts, insertBankAccount, updateBankAccount };
