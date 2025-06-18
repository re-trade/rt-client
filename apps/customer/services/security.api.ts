import { authApi } from '@retrade/util';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailPayload {
  newEmail: string;
  password: string;
}

interface ChangePhonePayload {
  newPhone: string;
  password: string;
}

/**
 * Change user password
 */
const changePasswordInternal = async (payload: ChangePasswordPayload): Promise<boolean> => {
  try {
    const response = await authApi.default.patch('/accounts/password', payload, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    throw error;
  }
};

/**
 * Change user email
 */
const changeEmailInternal = async (payload: ChangeEmailPayload): Promise<boolean> => {
  try {
    const response = await authApi.default.patch('/accounts/email', payload, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    throw error;
  }
};

/**
 * Change user phone number
 */
const changePhoneInternal = async (payload: ChangePhonePayload): Promise<boolean> => {
  try {
    const response = await authApi.default.patch('/accounts/phone', payload, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    throw error;
  }
};

export {
  changeEmailInternal,
  changePasswordInternal,
  changePhoneInternal,
  type ChangeEmailPayload,
  type ChangePasswordPayload,
  type ChangePhonePayload,
};
