'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueDetailDialog } from '@/components/ui/dialog/view-update/revenue-detail-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, Eye, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface RevenueData {
  id: string;
  date: string;
  orderId: string;
  amount: number;
  commission: number;
  netRevenue: number;
  status: 'completed' | 'pending';
}

const mockRevenueData: RevenueData[] = [
  {
    id: '1',
    date: '2024-01-15',
    orderId: 'ORD001',
    amount: 299000,
    commission: 29900,
    netRevenue: 269100,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-01-14',
    orderId: 'ORD002',
    amount: 599000,
    commission: 59900,
    netRevenue: 539100,
    status: 'completed',
  },
];

export default function RevenueManagement() {
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.netRevenue, 0);
  const totalOrders = mockRevenueData.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const openDetailDialog = (revenue: RevenueData) => {
    setSelectedRevenue(revenue);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</div>
            <p className="text-xs text-muted-foreground">+20.1% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị đơn hàng TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOrderValue.toLocaleString('vi-VN')}đ</div>
            <p className="text-xs text-muted-foreground">+5.2% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết doanh thu</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Doanh thu thực</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRevenueData.map((revenue) => (
                <TableRow key={revenue.id}>
                  <TableCell>{new Date(revenue.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="font-medium">{revenue.orderId}</TableCell>
                  <TableCell>{revenue.amount.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>{revenue.commission.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {revenue.netRevenue.toLocaleString('vi-VN')}đ
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        revenue.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {revenue.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openDetailDialog(revenue)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG TÁCH RIÊNG */}
      <RevenueDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        data={selectedRevenue}
      />
    </div>
  );
}
