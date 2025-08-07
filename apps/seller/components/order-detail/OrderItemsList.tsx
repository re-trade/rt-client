import { Package, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  itemId: string;
  itemName: string;
  itemThumbnail?: string;
  productId: string;
  quantity: number;
  basePrice: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  orderStatus: string;
  grandPrice: number;
  formatPrice: (price: number) => string;
  onRetradeClick: (item: OrderItem) => void;
}

export function OrderItemsList({
  items,
  orderStatus,
  grandPrice,
  formatPrice,
  onRetradeClick,
}: OrderItemsListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Package className="w-5 h-5 text-orange-600" />
        </div>
        Sản phẩm đã đặt
      </h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.itemId}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {item.itemThumbnail ? (
                <Image
                  src={item.itemThumbnail}
                  alt={item.itemName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center ${item.itemThumbnail ? 'hidden' : ''}`}
              >
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 leading-relaxed">{item.itemName}</h4>
              <p className="text-sm text-gray-600">Mã sản phẩm: {item.productId.slice(0, 8)}...</p>
              {item.quantity > 0 && (
                <p className="text-sm text-orange-600">Số lượng: {item.quantity} món</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
              {orderStatus === 'Completed' && (
                <button
                  onClick={() => onRetradeClick(item)}
                  className="mt-2 flex items-center space-x-2 px-3 py-1 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="text-xs">Retrade</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-orange-200">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
          <span className="text-2xl font-bold text-gray-800">{formatPrice(grandPrice)}</span>
        </div>
      </div>
    </div>
  );
}
