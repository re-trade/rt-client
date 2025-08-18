'use client';

import CartEmpty from '@/components/cart/CartEmpty';
import CartShopSection from '@/components/cart/CartShopSection';
import CartSkeleton from '@/components/cart/CartSkeleton';
import CartSummaryBar from '@/components/cart/CartSummaryBar';
import Modal from '@/components/reusable/modal';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';

export default function CartSection({
  cartGroups,
  loading,
  error,
  toggleShopSection,
  selectedItems,
  toggleItemSelection,
  updateCartItemQuantity,
  removeFromCart,
  refresh,
}: ReturnType<typeof useCart>) {
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [quantityUpdates, setQuantityUpdates] = useState<Record<string, number>>({});
  const toast = useToast();
  const handleProductSelect = (itemId: string, quantity: number, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('label') ||
      target.closest('input')
    ) {
      return;
    }
    toggleItemSelection(itemId, quantity);
  };

  const handleCheckboxClick = (itemId: string, quantity: number, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleItemSelection(itemId, quantity);
  };

  const handleRemoveClick = (itemId: string, itemName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setItemToRemove({ id: itemId, name: itemName });
    setShowRemoveModal(true);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number, maxQuantity?: number) => {
    if (newQuantity < 1) return;

    // Check if new quantity exceeds available stock
    if (maxQuantity && newQuantity > maxQuantity) {
      toast.showToast(`Số lượng không thể vượt quá ${maxQuantity} sản phẩm có sẵn`, 'warning');
      return;
    }

    updateCartItemQuantity(itemId, newQuantity).then((result) => {
      if (result.success) {
        setQuantityUpdates((prev) => ({ ...prev, [itemId]: newQuantity }));
        toast.showToast('Cập nhật số lượng thành công', 'success');
      } else {
        result.message.forEach((message) => toast.showToast(message, 'warning'));
      }
    });
  };

  const handleAdjustToMaxQuantity = (itemId: string, maxQuantity: number) => {
    handleQuantityChange(itemId, maxQuantity, maxQuantity);
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
          onClick={() => refresh(false)}
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
      {Object.entries(cartGroups).map(([sellerId, shopSection]) => (
        <CartShopSection
          key={sellerId}
          sellerId={sellerId}
          shopSection={shopSection}
          selectedItems={selectedItems}
          removingItems={removingItems}
          quantityUpdates={quantityUpdates}
          onToggleShopSection={toggleShopSection}
          onProductSelect={handleProductSelect}
          onCheckboxClick={handleCheckboxClick}
          onQuantityChange={handleQuantityChange}
          onRemoveClick={handleRemoveClick}
          onAdjustToMaxQuantity={handleAdjustToMaxQuantity}
          onToggleItemSelection={toggleItemSelection}
        />
      ))}

      {Object.keys(cartGroups).length > 0 && <CartSummaryBar selectedItems={selectedItems} />}

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
