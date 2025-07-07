import { authApi } from '@retrade/util';

type TBrand = {
  id: string;
  name: string;
  url: string;
};

export const brandApi = {
  async getBrands(page: number = 0, size: number = 10, query?: string): Promise<TBrand[]> {
    const response = await authApi.default.get<{ success: boolean; content: TBrand[] }>(`/brands`, {
      params: {
        page,
        size,
        ...(query ? { query } : {}),
      },
    });
    return response.data.success ? response.data.content : [];
  },
  async getBrand(id: string): Promise<TBrand> {
    const response = await authApi.default.get<{ success: boolean; content: TBrand }>(
      `/brands/${id}`,
    );
    return response.data.content;
  },
  async getAllBrandNoPagination(): Promise<TBrand[]> {
    const response = await authApi.default.get<{ success: boolean; content: TBrand[] }>(
      `/brands/all`,
    );
    return response.data.success ? response.data.content : [];
  },
};
export type { TBrand };
