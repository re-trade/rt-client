import { authApi, IResponseObject } from '@retrade/util';

export type TProductStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'INIT' | 'DRAFT';

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
  categories: {
    id: string;
    name: string;
  }[];
  quantity: number;
  tags: string[];
  verified: boolean;
  condition: string;
  status: TProductStatus;
  avgVote: number;
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
  status: TProductStatus;
};
export type UpdateProductDto = {
  name: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  productImages: string[];
  brandId: string;
  quantity: number;
  warrantyExpiryDate: string;
  condition: string;
  model: string;
  currentPrice: number;
  categoryIds: string[];
  tags: string[];
};

export type ProductFilterResponse = {
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
  minPrice: number;
  maxPrice: number;
};

export const productApi = {
  async getProducts(
    page: number = 0,
    size: number = 15,
    query?: string,
  ): Promise<{
    products: TProduct[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  }> {
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
    const products = response.data.success ? response.data.content : [];
    return {
      products,
      totalPages: response.data.pagination?.totalPages || 1,
      totalElements: response.data.pagination?.totalElements || products.length,
      currentPage: (response.data.pagination?.page || 0) + 1,
      pageSize: response.data.pagination?.size || size,
    };
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

  async getProductFilter(): Promise<ProductFilterResponse | undefined> {
    const response =
      await authApi.default.get<IResponseObject<ProductFilterResponse>>(`/products/seller/filter`);
    if (response.data.success) {
      return response.data.content;
    }
    return undefined;
  },

  async deleteProduct(id: string): Promise<TProduct> {
    const response = await authApi.default.delete<IResponseObject<TProduct>>(`/product/${id}`);
    if (response.data.success) {
      return response.data.content;
    }
    throw new Error('Failed to delete product');
  },
};
