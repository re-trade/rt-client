'use client';

import Modal from '@/components/reusable/modal';

interface OrderResultModalProps {
  isOpen: boolean;
  orderSuccess: boolean;
  createdOrderId: string | null;
  paymentError: string | null;
  onClose: () => void;
}

export default function OrderResultModal({
  isOpen,
  orderSuccess,
  createdOrderId,
  paymentError,
  onClose,
}: OrderResultModalProps) {
  return (
    <Modal opened={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center p-6 max-w-md mx-auto">
        <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gray-100">
          {orderSuccess ? (
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {orderSuccess ? (
          <div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Đơn hàng đã được tạo thành công!
            </h3>
            <p className="mb-4 text-gray-600">
              Mã đơn hàng:{' '}
              <span className="font-mono font-bold text-orange-600">{createdOrderId}</span>
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Bạn sẽ được chuyển đến trang chi tiết đơn hàng để theo dõi trạng thái.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Không thể tạo đơn hàng</h3>
            <p className="mb-6 text-gray-600">
              {paymentError || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            orderSuccess
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {orderSuccess ? 'Xem đơn hàng' : 'Đóng'}
        </button>
      </div>
    </Modal>
  );
}
