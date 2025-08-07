'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMyOrderDetail } from '@/hooks/use-my-order-detail';
import { retradeApi } from '@/service/retrade.api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { currentOrder, isLoading, error, getStatusDisplay, formatPrice, formatDate } =
    useMyOrderDetail(orderId);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const [isRetradeModalOpen, setIsRetradeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [retradeQuantity, setRetradeQuantity] = useState(1);
  const [isRetrading, setIsRetrading] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleRetradeClick = (item: any) => {
    setSelectedItem(item);
    setRetradeQuantity(1);
    setIsRetradeModalOpen(true);
  };

  const handleRetradeSubmit = async () => {
    if (!selectedItem) return;

    try {
      setIsRetrading(true);
      await retradeApi.createRetrade({
        orderId: orderId,
        itemId: selectedItem.itemId,
        quantity: retradeQuantity,
      });
      toast.success('Yêu cầu retrade đã được gửi thành công!');
      setIsRetradeModalOpen(false);
    } catch (error) {
      console.error('Failed to retrade item:', error);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu retrade.');
    } finally {
      setIsRetrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="animate-pulse p-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
          <Link href="/dashboard/my-order">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium">
              Quay lại danh sách đơn hàng
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(currentOrder.orderStatusId);
  const totalItems = currentOrder.items.length;
  const totalValue = currentOrder.grandPrice;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/my-order">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-100 text-sm">Mã đơn hàng:</span>
                    <span className="font-medium">#{orderId.slice(0, 8)}...</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Sao chép mã đơn hàng"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedOrderId && (
                      <span className="text-xs text-green-200 font-medium">Đã sao chép!</span>
                    )}
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30`}
                  >
                    <statusDisplay.icon className="w-4 h-4" />
                    <span>{statusDisplay.description}</span>
                  </div>
                </div>
                {currentOrder.createDate && (
                  <div className="text-sm text-orange-100 mt-1">
                    <span>Mua lúc: {formatDate(currentOrder.createDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          Trạng thái đơn hàng
        </h2>
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div
            className={`p-3 rounded-full ${statusDisplay.color.replace('border-', 'bg-').replace('text-', 'text-white ').split(' ')[0]} text-white`}
          >
            <statusDisplay.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{statusDisplay.label}</h3>
            <p className="text-sm text-gray-600">{statusDisplay.description}</p>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Receipt className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng giá trị</p>
              <p className="text-xl font-bold text-gray-800">{formatPrice(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày đặt</p>
              <p className="text-sm font-bold text-gray-800">
                {currentOrder.createDate ? formatDate(currentOrder.createDate) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          Thông tin người bán
        </h2>
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            {currentOrder.sellerAvatarUrl ? (
              <Image
                src={currentOrder.sellerAvatarUrl}
                alt={currentOrder.sellerName || 'Seller'}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {currentOrder.sellerName || 'Unknown Seller'}
            </h3>
            <p className="text-sm text-gray-600">
              ID: {currentOrder.sellerId ? currentOrder.sellerId.slice(0, 8) + '...' : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          Sản phẩm đã đặt
        </h2>
        <div className="space-y-3">
          {currentOrder.items.map((item) => (
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
                  <p className="text-sm text-orange-600">Số lượng: {item.quantity} món</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
                {currentOrder.orderStatus === 'Completed' && (
                  <button
                    onClick={() => handleRetradeClick(item)}
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
            <span className="text-2xl font-bold text-gray-800">
              {formatPrice(currentOrder.grandPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          Thông tin giao hàng
        </h2>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-3">Người nhận</h3>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium text-gray-800">{currentOrder.destination.customerName}</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>{currentOrder.destination.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-3">Địa chỉ giao hàng</h3>
              <div className="text-gray-600 space-y-1">
                <p className="leading-relaxed">{currentOrder.destination.addressLine}</p>
                <p>
                  {currentOrder.destination.ward}, {currentOrder.destination.district}
                </p>
                <p>{currentOrder.destination.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
            <MessageCircle className="w-4 h-4" />
            <span>Liên hệ người bán</span>
          </button>

          <Link href="/dashboard/my-order">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Retrade Modal */}
      <Dialog open={isRetradeModalOpen} onOpenChange={setIsRetradeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Retrade Sản phẩm</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <div className="mt-2">
                  <p className="font-medium text-gray-800">{selectedItem.itemName}</p>
                  <p className="text-sm text-gray-600">
                    Giá: {formatPrice(selectedItem.basePrice)}
                  </p>
                  <p className="text-sm text-gray-600">Số lượng đã mua: {selectedItem.quantity}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right">
                Số lượng
              </label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  type="number"
                  value={retradeQuantity}
                  onChange={(e) =>
                    setRetradeQuantity(
                      Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        selectedItem?.quantity || 1,
                      ),
                    )
                  }
                  min="1"
                  max={selectedItem?.quantity}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRetradeModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleRetradeSubmit}
              disabled={isRetrading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isRetrading ? 'Đang xử lý...' : 'Xác nhận Retrade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
