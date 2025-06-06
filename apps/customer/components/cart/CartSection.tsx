'use client';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { useState } from 'react';

export default function CartSection() {
  const { cartGroups, loading, error, toggleShopSection } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleAddToFavorites = (itemId: string) => {};

  const handleRemove = (itemId: string) => {};

  if (loading) return <div>Đang tải giỏ hàng...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!cartGroups || Object.keys(cartGroups).length === 0) {
    return <div>Giỏ hàng trống</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(cartGroups).map(([sellerId, shopSection]) => (
        <div key={sellerId} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <button
            onClick={() => toggleShopSection(sellerId)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <h3 className="text-lg font-medium text-gray-900">
              Người Bán: {shopSection.sellerName}
            </h3>
            <svg
              className={`h-6 w-6 transform transition-transform ${
                shopSection.isOpen ? 'rotate-180' : ''
              }`}
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
          </button>

          {shopSection.isOpen && (
            <div className="space-y-4 p-4">
              {shopSection.items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6"
                >
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <div className="flex items-center md:order-1">
                      <input
                        type="checkbox"
                        id={`select-item-${item.productId}`}
                        checked={selectedItems.includes(item.productId)}
                        onChange={() => handleCheckboxChange(item.productId)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor={`select-item-${item.productId}`} className="sr-only">
                        Chọn sản phẩm để đặt hàng
                      </label>
                    </div>
                    <a href="#" className="shrink-0 md:order-2">
                      <Image
                        width={80}
                        height={80}
                        className="h-20 w-20"
                        src={item.productThumbnail}
                        alt={`${item.productName} hình ảnh`}
                      />
                    </a>

                    <div className="flex items-center justify-between md:order-4 md:justify-end">
                      <div className="text-end md:w-32">
                        <p className="text-base font-bold text-gray-900">
                          {item.totalPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-3 md:max-w-md">
                      <a href="#" className="text-base font-medium text-gray-900 hover:underline">
                        {item.productName}
                      </a>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleAddToFavorites(item.productId)}
                          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
                        >
                          <svg
                            className="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
                            />
                          </svg>
                          Thêm vào Yêu thích
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.productId)}
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                        >
                          <svg
                            className="me-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18 17.94 6M18 18 6.06 6"
                            />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
