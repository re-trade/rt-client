import { authApi, IResponseObject } from '@retrade/util';

type TCustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  username: string;
  email: string;
};

const getCustomerProfile = async (): Promise<TCustomerProfile | undefined> => {
  try {
    const result = await authApi.default.get<IResponseObject<TCustomerProfile>>('/customers/profile');
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
  } catch {
    return undefined;
  }
};

export { getCustomerProfile };