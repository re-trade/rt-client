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
  brandId: string;
  brand: string;
  warrantyExpiryDate: string;
  model: string;
  currentPrice: number;
  categories: string[];
  listOfCategories: {
    id: string;
    name: string;
  }[];
  quantity: number;
  tags: string[];
  verified: boolean;
  condition: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductDto = {
  name: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  model: string;
  currentPrice: number;
  quantity: number;
  warrantyExpiryDate: string;
  condition: string;
  categoryIds: string[];
  tags: string[];
  status: string;
};
export type UpdateProductDto = {
  name: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  quantity: number;
  warrantyExpiryDate: string; // ISO date string (e.g., "2025-07-06")
  condition: string;
  model: string;
  currentPrice: number;
  categoryIds: string[];
  tags: string[];
};

export const productApi = {
  async getProducts(page: number = 0, size: number = 15, query?: string): Promise<TProduct[]> {
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
  async createProduct(product: CreateProductDto): Promise<TProduct> {
    const response = await authApi.default.post<IResponseObject<TProduct>>('/products', product);
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Failed to create product');
  },

  async updateProduct(id: string, product: UpdateProductDto): Promise<TProduct> {
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
