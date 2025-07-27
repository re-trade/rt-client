import { OrderCombo } from '@services/order.api';
import { Eye, Heart, MessageCircle, Package, Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  order: OrderCombo;
  statusDisplay: { label: string; color: string; icon: React.ElementType };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${timePart} ${datePart}`;
};

const PurchaseOrderItem = ({ order, statusDisplay }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-orange-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="p-6 border-b border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800">#{order.comboId.slice(0, 8)}...</h3>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color} self-start`}
            >
              {statusDisplay.icon && <statusDisplay.icon className="w-4 h-4" />}
              <span>{statusDisplay.label}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-gray-800">{formatPrice(order.grandPrice)}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>Bán bởi: {order.sellerName}</span>
          </div>
        </div>

        {order.createDate && (
          <div className="text-sm text-gray-600">
            <span>Mua lúc: {formatDate(order.createDate)}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {order.items.map((item) => (
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
                <p className="text-sm text-gray-600">
                  Mã sản phẩm: {item.productId.slice(0, 8)}...
                </p>
                {item.quantity > 0 && (
                  <p className="text-sm text-orange-600">Số lượng: {item.quantity}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <h5 className="font-bold text-gray-800 text-lg mb-3">Địa chỉ giao hàng</h5>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">{order.destination.customerName}</p>
            <p>{order.destination.phone}</p>
            <p className="leading-relaxed">
              {order.destination.addressLine}, {order.destination.ward},{' '}
              {order.destination.district}, {order.destination.state}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/user/purchase/${order.comboId}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Eye className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>
          </Link>

          {order.orderStatus === 'Delivered' && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                <Star className="w-4 h-4" />
                <span>Đánh giá</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                <Heart className="w-4 h-4" />
                <span>Mua lại</span>
              </button>
            </>
          )}

          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
            <MessageCircle className="w-4 h-4" />
            <span>Liên hệ người bán</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderItem;
