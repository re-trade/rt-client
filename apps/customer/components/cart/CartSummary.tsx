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
      <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <label htmlFor="address-select" className="block text-sm font-medium text-gray-700">
          Chọn địa chỉ giao hàng:
        </label>
        <select
          id="address-select"
          value={selectedAddressId ?? ''}
          onChange={(e) => selectAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-700"
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
        {selectedAddressId && (
          <p className="text-sm text-gray-500 mt-2">
            Địa chỉ đã chọn:{' '}
            <strong>{contacts.find((c) => c.id === selectedAddressId)?.name}</strong>
          </p>
        )}
      </div>
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-xl font-semibold text-gray-900">Tổng đơn hàng</p>
        <div className="space-y-4">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500">Giá gốc</dt>
            <dd className="text-base font-medium text-gray-900">
              {cartSummary.originalPrice.toLocaleString('vi-VN')}₫
            </dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500">Tiết kiệm</dt>
            <dd className="text-base font-medium text-green-600">
              -{cartSummary.savings.toLocaleString('vi-VN')}₫
            </dd>
          </dl>
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500">Thuế</dt>
            <dd className="text-base font-medium text-gray-900">
              {cartSummary.tax.toLocaleString('vi-VN')}₫
            </dd>
          </dl>
          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
            <dt className="text-base font-bold text-gray-900">Tổng cộng</dt>
            <dd className="text-base font-bold text-gray-900">
              {cartSummary.total.toLocaleString('vi-VN')}₫
            </dd>
          </dl>
        </div>
        <a
          href="#"
          className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
        >
          Tiến hành thanh toán
        </a>
      </div>
    </div>
  );
}
