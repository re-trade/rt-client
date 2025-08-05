import { authApi, IResponseObject, unAuthApi } from '@retrade/util';
import { TProduct } from './product.api';
export type ReviewResponse = {
  id: string;
  product: {
    productId: string;
    productName: string;
    thumbnailUrl?: string;
  };
  isVerifiedPurchase: boolean;
  content: string;
  author: {
    authId: string;
    name: string;
    avatarUrl?: string;
  };
  vote: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  helpful: number;
  images: string[];
  reply?: {
    content: string;
    createdAt: string;
    updatedAt?: string;
  };
};

export type ProductNoReview = {
  product: TProduct;
  orderDate: string;
  orderId: string;
  orderComboId?: string;
  orderAmount: number;
};

export type CreateReview = {
  orderId: string;
  productId: string;
  content: string;
  vote: number;
  imageReview: string[];
};

export const reviewApi = {
  getReviews: async (
    productId: string,
    page: number = 0,
    size: number = 4,
  ): Promise<ReviewResponse[]> => {
    const response = await unAuthApi.default.get<IResponseObject<ReviewResponse[]>>(
      `/product-review/product/${productId}`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },
  getTotalReviews: async (productId: string): Promise<number> => {
    const response = await unAuthApi.default.get<IResponseObject<number>>(
      `/product-review/product/${productId}/count`,
    );
    return response.data.content;
  },
  getProductBuyNoReview: async (page: number = 0, size: number = 4): Promise<ProductNoReview[]> => {
    const response = await authApi.default.get<IResponseObject<ProductNoReview[]>>(
      `/product-review/no-review`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },
  getMyReviews: async (page: number = 0, size: number = 4): Promise<ReviewResponse[]> => {
    const response = await authApi.default.get<IResponseObject<ReviewResponse[]>>(
      '/product-review/my',
      {
        params: {
          page,
          size,
        },
      },
    );
    return response.data.content;
  },
  createReview: async (createReview: CreateReview): Promise<ReviewResponse> => {
    const response = await authApi.default.post<IResponseObject<ReviewResponse>>(
      '/product-review',
      {
        createRequest: createReview,
      },
    );
    return response.data.content;
  },
};
