import { unAuthApi, authApi } from "@retrade/util";
export type TSeller = {
  id: string;
  createdDate: string; 
  updatedDate: string;
  address: string;
  avatarUrl: string;
  background: string;
  businessType: string;
  description: string;
  email: string;
  frontSideIdentityCard: string;
  backSideIdentityCard: string;
  identityNumber: string;
  phoneNumber: string;
  shopName: string;
  taxCode: string;
  verified: boolean;
  accountId: string;
};


export const AuthSellerApi={
    async register(): Promise<TSeller> {
        const response = await authApi.default.post<TSeller>('/auth/seller/register');
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to register seller');
    },
    async getShopSeller(id: string): Promise<TSeller> {
        const response = await authApi.default.get<TSeller>(`/auth/seller/${id}`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to get seller shop');
    },
    async updateShopSeller(id: string, data: Partial<TSeller>): Promise<TSeller> {
        const response = await authApi.default.put<TSeller>(`/auth/seller/${id}`, data);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to update seller shop');
    },
    
}