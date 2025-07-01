import { IResponseObject, unAuthApi } from '@retrade/util';

export type TProduct = {
  id: string;
  name: string;
  sellerId: string;
  sellerShopName: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  brand: string;
  quantity: number;
  warrantyExpiryDate: string;
  model: string;
  currentPrice: number;
  categories: string[];
  tags: string[];
  keywords?: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TProductFilter = {
  categoriesAdvanceSearch: {
    id: string;
    name: string;
  }[];
  brands: {
    id: string;
    name: string;
    imgUrl: string;
  }[];
  states: string[];
  sellers: {
    sellerId: string;
    sellerName: string;
    sellerAvatarUrl: string;
  }[];
  minPrice: number;
  maxPrice: number;
};

export const productApi = {
  async getProducts(page: number = 0, size: number = 10, query?: string): Promise<TProduct[]> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products', {
      params: {
        page,
        size,
        ...(query ? { query } : {}),
      },
    });
    return response.data.success ? response.data.content : [];
  },
  async searchProducts(
    page: number = 0,
    size: number = 10,
    query?: string,
  ): Promise<IResponseObject<TProduct[]>> {
    const response = await unAuthApi.default.get<IResponseObject<TProduct[]>>('/products/search', {
      params: {
        page,
        size,
        ...(query ? { q: query } : {}),
      },
    });
    return response.data;
  },
  async getProduct(id: string): Promise<TProduct> {
    try {
      const response = await unAuthApi.default.get<IResponseObject<TProduct>>(`/products/${id}`);
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async getProductFilter(keyword: string): Promise<TProductFilter> {
    const response = await unAuthApi.default.get<IResponseObject<TProductFilter>>(
      '/products/filter',
      {
        params: {
          q: `keyword=${keyword}`,
        },
      },
    );
    if (!response.data.success) {
      throw new Error('Failed to fetch filter');
    }
    return response.data.content;
  },
};
