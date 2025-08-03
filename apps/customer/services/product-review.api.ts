import { unAuthApi,authApi, IResponseObject } from "@retrade/util";
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
        productId: string, page: number = 1, size: number = 4): Promise<ReviewResponse[]> => {
        const response = await unAuthApi.default.get<IResponseObject<ReviewResponse[]>>(
            `/products/${productId}/reviews`,
            {
                params: {
                    page,
                    size,
                },
            },
        );
        return response.data.content;
    },
}