'use client';

import CartSkeleton from '@/components/cart/CartSkeleton';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';

export default function CartSection({
  cartGroups,
  loading,
  error,
  toggleShopSection,
  selectedItems,
  toggleItemSelection,
  removeCartItem,
}: ReturnType<typeof useCart>) {
  const handleCheckboxChange = (itemId: string) => {
    toggleItemSelection(itemId);
  };
  const handleRemove = async (itemId: string) => {
    removeCartItem(itemId);
  };

  if (loading || error || !cartGroups || Object.keys(cartGroups).length === 0) {
    return <CartSkeleton />;
  }

  return (
    <>
      {Object.entries(cartGroups).map(([sellerId, shopSection]) => (
        <div
          key={sellerId}
          className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <button
            onClick={() => toggleShopSection(sellerId)}
            className="flex w-full items-center justify-between p-6 text-left bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150 transition-all duration-200"
          >
            <h3 className="text-lg font-bold text-gray-800">Người Bán: {shopSection.sellerName}</h3>
            <svg
              className={`h-6 w-6 transition-transform duration-300 text-orange-600 ${shopSection.isOpen ? 'rotate-180' : ''}`}
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
            <div className="space-y-4 p-6 bg-orange-25">
              {shopSection.items.map((item) => {
                const isSoldOut = !item.productAvailable;

                return (
                  <div
                    key={item.productId}
                    className={`rounded-lg border border-orange-50 p-6 shadow-sm transition-shadow duration-200 ${isSoldOut ? 'bg-gray-100 opacity-70' : 'bg-white hover:shadow-md'}`}
                  >
                    <div className="md:flex md:items-center md:justify-between md:gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.productId)}
                          onChange={() => handleCheckboxChange(item.productId)}
                          disabled={!item.productAvailable}
                          className="h-5 w-5 rounded border-orange-200 text-orange-500 focus:ring-orange-400 focus:ring-2"
                        />
                      </div>
                      <div className="relative rounded-lg overflow-hidden bg-orange-25 p-2">
                        <Image
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover"
                          src={item.productThumbnail}
                          alt={`${item.productName} hình ảnh`}
                        />
                        {isSoldOut && (
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            Đã bán
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <a
                          href="#"
                          className={`block text-base font-semibold transition-colors ${isSoldOut
                            ? 'text-gray-500 pointer-events-none'
                            : 'text-gray-800 hover:text-orange-600 hover:underline'
                            }`}
                        >
                          {item.productName}
                        </a>
                        <p className="text-sm text-gray-600">{item.addedAt}</p>
                        <div className="flex items-center gap-6">
                          <button
                            type="button"
                            onClick={() => handleRemove(item.productId)}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:underline transition-colors font-medium"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                          {item.totalPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
