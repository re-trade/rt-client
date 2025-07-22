import { authApi, IResponseObject } from '@retrade/util';

export type TCustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  username: string;
  email: string;
  gender: string;
  enabled: boolean;
  lastUpdate: string;
};

const getCustomers = async (
  page: number = 0,
  size: number = 10,
  query?: string,
): Promise<IResponseObject<TCustomerProfile[]> | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TCustomerProfile[]>>(`/customers`, {
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

const disableCustomer = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(
    `/customers/${id}/disable-customer`,
  );
  if (result.data.success) {
    return result.data;
  } else return undefined;
};

const enableCustomer = async (id: string): Promise<IResponseObject<null> | undefined> => {
  const result = await authApi.default.put<IResponseObject<null>>(
    `/customers/${id}/enable-customer`,
  );
  if (result.data.success) {
    return result.data;
  } else return undefined;
};

export { disableCustomer, enableCustomer, getCustomers };
