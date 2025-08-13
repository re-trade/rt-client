import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { type OrderResponse } from '@/service/orders.api';

interface OrderDetailsProps {
  orderDetails: OrderResponse | null;
  orderLoading: boolean;
}

export function OrderDetails({ orderDetails, orderLoading }: OrderDetailsProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-2">Chi tiết đơn hàng:</h3>
      {orderLoading ? (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
          <span className="ml-2 text-sm text-gray-500">Đang tải thông tin đơn hàng...</span>
        </div>
      ) : !orderDetails ? (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
          Không tìm thấy thông tin đơn hàng
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3">
            <div>
              <p className="font-medium">Mã đơn: #{orderDetails.comboId}</p>
              <p className="text-sm text-gray-600 mt-1">
                Ngày tạo: {formatDateTime(orderDetails.createDate)}
              </p>
            </div>
            <div className="text-right">
              <Badge
                className={`${
                  orderDetails.orderStatus.code === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : orderDetails.orderStatus.code === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                {orderDetails.orderStatus.name}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">
                Thanh toán:{' '}
                {orderDetails.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </p>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Sản phẩm trong đơn:</h4>
            <div className="space-y-2">
              {orderDetails.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100"
                >
                  <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={item.itemThumbnail || '/placeholder-product.png'}
                      alt={item.itemName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{item.itemName}</p>
                    <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format((item.basePrice - item.discount) * item.quantity)}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-xs text-gray-500 line-through">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.basePrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-3">
            <div>
              <h4 className="text-sm font-medium">Thông tin giao hàng:</h4>
              <p className="text-sm mt-1">
                {orderDetails.destination.addressLine}, {orderDetails.destination.ward},{' '}
                {orderDetails.destination.district}, {orderDetails.destination.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tổng giá trị:</p>
              <p className="text-lg font-bold text-orange-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(orderDetails.grandPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
