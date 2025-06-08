import { authApi, IResponseObject } from '@retrade/util';

export interface CartItemResponse {
  productId: string;
  productName: string;
  productThumbnail: string;
  productBrand: string;
  totalPrice: number;
  addedAt: string;
  productAvailable: boolean;
  quantity: number;
}

export interface CartGroupResponse {
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string;
  items: CartItemResponse[];
}

export interface CartResponse {
  customerId: string;
  customerName: string;
  cartGroupResponses: CartGroupResponse[];
  lastUpdated: string;
}

export const cartApi = {
  async getCart(): Promise<CartResponse> {
    try {
      const response = await authApi.default.get<IResponseObject<CartResponse>>('/carts');
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch cart');
    } catch (error) {
      throw error;
    }
  },

  async addToCart(productId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await authApi.default.post<CartResponse>('/carts/items', {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async removeFromCart(productId: string): Promise<CartResponse> {
    try {
      const response = await authApi.default.delete<CartResponse>(`/carts/items/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCartItemQuantity(productId: string, quantity: number): Promise<CartResponse> {
    try {
      const response = await authApi.default.put<CartResponse>(`/carts/items/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async clearCart(): Promise<void> {
    try {
      await authApi.default.delete('/carts');
    } catch (error) {
      throw error;
    }
  },
};
