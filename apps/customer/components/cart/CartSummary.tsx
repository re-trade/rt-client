'use client';
import Modal from '@/components/reusable/modal';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

// Mock voucher data - replace with your actual data structure
const mockVouchers = [
  {
    id: '1',
    code: 'SAVE20',
    name: 'Giảm 20% tối đa 100k',
    discount: 20,
    maxDiscount: 100000,
    minOrder: 500000,
    type: 'percentage',
    expiry: '2024-12-31',
  },
  {
    id: '2',
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    discount: 30000,
    maxDiscount: 30000,
    minOrder: 200000,
    type: 'shipping',
    expiry: '2024-12-25',
  },
  {
    id: '3',
    code: 'WELCOME50',
    name: 'Giảm 50k cho đơn hàng đầu',
    discount: 50000,
    maxDiscount: 50000,
    minOrder: 300000,
    type: 'fixed',
    expiry: '2024-12-20',
  },
];

export default function CartSummary({
  cartSummary,
  contacts,
  selectedAddressId,
  selectAddress,
}: ReturnType<typeof useCart>) {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const calculateVoucherDiscount = () => {
    if (!selectedVoucher) return 0;
    const voucher = mockVouchers.find((v) => v.id === selectedVoucher);
    if (!voucher) return 0;

    if (cartSummary.total < voucher.minOrder) return 0;

    switch (voucher.type) {
      case 'percentage':
        return Math.min((cartSummary.total * voucher.discount) / 100, voucher.maxDiscount);
      case 'fixed':
      case 'shipping':
        return voucher.discount;
      default:
        return 0;
    }
  };

  const voucherDiscount = calculateVoucherDiscount();
  const finalTotal = cartSummary.total - voucherDiscount;

  const applyVoucherCode = () => {
    const voucher = mockVouchers.find((v) => v.code === voucherCode.toUpperCase());
    if (voucher) {
      setSelectedVoucher(voucher.id);
      setVoucherCode('');
    }
  };

  const handleVoucherSelect = (voucherId: string) => {
    setSelectedVoucher(voucherId);
    setShowVoucherModal(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Address Selection Card */}
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
            <h3 className="text-base md:text-lg font-bold text-gray-800">Địa chỉ giao hàng</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25">
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
              className="w-full rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm md:text-base text-gray-700 shadow-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 hover:border-orange-300 appearance-none"
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
            <div className="mt-4 p-3 md:p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Địa chỉ đã chọn:</p>
                  <p className="font-semibold text-sm md:text-base text-gray-800 break-words">
                    {contacts.find((c) => c.id === selectedAddressId)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voucher Selection Card */}
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">Mã giảm giá</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25 space-y-4">
          {/* Voucher Code Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="flex-1 rounded-lg border border-orange-200 px-3 py-2 text-sm md:text-base focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            />
            <button
              onClick={applyVoucherCode}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
            >
              Áp dụng
            </button>
          </div>

          {/* Selected Voucher Display */}
          {selectedVoucher && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    {mockVouchers.find((v) => v.id === selectedVoucher)?.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Browse Vouchers Button */}
          <button
            onClick={() => setShowVoucherModal(true)}
            className="w-full p-3 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-colors text-sm md:text-base font-medium"
          >
            Chọn mã giảm giá khác
          </button>
        </div>
      </div>

      {/* Order Summary Card */}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">Tổng đơn hàng</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25 space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                <span className="text-sm md:text-base font-medium text-gray-600">Giá gốc</span>
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-800">
                {cartSummary.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <span className="text-sm md:text-base font-medium text-gray-600">Tiết kiệm</span>
              </div>
              <span className="text-sm md:text-base font-semibold text-green-600">
                -{cartSummary.savings.toLocaleString('vi-VN')}₫
              </span>
            </div>

            {voucherDiscount > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <span className="text-sm md:text-base font-medium text-gray-600">
                    Mã giảm giá
                  </span>
                </div>
                <span className="text-sm md:text-base font-semibold text-purple-600">
                  -{voucherDiscount.toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                <span className="text-sm md:text-base font-medium text-gray-600">Thuế</span>
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-800">
                {cartSummary.tax.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-4">
            <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-600 flex-shrink-0"></div>
                <span className="text-base md:text-lg font-bold text-gray-900">Tổng cộng</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-orange-600">
                {finalTotal.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <button className="w-full mt-4 md:mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 group">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200"
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
            <span className="text-sm md:text-base">Tiến hành thanh toán</span>
            <svg
              className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 mt-4">
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

      {/* Voucher Modal using the new reusable Modal component */}
      <Modal
        opened={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        title="Chọn mã giảm giá"
        size="md"
        className="max-w-md"
      >
        <div className="p-6 space-y-3">
          {mockVouchers.map((voucher) => {
            const isEligible = cartSummary.total >= voucher.minOrder;
            return (
              <div
                key={voucher.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVoucher === voucher.id
                    ? 'border-orange-500 bg-orange-50'
                    : isEligible
                      ? 'border-gray-200 hover:border-orange-300 bg-white'
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isEligible) {
                    handleVoucherSelect(voucher.id);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-orange-600">{voucher.code}</span>
                  {selectedVoucher === voucher.id && (
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-1">{voucher.name}</p>
                <p className="text-xs text-gray-500">
                  Đơn tối thiểu: {voucher.minOrder.toLocaleString('vi-VN')}₫
                </p>
                {!isEligible && (
                  <p className="text-xs text-red-500 mt-1">Không đủ điều kiện áp dụng</p>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
