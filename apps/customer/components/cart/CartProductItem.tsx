'use client';

import Checkbox from '@/components/reusable/checkbox';
import { useToast } from '@/context/ToastContext';
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconMinus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';

interface CartItem {
  productId: string;
  productName: string;
  productBrand: string;
  productThumbnail: string;
  description: string;
  totalPrice: number;
  quantity: number;
  productQuantity: number;
  productAvailable: boolean;
}

interface SelectedItem {
  productId: string;
  quantity: number;
}

interface CartProductItemProps {
  item: CartItem;
  isSelected: boolean;
  isRemoving: boolean;
  currentQuantity: number;
  onProductSelect: (itemId: string, quantity: number, event: React.MouseEvent) => void;
  onCheckboxClick: (itemId: string, quantity: number, event: React.MouseEvent) => void;
  onQuantityChange: (itemId: string, newQuantity: number, maxQuantity?: number) => void;
  onRemoveClick: (itemId: string, itemName: string, event: React.MouseEvent) => void;
  onAdjustToMaxQuantity: (itemId: string, maxQuantity: number) => void;
}

function ProductDescription({
  description,
  className = '',
  maxLength = 100,
}: {
  description: string;
  className?: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  const shouldTruncate = description.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded ? description.slice(0, maxLength) + '...' : description;

  return (
    <div className={className}>
      <p className="text-gray-600 leading-tight">
        {displayText}
        {shouldTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="ml-1 text-orange-600 hover:text-orange-700 font-medium inline-flex items-center transition-colors"
            style={{ fontSize: '0.7rem' }}
          >
            {isExpanded ? (
              <>
                <span>Thu gọn</span>
                <IconChevronUp size={10} className="ml-0.5" />
              </>
            ) : (
              <>
                <span>Xem thêm</span>
                <IconChevronDown size={10} className="ml-0.5" />
              </>
            )}
          </button>
        )}
      </p>
    </div>
  );
}

export default function CartProductItem({
  item,
  isSelected,
  isRemoving,
  currentQuantity,
  onProductSelect,
  onCheckboxClick,
  onQuantityChange,
  onRemoveClick,
  onAdjustToMaxQuantity,
}: CartProductItemProps) {
  const toast = useToast();
  const isSoldOut = !item.productAvailable;
  const availableQuantity = item.productQuantity || 0;
  const isQuantityExceeded = currentQuantity > availableQuantity;
  const canIncrement = currentQuantity < availableQuantity;

  const handleIncrement = () => {
    if (currentQuantity >= availableQuantity) {
      toast.showToast(
        `Số lượng không thể vượt quá ${availableQuantity} sản phẩm có sẵn`,
        'warning',
      );
      return;
    }
    onQuantityChange(item.productId, currentQuantity + 1, availableQuantity);
  };

  const handleDecrement = () => {
    if (currentQuantity <= 1) return;
    onQuantityChange(item.productId, currentQuantity - 1, availableQuantity);
  };

  return (
    <div
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
        !isSoldOut && !isRemoving && onProductSelect(item.productId, currentQuantity, e)
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

      {/* Selection Indicator */}
      <div className="absolute top-3 right-3 z-10">
        {isSelected && !isSoldOut && !isRemoving ? (
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
            <IconCheck size={16} className="text-white drop-shadow-sm" stroke={3} />
          </div>
        ) : !isSoldOut && !isRemoving ? (
          <div onClick={(e) => onCheckboxClick(item.productId, currentQuantity, e)}>
            <Checkbox
              checked={false}
              onChange={() => {}}
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
        <div className="flex-1 min-w-0 space-y-2">
          <h4
            className={`text-sm font-semibold transition-colors ${
              isSoldOut || isRemoving ? 'text-gray-500' : 'text-gray-800'
            }`}
          >
            {item.productName}
          </h4>
          <p className="text-xs text-gray-800 border border-orange-200 bg-orange-100 inline-block px-2 py-1 rounded-lg">
            {item.productBrand}
          </p>
          <ProductDescription description={item.description} className="text-xs" maxLength={50} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={isRemoving || isSoldOut || currentQuantity <= 1}
                className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 disabled:opacity-50"
              >
                <IconMinus size={14} />
              </button>
              <span className="text-sm font-medium text-gray-800">{currentQuantity}</span>
              <button
                onClick={handleIncrement}
                disabled={isRemoving || isSoldOut || !canIncrement}
                className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 disabled:opacity-50"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="text-xs text-gray-500">Còn lại: {availableQuantity}</div>
            {isQuantityExceeded && (
              <button
                onClick={() => onAdjustToMaxQuantity(item.productId, availableQuantity)}
                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
              >
                Điều chỉnh về {availableQuantity}
              </button>
            )}
          </div>
          <p className="text-base font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded inline-block">
            {item.totalPrice * currentQuantity}₫
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={(e) => onRemoveClick(item.productId, item.productName, e)}
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
            <p className="text-sm text-gray-800 border border-orange-200 bg-orange-100 inline-block px-2 py-1 rounded-lg">
              {item.productBrand}
            </p>
            <ProductDescription description={item.description} className="text-sm" maxLength={80} />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  disabled={isRemoving || isSoldOut || currentQuantity <= 1}
                  className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 disabled:opacity-50"
                >
                  <IconMinus size={16} />
                </button>
                <span className="text-base font-medium text-gray-800">{currentQuantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={isRemoving || isSoldOut || !canIncrement}
                  className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 disabled:opacity-50"
                >
                  <IconPlus size={16} />
                </button>
              </div>
              <div className="text-sm text-gray-500">Còn lại: {availableQuantity}</div>
              {isQuantityExceeded && (
                <button
                  onClick={() => onAdjustToMaxQuantity(item.productId, availableQuantity)}
                  className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  Điều chỉnh về {availableQuantity}
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => onRemoveClick(item.productId, item.productName, e)}
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
            {item.totalPrice * currentQuantity}₫
          </p>
        </div>
      </div>

      {/* Selection Border */}
      {isSelected && !isSoldOut && !isRemoving && (
        <div className="absolute inset-0 border-2 border-orange-400 rounded-lg pointer-events-none opacity-60"></div>
      )}
    </div>
  );
}
