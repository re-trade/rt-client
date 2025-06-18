import { authApi } from '@retrade/util';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailPayload {
  newEmail: string;
  passwordConfirm: string;
}

interface ChangePhonePayload {
  newPhone: string;
  passwordConfirm: string;
}

interface ChangeUsernamePayload {
  username: string;
  passwordConfirm: string;
}

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

const changePhoneInternal = async (payload: ChangePhonePayload): Promise<boolean> => {
  try {
    const response = await authApi.default.patch('/customers/phone', payload, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    throw error;
  }
};

const changeUsernameInternal = async (payload: ChangeUsernamePayload): Promise<boolean> => {
  try {
    const response = await authApi.default.patch('/accounts/username', payload, {
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
  changeUsernameInternal,
  type ChangeEmailPayload,
  type ChangePasswordPayload,
  type ChangePhonePayload,
  type ChangeUsernamePayload,
};
