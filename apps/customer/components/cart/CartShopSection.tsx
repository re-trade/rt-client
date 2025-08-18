'use client';

import Checkbox from '@/components/reusable/checkbox';
import CartProductItem from './CartProductItem';

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

interface ShopSection {
  sellerName: string;
  items: CartItem[];
  isOpen: boolean;
}

interface CartShopSectionProps {
  sellerId: string;
  shopSection: ShopSection;
  selectedItems: SelectedItem[];
  removingItems: Set<string>;
  quantityUpdates: Record<string, number>;
  onToggleShopSection: (sellerId: string) => void;
  onProductSelect: (itemId: string, quantity: number, event: React.MouseEvent) => void;
  onCheckboxClick: (itemId: string, quantity: number, event: React.MouseEvent) => void;
  onQuantityChange: (itemId: string, newQuantity: number, maxQuantity?: number) => void;
  onRemoveClick: (itemId: string, itemName: string, event: React.MouseEvent) => void;
  onAdjustToMaxQuantity: (itemId: string, maxQuantity: number) => void;
  onToggleItemSelection: (itemId: string, quantity: number) => void;
}

export default function CartShopSection({
  sellerId,
  shopSection,
  selectedItems,
  removingItems,
  quantityUpdates,
  onToggleShopSection,
  onProductSelect,
  onCheckboxClick,
  onQuantityChange,
  onRemoveClick,
  onAdjustToMaxQuantity,
  onToggleItemSelection,
}: CartShopSectionProps) {
  const shopSelectedCount = shopSection.items.filter((item) =>
    selectedItems.find((selected) => selected.productId === item.productId),
  ).length;
  const shopAvailableCount = shopSection.items.filter((item) => item.productAvailable).length;
  const allShopItemsSelected = shopSelectedCount === shopAvailableCount && shopAvailableCount > 0;
  const someShopItemsSelected = shopSelectedCount > 0 && shopSelectedCount < shopAvailableCount;

  const handleShopSelectAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (allShopItemsSelected) {
      shopSection.items.forEach((item) => {
        if (selectedItems.find((selected) => selected.productId === item.productId)) {
          const currentQuantity = quantityUpdates[item.productId] || item.quantity;
          onToggleItemSelection(item.productId, currentQuantity);
        }
      });
    } else {
      shopSection.items.forEach((item) => {
        if (
          item.productAvailable &&
          !selectedItems.find((selected) => selected.productId === item.productId)
        ) {
          const currentQuantity = quantityUpdates[item.productId] || item.quantity;
          onToggleItemSelection(item.productId, currentQuantity);
        }
      });
    }
  };

  const handleAccordionToggle = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.seller-checkbox')) {
      return;
    }
    onToggleShopSection(sellerId);
  };

  return (
    <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-100">
        {/* Shop Header with separated click areas */}
        <div className="p-4 md:p-6">
          <div
            className="flex items-center justify-between w-full cursor-pointer group"
            onClick={handleAccordionToggle}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="seller-checkbox flex-shrink-0" onClick={handleShopSelectAll}>
                <Checkbox
                  checked={allShopItemsSelected}
                  indeterminate={someShopItemsSelected}
                  onChange={() => {}}
                  variant="primary"
                  size="md"
                  round={true}
                  className="hover:scale-110 transition-transform"
                  disabled={shopAvailableCount === 0}
                />
              </div>

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

        {/* Collapsible Content */}
        <div
          className={`grid text-sm overflow-hidden transition-all duration-300 ease-in-out ${
            shopSection.isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
              {shopSection.items.map((item) => {
                const isSelected = selectedItems.find(
                  (selected) => selected.productId === item.productId,
                );
                const isRemoving = removingItems.has(item.productId);
                const currentQuantity = quantityUpdates[item.productId] || item.quantity;

                return (
                  <CartProductItem
                    key={item.productId}
                    item={item}
                    isSelected={!!isSelected}
                    isRemoving={isRemoving}
                    currentQuantity={currentQuantity}
                    onProductSelect={onProductSelect}
                    onCheckboxClick={onCheckboxClick}
                    onQuantityChange={onQuantityChange}
                    onRemoveClick={onRemoveClick}
                    onAdjustToMaxQuantity={onAdjustToMaxQuantity}
                  />
                );
              })}

              {/* Shop Summary */}
              {shopSection.items.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 14a2 2 0 002 2h8a2 2 0 002-2v-2H4v2z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-800">
                        Tổng cộng ({shopSelectedCount} sản phẩm)
                      </span>
                    </div>
                    <span className="text-xl font-bold text-orange-600">
                      {shopSection.items
                        .filter((item) =>
                          selectedItems.find((selected) => selected.productId === item.productId),
                        )
                        .reduce(
                          (total, item) =>
                            total +
                            item.totalPrice * (quantityUpdates[item.productId] || item.quantity),
                          0,
                        )
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
}
