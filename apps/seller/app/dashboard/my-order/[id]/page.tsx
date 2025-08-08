'use client';

import { OrderDetailHeader } from '@/components/order-detail/OrderDetailHeader';
import { OrderItemsList } from '@/components/order-detail/OrderItemsList';
import { OrderStatsGrid } from '@/components/order-detail/OrderStatsGrid';
import { OrderStatusCard } from '@/components/order-detail/OrderStatusCard';
import { RetradeModal } from '@/components/order-detail/RetradeModal';
import { SellerInfoCard } from '@/components/order-detail/SellerInfoCard';
import { ShippingInfoCard } from '@/components/order-detail/ShippingInfoCard';
import { useMyOrderDetail } from '@/hooks/use-my-order-detail';
import { retradeApi } from '@/service/retrade.api';
import { ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderItem {
  itemId: string;
  itemName: string;
  itemThumbnail?: string;
  productId: string;
  quantity: number;
  basePrice: number;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { currentOrder, isLoading, error, getStatusDisplay, formatPrice, formatDate } =
    useMyOrderDetail(orderId);

  const [isRetradeModalOpen, setIsRetradeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem>();
  const [retradeQuantity, setRetradeQuantity] = useState(1);
  const [isRetrading, setIsRetrading] = useState(false);

  const handleRetradeClick = (item: OrderItem) => {
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
      <OrderDetailHeader
        orderId={orderId}
        status={statusDisplay}
        createDate={currentOrder.createDate}
        formatDate={formatDate}
      />

      <OrderStatusCard statusDisplay={statusDisplay} />

      <OrderStatsGrid
        createDate={currentOrder.createDate}
        formatDate={formatDate}
        formatPrice={formatPrice}
        totalItems={totalItems}
        totalValue={totalValue}
      />

      <SellerInfoCard
        sellerId={currentOrder.sellerId}
        sellerName={currentOrder.sellerName}
        sellerAvatarUrl={currentOrder.sellerAvatarUrl}
      />

      <OrderItemsList
        formatPrice={formatPrice}
        grandPrice={currentOrder.grandPrice}
        items={currentOrder.items}
        onRetradeClick={handleRetradeClick}
        orderStatus={currentOrder.orderStatus}
      />

      <ShippingInfoCard destination={currentOrder.destination} />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/my-order">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
          </Link>
        </div>
      </div>

      <RetradeModal
        formatPrice={formatPrice}
        isOpen={isRetradeModalOpen}
        isSubmitting={isRetrading}
        onOpenChange={setIsRetradeModalOpen}
        onSubmit={handleRetradeSubmit}
        retradeQuantity={selectedItem?.quantity || 0}
        selectedItem={selectedItem}
        setRetradeQuantity={setRetradeQuantity}
      />
    </div>
  );
}
