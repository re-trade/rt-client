'use client';

interface SelectedItemsSummaryProps {
  selectedItems: any[];
  cartSummary: {
    total: number;
    originalPrice: number;
  };
}

export default function SelectedItemsSummary({
  selectedItems,
  cartSummary,
}: SelectedItemsSummaryProps) {
  const finalTotal = cartSummary.total;

  return (
    <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-800">Tổng đơn hàng</h3>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-orange-25 space-y-4">
        {/* Selected Items Count */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm md:text-base font-medium text-gray-700">Đã chọn</span>
          </div>
          <span className="text-sm md:text-base font-semibold text-orange-600">
            {selectedItems?.length || 0} sản phẩm
          </span>
        </div>

        {/* Discount if applicable */}
        {cartSummary.originalPrice > cartSummary.total && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm md:text-base font-medium text-green-700">Giảm giá</span>
            </div>
            <span className="text-sm md:text-base font-semibold text-green-600">
              -{(cartSummary.originalPrice - cartSummary.total).toLocaleString('vi-VN')}₫
            </span>
          </div>
        )}

        {/* Total */}
        <div
          className={`${
            cartSummary.originalPrice > cartSummary.total ? 'border-t border-orange-200 pt-4' : ''
          }`}
        >
          <div className="flex items-center justify-between p-4 md:p-5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border border-orange-200 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">Tổng cộng</span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-orange-600">
              {finalTotal.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  );
}
