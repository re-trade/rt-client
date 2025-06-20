'use client';
import { useCart } from '@/hooks/use-cart';

export default function CartSummary({
  cartSummary,
  contacts,
  selectedAddressId,
  selectAddress,
}: ReturnType<typeof useCart>) {
  return (
    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
      {/* Address Selection Card */}
      <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Địa chỉ giao hàng</h3>
          </div>
        </div>

        <div className="p-6 bg-orange-25">
          <label
            htmlFor="address-select"
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Chọn địa chỉ giao hàng:
          </label>
          <div className="relative">
            <select
              id="address-select"
              value={selectedAddressId ?? ''}
              onChange={(e) => selectAddress(e.target.value)}
              className="w-full rounded-lg border border-orange-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 hover:border-orange-300 appearance-none"
            >
              <option value="" disabled>
                -- Chọn địa chỉ --
              </option>
              {contacts.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.customerName} - {address.phone} - {address.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {selectedAddressId && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Địa chỉ đã chọn:</p>
                  <p className="font-semibold text-gray-800">
                    {contacts.find((c) => c.id === selectedAddressId)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Tổng đơn hàng</h3>
          </div>
        </div>

        <div className="p-6 bg-orange-25 space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-base font-medium text-gray-600">Giá gốc</span>
              </div>
              <span className="text-base font-semibold text-gray-800">
                {cartSummary.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-base font-medium text-gray-600">Tiết kiệm</span>
              </div>
              <span className="text-base font-semibold text-green-600">
                -{cartSummary.savings.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-base font-medium text-gray-600">Thuế</span>
              </div>
              <span className="text-base font-semibold text-gray-800">
                {cartSummary.tax.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                {cartSummary.total.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 group">
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L17 18"
              />
            </svg>
            <span className="text-base">Tiến hành thanh toán</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
