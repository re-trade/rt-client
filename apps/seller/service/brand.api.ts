import { authApi, IResponseObject } from '@retrade/util';

type TBrand = {
  id: string;
  name: string;
  imgUrl: string;
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
  async getBrandByNameAndCategoryIds(categoryIds: string[], name?: string): Promise<TBrand[]> {
    if (!categoryIds) {
      return [];
    }
    const queryBuilder = new URLSearchParams();
    categoryIds.forEach((categoryId) => {
      queryBuilder.append('categoryId', categoryId);
    });
    if (name) {
      queryBuilder.set('name', name);
    }
    const response = await authApi.default.get<IResponseObject<TBrand[]>>(
      `/brands/categories?q=${queryBuilder.toString()}`,
    );
    if (response.data.success) {
      return response.data.content;
    }
    return [];
  },
};
export type { TBrand };
