'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  PackageIcon, 
  UserIcon, 
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  HashIcon,
  TrendingUpIcon,
  MinusCircleIcon
} from 'lucide-react';
import { RevenueResponse } from '@/service/revenue.api';

interface RevenueDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revenue?: RevenueResponse | null;
}

export function RevenueDetailDialog({ open, onOpenChange, revenue }: RevenueDetailDialogProps) {
  if (!revenue) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'chờ xử lý':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'đã hủy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Chi tiết giao dịch
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Thông tin chi tiết về đơn hàng và doanh thu
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 flex-1 min-h-0">
          {/* Row 1: Order Info + Customer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Order Information Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <HashIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Thông tin đơn hàng</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Mã đơn hàng</p>
                    <p className="font-medium text-sm text-gray-900 truncate">{revenue.orderComboId}</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Thời gian</p>
                    <p className="font-medium text-sm text-gray-900">{new Date(revenue.createdDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-green-100 rounded">
                    <UserIcon className="h-3 w-3 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">Thông tin khách hàng</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Tên khách hàng</p>
                    <p className="font-medium text-sm text-gray-900 truncate">{revenue.destination.customerName}</p>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-sm text-gray-900">{revenue.destination.phone}</p>
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Địa chỉ</p>
                  <p className="font-medium text-sm text-gray-900 line-clamp-2">
                    {[
                      revenue.destination.addressLine,
                      revenue.destination.ward,
                      revenue.destination.district,
                      revenue.destination.state
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Products List */}
          <Card className="border-l-4 border-l-purple-500 flex-1 min-h-0">
            <CardContent className="p-3 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-purple-100 rounded">
                  <PackageIcon className="h-3 w-3 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">Danh sách sản phẩm</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 overflow-y-auto flex-1">
                {revenue.items.map((item, index) => (
                  <div key={item.itemId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {item.itemThumbnail && (
                      <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.itemThumbnail} 
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-gray-900 truncate">{item.itemName}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>SL: {item.quantity}</span>
                        <span>Giá: {formatCurrency(item.basePrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Row 3: Financial Summary */}
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-orange-100 rounded">
                  <CreditCardIcon className="h-3 w-3 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">Tổng quan tài chính</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUpIcon className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Tổng tiền hàng</span>
                  </div>
                  <span className="font-bold text-sm">{formatCurrency(revenue.totalPrice)}</span>
                </div>
                
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <MinusCircleIcon className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-gray-600">Phí dịch vụ ({revenue.feePercent}%)</span>
                  </div>
                  <span className="font-bold text-sm text-red-600">-{formatCurrency(revenue.feeAmount)}</span>
                </div>
                
                <div className="p-3 bg-green-100 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCardIcon className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Thực nhận</span>
                  </div>
                  <span className="font-bold text-lg text-green-700">{formatCurrency(revenue.netAmount)}</span>
                </div>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}