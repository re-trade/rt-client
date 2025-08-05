import { authApi, IResponseObject, unAuthApi } from '@retrade/util';

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
    const result =
      await authApi.default.get<IResponseObject<TCustomerProfile>>('/customers/profile');
    if (result.data.success && result.status === 200) {
      return result.data.content;
    }
  } catch {
    return undefined;
  }
};

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const result = await unAuthApi.default.get<IResponseObject<{ existed: boolean }>>(
      `/accounts/check-username?username=${username}`,
    );
    if (result.data.success && result.status === 200) {
      const { content } = result.data;
      return !content.existed;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const result = await unAuthApi.default.get<IResponseObject<{ existed: boolean }>>(
      `/accounts/check-email?email=${email}`,
    );
    if (result.data.success && result.status === 200) {
      const { content } = result.data;
      return !content.existed;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export { checkEmailAvailability, checkUsernameAvailability, getCustomerProfile };
