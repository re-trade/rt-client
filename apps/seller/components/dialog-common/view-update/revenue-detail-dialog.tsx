// components/dialog-common/view-update/RevenueDetailDialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RevenueData {
  id: string;
  date: string;
  orderId: string;
  productName: string;
  buyer: string;
  amount: number;
  commission: number;
  netRevenue: number;
  status: string;
  category: string;
}

interface RevenueDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revenue?: RevenueData | null;
}

export function RevenueDetailDialog({ open, onOpenChange, revenue }: RevenueDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
        </DialogHeader>
        {revenue && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium">{revenue.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ngày:</span>
                <span className="font-medium">
                  {new Date(revenue.date).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sản phẩm:</span>
                <span className="font-medium text-right flex-1 ml-2">{revenue.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Người mua:</span>
                <span className="font-medium">{revenue.buyer}</span>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng tiền:</span>
                  <span className="font-medium">{revenue.amount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phí dịch vụ (5%):</span>
                  <span className="font-medium text-red-600">
                    -{revenue.commission.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Thực nhận:</span>
                  <span className="text-green-600">
                    {revenue.netRevenue.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
