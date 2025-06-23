import { authApi, IResponseObject } from '@retrade/util';

export const storageApi = {
  fileUpload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await authApi.storage.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.content;
  },
  fileBunkUpload: async (file: File[]): Promise<IResponseObject<string[]>> => {
    const formData = new FormData();
    formData.append('files', file);
    const response = await authApi.storage.post('/files/upload/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.content;
  },
};
