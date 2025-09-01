import { authApi, IResponseObject } from '@retrade/util';

export interface PaymentInitRequest {
  paymentMethodId: string;
  paymentContent: string;
  orderId: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

export interface PaymentStatusResponse {
  paid: boolean;
  relatedComboIds: string[];
  orderId: string;
}

export interface PaymentHistoryItem {
  orderId: string;
  paymentMethodName: string;
  paymentMethodIcon: string;
  paymentTotal: number;
  paymentContent: string;
  paymentCode: string;
  paymentStatus: 'CREATED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentTime: string;
}

export const paymentApi = {
  async initPayment(payload: PaymentInitRequest): Promise<string> {
    if (!payload.paymentMethodId || !payload.orderId) {
      throw new Error('Thông tin thanh toán không hợp lệ');
    }

    try {
      const response = await authApi.default.post<IResponseObject<string>>(
        '/payments/init',
        payload,
      );

      if (response.data.success && response.data.content) {
        const paymentUrl = response.data.content.trim();
        if (!paymentUrl) {
          throw new Error('Không nhận được URL thanh toán từ server');
        }

        try {
          new URL(paymentUrl);
        } catch {
          throw new Error('URL thanh toán không hợp lệ');
        }

        return paymentUrl;
      }

      const errorMessage = response.data.message || 'Không thể khởi tạo thanh toán';
      throw new Error(errorMessage);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
      if (error.response?.status === 403) {
        throw new Error('Không có quyền thực hiện thanh toán');
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thông tin đơn hàng');
      }
      if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau');
      }

      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể khởi tạo thanh toán';
      throw new Error(errorMessage);
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await authApi.default.get<IResponseObject<PaymentMethod[]>>(
        '/payments/methods?page=0&size=10',
      );

      if (response.data.success && response.data.content) {
        const methods = response.data.content;
        if (!Array.isArray(methods)) {
          throw new Error('Dữ liệu phương thức thanh toán không hợp lệ');
        }
        return methods;
      }

      const errorMessage = response.data.message || 'Không thể tải phương thức thanh toán';
      throw new Error(errorMessage);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
      if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau');
      }

      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải phương thức thanh toán';
      throw new Error(errorMessage);
    }
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await authApi.default.get<IResponseObject<PaymentStatusResponse>>(
        `/payments/order/${orderId}`,
      );
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch payment status');
    } catch (error) {
      throw error;
    }
  },

  async getOrderPaymentStatus(orderId: string): Promise<{ paid: boolean; orderId: string }> {
    try {
      const response = await authApi.default.get<
        IResponseObject<{ paid: boolean; orderId: string }>
      >(`/payments/order/root/${orderId}`);
      if (response.data.success) {
        return response.data.content;
      }
      throw new Error('Failed to fetch order payment status');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thông tin đơn hàng');
      }
      if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau');
      }
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải trạng thái thanh toán';
      throw new Error(errorMessage);
    }
  },

  async getPaymentHistory(orderId: string): Promise<PaymentHistoryItem[]> {
    try {
      const response = await authApi.default.get<IResponseObject<PaymentHistoryItem[]>>(
        `/payments/order/root/${orderId}/history`,
      );
      if (response.data.success) {
        return response.data.content || [];
      }
      throw new Error('Failed to fetch payment history');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy lịch sử thanh toán');
      }
      if (error.response?.status >= 500) {
        throw new Error('Lỗi server. Vui lòng thử lại sau');
      }
      const errorMessage =
        error.response?.data?.message || error.message || 'Không thể tải lịch sử thanh toán';
      throw new Error(errorMessage);
    }
  },
};
