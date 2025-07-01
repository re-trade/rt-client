'use client';

import CartEmpty from '@/components/cart/CartEmpty';
import CartSkeleton from '@/components/cart/CartSkeleton';
import Checkbox from '@/components/reusable/checkbox';
import Modal from '@/components/reusable/modal';
import { useCart } from '@/context/CartContext';
import { IconAlertTriangle, IconCheck, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';

export default function CartSection({
  cartGroups,
  loading,
  error,
  toggleShopSection,
  selectedItems,
  toggleItemSelection,
  refresh,
}: ReturnType<typeof useCart>) {
  const { removeFromCart } = useCart();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleProductSelect = (itemId: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('label') ||
      target.closest('input')
    ) {
      return;
    }
    toggleItemSelection(itemId);
  };

  const handleCheckboxClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleItemSelection(itemId);
  };

  const handleRemoveClick = (itemId: string, itemName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setItemToRemove({ id: itemId, name: itemName });
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;

    setRemovingItems((prev) => new Set([...prev, itemToRemove.id]));

    try {
      await removeFromCart(itemToRemove.id);
    } catch {
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemToRemove.id);
        return newSet;
      });
      setItemToRemove(null);
      setShowRemoveModal(false);
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
    setShowRemoveModal(false);
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!cartGroups || Object.keys(cartGroups).length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {Object.entries(cartGroups).map(([sellerId, shopSection]) => {
        const shopSelectedCount = shopSection.items.filter((item) =>
          selectedItems.includes(item.productId),
        ).length;
        const shopAvailableCount = shopSection.items.filter((item) => item.productAvailable).length;
        const allShopItemsSelected =
          shopSelectedCount === shopAvailableCount && shopAvailableCount > 0;
        const someShopItemsSelected =
          shopSelectedCount > 0 && shopSelectedCount < shopAvailableCount;

        const handleShopSelectAll = (event: React.MouseEvent) => {
          // Prevent accordion toggle when clicking checkbox
          event.stopPropagation();
          event.preventDefault();

          if (allShopItemsSelected) {
            // Deselect all items in this shop
            shopSection.items.forEach((item) => {
              if (selectedItems.includes(item.productId)) {
                toggleItemSelection(item.productId);
              }
            });
          } else {
            // Select all available items in this shop
            shopSection.items.forEach((item) => {
              if (item.productAvailable && !selectedItems.includes(item.productId)) {
                toggleItemSelection(item.productId);
              }
            });
          }
        };

        const handleAccordionToggle = (event: React.MouseEvent) => {
          // Prevent if clicking on checkbox
          const target = event.target as HTMLElement;
          if (target.closest('.shop-checkbox')) {
            return;
          }
          toggleShopSection(sellerId);
        };

        return (
          <div
            key={sellerId}
            className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-100">
              {/* Shop Header with separated click areas */}
              <div className="p-4 md:p-6">
                <div
                  className="flex items-center justify-between w-full cursor-pointer group"
                  onClick={handleAccordionToggle}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Shop Selection Checkbox - Separated click area */}
                    <div className="shop-checkbox flex-shrink-0" onClick={handleShopSelectAll}>
                      <Checkbox
                        checked={allShopItemsSelected}
                        indeterminate={someShopItemsSelected}
                        onChange={() => {}} // Handled by onClick above
                        variant="primary"
                        size="md"
                        round={true}
                        className="hover:scale-110 transition-transform"
                        disabled={shopAvailableCount === 0}
                      />
                    </div>

                    {/* Shop Info - Clickable area for accordion toggle */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-orange-700 transition-colors">
                          {shopSection.sellerName}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          {shopSelectedCount}/{shopAvailableCount} sản phẩm được chọn
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <div className="flex-shrink-0 ml-3">
                    <svg
                      className={`w-5 h-5 text-orange-600 transition-all duration-200 ease-out transform origin-center group-hover:text-orange-700 group-hover:scale-110 ${
                        shopSection.isOpen ? 'rotate-180' : 'rotate-0'
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
                  </div>
                </div>
              </div>

              {/* Accordion content */}
              <div
                className={`grid text-sm overflow-hidden transition-all duration-300 ease-in-out ${
                  shopSection.isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
                    {shopSection.items.map((item) => {
                      const isSoldOut = !item.productAvailable;
                      const isSelected = selectedItems.includes(item.productId);
                      const isRemoving = removingItems.has(item.productId);

                      return (
                        <div
                          key={item.productId}
                          className={`relative rounded-lg border p-4 md:p-6 shadow-sm transition-all duration-200 ${
                            isRemoving
                              ? 'bg-red-50 border-red-200 opacity-60 pointer-events-none'
                              : isSoldOut
                                ? 'bg-gray-100 opacity-70 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-orange-50 border-orange-300 shadow-md cursor-pointer ring-2 ring-orange-200'
                                  : 'bg-white border-orange-50 hover:bg-orange-25 hover:border-orange-200 hover:shadow-md cursor-pointer'
                          }`}
                          onClick={(e) =>
                            !isSoldOut && !isRemoving && handleProductSelect(item.productId, e)
                          }
                        >
                          {/* Removing Overlay */}
                          {isRemoving && (
                            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20 rounded-lg">
                              <div className="flex items-center gap-2 text-red-600">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                                <span className="font-medium">Đang xóa...</span>
                              </div>
                            </div>
                          )}

                          {/* Selection Control - Top Right Corner */}
                          <div className="absolute top-3 right-3 z-10">
                            {isSelected && !isSoldOut && !isRemoving ? (
                              // Selected Indicator
                              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                                <IconCheck
                                  size={16}
                                  className="text-white drop-shadow-sm"
                                  stroke={3}
                                />
                              </div>
                            ) : !isSoldOut && !isRemoving ? (
                              // Checkbox when not selected
                              <div onClick={(e) => handleCheckboxClick(item.productId, e)}>
                                <Checkbox
                                  checked={false}
                                  onChange={() => {}} // Handled by onClick above
                                  variant="primary"
                                  size="md"
                                  round={true}
                                  className="opacity-70 hover:opacity-100 transition-opacity"
                                />
                              </div>
                            ) : null}
                          </div>

                          {/* Mobile Layout */}
                          <div className="flex items-start gap-3 md:hidden pr-8">
                            <div className="relative rounded-lg overflow-hidden bg-orange-25 p-2 flex-shrink-0">
                              <Image
                                width={60}
                                height={60}
                                className="h-15 w-15 object-cover rounded"
                                src={item.productThumbnail}
                                alt={`${item.productName} hình ảnh`}
                              />
                              {isSoldOut && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    Hết hàng
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-semibold transition-colors mb-1 ${
                                  isSoldOut || isRemoving ? 'text-gray-500' : 'text-gray-800'
                                }`}
                              >
                                {item.productName}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">{item.addedAt}</p>
                              <p className="text-base font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded inline-block">
                                {item.totalPrice.toLocaleString('vi-VN')}₫
                              </p>
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleRemoveClick(item.productId, item.productName, e)
                                  }
                                  disabled={isRemoving}
                                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors font-medium p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <IconTrash size={12} />
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex md:items-center md:justify-between md:gap-6 w-full pr-10">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="relative rounded-lg overflow-hidden bg-orange-25 p-2 flex-shrink-0">
                                <Image
                                  width={80}
                                  height={80}
                                  className="h-20 w-20 object-cover rounded"
                                  src={item.productThumbnail}
                                  alt={`${item.productName} hình ảnh`}
                                />
                                {isSoldOut && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                      Hết hàng
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 space-y-2 min-w-0">
                                <h4
                                  className={`text-base font-semibold transition-colors ${
                                    isSoldOut || isRemoving ? 'text-gray-500' : 'text-gray-800'
                                  }`}
                                >
                                  {item.productName}
                                </h4>
                                <p className="text-sm text-gray-600">{item.addedAt}</p>

                                <div className="flex items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleRemoveClick(item.productId, item.productName, e)
                                    }
                                    disabled={isRemoving}
                                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors font-medium p-2 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <IconTrash size={16} />
                                    Xóa khỏi giỏ hàng
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-orange-600 bg-orange-100 px-3 py-2 rounded-lg">
                                {item.totalPrice.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>

                          {/* Selection State Indicator Border */}
                          {isSelected && !isSoldOut && !isRemoving && (
                            <div className="absolute inset-0 border-2 border-orange-400 rounded-lg pointer-events-none opacity-60"></div>
                          )}
                        </div>
                      );
                    })}

                    {/* Shop Summary */}
                    {shopSection.items.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 002 2h8a2 2 0 002-2v-2H4v2z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-800">
                              Tổng cộng ({shopSelectedCount} sản phẩm)
                            </span>
                          </div>
                          <span className="text-xl font-bold text-orange-600">
                            {shopSection.items
                              .filter((item) => selectedItems.includes(item.productId))
                              .reduce((total, item) => total + item.totalPrice, 0)
                              .toLocaleString('vi-VN')}
                            ₫
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Overall Cart Summary */}
      {Object.keys(cartGroups).length > 0 && (
        <div className="sticky bottom-4 bg-white rounded-xl border-2 border-orange-200 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-gray-800">
                  Đã chọn {selectedItems.length} sản phẩm
                </span>
                <p className="text-sm text-gray-600">Nhấp vào sản phẩm để chọn/bỏ chọn</p>
              </div>
            </div>

            {selectedItems.length > 0 && (
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Tiếp tục với {selectedItems.length} sản phẩm
              </button>
            )}
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      <Modal
        opened={showRemoveModal}
        onClose={cancelRemove}
        title="Xác nhận xóa sản phẩm"
        size="sm"
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <IconAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Xóa sản phẩm khỏi giỏ hàng?</h3>
          <p className="mb-6 text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa{' '}
            <span className="font-bold text-gray-800">{itemToRemove?.name}</span> khỏi giỏ hàng
            không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={cancelRemove}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmRemove}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Xóa sản phẩm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
