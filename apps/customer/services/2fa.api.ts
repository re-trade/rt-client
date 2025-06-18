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

export { register2FAInternal };
