import { authApi, IResponseObject } from '@retrade/util';

export type TProduct = {
  id: string;
  name: string;
  sellerId: string;
  sellerShopName: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brand: string;
  discount: string;
  model: string;
  currentPrice: number;
  categories: string[];
  keywords: string[];
  tags: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

export const productApi = {
  async getProducts(
    page: number = 1,
    size: number = 10,
    query?: string,
  ): Promise<TProduct[]> {
    const response = await authApi.default.get<IResponseObject<TProduct[]>>(
      `/products/my-products`,
      {
        params: {
          page,
          size,
          ...(query ? { query } : {}),
        },
      },
    );
    return response.data.success ? response.data.content : [];
  },
  async getProduct(id: string): Promise<TProduct> {
    try {
      const response = await authApi.default.get<IResponseObject<TProduct>>(`/products/${id}`);
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Product not found');
    } catch (error) {
      throw error;
    }
  },
  async createProdut(product: TProduct): Promise<TProduct> {
    const response = await authApi.default.post<IResponseObject<TProduct>>('/products', product);
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Failed to create product');
  },
  async updateProduct(id: string, product: Partial<TProduct>): Promise<TProduct> {
    const response = await authApi.default.put<IResponseObject<TProduct>>(
      `/products/${id}`,
      product,
    );
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Failed to update product');
  },

  async deleteProduct(id: string): Promise<TProduct> {
    const response = await authApi.default.delete<IResponseObject<TProduct>>(`/product/${id}`);
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Failed to delete product');
  },
};
