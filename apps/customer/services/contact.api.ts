import { IResponseObject, authApi } from '@retrade/util';

export type TAddress = {
  id: string;
  customerName: string;
  phone: string;
  state: string;
  country: string;
  district: string;
  ward: string;
  addressLine: string;
  name: string;
  defaulted: boolean;
  type: number;
};

export const contactApi = {
  async getContacts(page: number = 0, size: number = 10) {
    const response = await authApi.default.get<IResponseObject<TAddress[]>>('/contacts', {
      params: {
        page,
        size,
      },
    });
    return {
      addresses: response.data.success ? response.data.content : [],
      pagination: response.data.pagination || {
        content: [],
        page: 0,
        size: 0,
        totalPages: 0,
        totalElements: 0,
      },
    };
  },
  async getContact(id: string): Promise<TAddress | null> {
    const response = await authApi.default.get<IResponseObject<TAddress>>(`/contacts/${id}`);
    return response.data.success ? response.data.content : null;
  },
  async createContact(data: Omit<TAddress, 'id'>): Promise<TAddress | null> {
    const response = await authApi.default.post<IResponseObject<TAddress>>('/contacts', data);
    return response.data.success ? response.data.content : null;
  },
  async updateContact(id: string, data: Omit<TAddress, 'id'>): Promise<TAddress | null> {
    const response = await authApi.default.put<IResponseObject<TAddress>>(`/contacts/${id}`, data);
    return response.data.success ? response.data.content : null;
  },
  async removeContact(id: string): Promise<TAddress | null> {
    const response = await authApi.default.delete<IResponseObject<TAddress>>(`/contacts/${id}`);
    return response.data.success ? response.data.content : null;
  },
};
