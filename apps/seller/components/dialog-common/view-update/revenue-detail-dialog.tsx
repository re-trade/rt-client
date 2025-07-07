'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RevenueData {
  id: string;
  date: string;
  orderId: string;
  amount: number;
  commission: number;
  netRevenue: number;
  status: 'completed' | 'pending';
}

interface RevenueDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: RevenueData | null;
}

export function RevenueDetailDialog({ open, onOpenChange, data }: RevenueDetailDialogProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết doanh thu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="font-medium">{data.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày</p>
              <p className="font-medium">{new Date(data.date).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiền</p>
              <p className="font-medium">{data.amount.toLocaleString('vi-VN')}đ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hoa hồng (10%)</p>
              <p className="font-medium text-red-600">{data.commission.toLocaleString('vi-VN')}đ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Doanh thu thực</p>
              <p className="font-medium text-green-600">
                {data.netRevenue.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trạng thái</p>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  data.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {data.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
