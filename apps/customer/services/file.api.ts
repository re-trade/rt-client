import { authApi, IResponseObject } from '@retrade/util';

export const fileApi = {
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

  fileBulkUpload: async (files: File[]): Promise<IResponseObject<string[]>> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await authApi.storage.post('/files/upload/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
