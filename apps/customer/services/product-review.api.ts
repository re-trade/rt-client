import { IResponseObject, unAuthApi } from '@retrade/util';
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
  imageUrls: string[];
  reply?: {
    content: string;
    createdAt: string;
    updatedAt?: string;
  };
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
};
