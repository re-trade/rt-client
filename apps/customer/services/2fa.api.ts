import { authApi } from '@retrade/util';

const register2FAInternal = async (width: number = 300, height: number = 300): Promise<Blob> => {
  const response = await authApi.default.post(
    `/auth/register/2fa?width=${width}&height=${height}`,
    null,
    {
      responseType: 'blob',
      headers: {
        Accept: 'image/png',
      },
      withCredentials: true,
    },
  );
  return response.data;
};

const verify2FAInternal = async (code: string): Promise<boolean> => {
  try {
    const response = await authApi.default.patch(
      `/auth/2fa/verify`,
      { code },
      {
        withCredentials: true,
      },
    );
    return response.status === 200;
  } catch {
    return false;
  }
};

const disable2FAInternal = async (password: string): Promise<boolean> => {
  try {
    return true;
  } catch {
    return false;
  }
};

export { disable2FAInternal, register2FAInternal, verify2FAInternal };
