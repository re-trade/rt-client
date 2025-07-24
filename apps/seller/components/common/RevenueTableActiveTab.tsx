'use client';
import { RevenueDetailDialog } from '@/components/dialog-common/view-update/revenue-detail-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { revenueApi, RevenueResponse } from '@/service/revenue.api';
import { snipppetCode } from '@/service/snippetCode';
import { CheckCircle, Clock, Eye, Filter, Package, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RevenueTableActiveTab() {
  const [revenueData, setRevenueData] = useState<RevenueResponse[]>([]);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenue = await revenueApi.getRevenueBySeller();
        setRevenueData(revenue);
        //setWithdrawHistory(withdraws);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const openDetailDialog = (revenue: RevenueResponse) => {
    setSelectedRevenue(revenue);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (createdDate: string) => {
    return new Date(createdDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredRevenue =
    filterStatus === 'all'
      ? revenueData
      : revenueData.filter((item) => item.status.code === filterStatus);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Đang xử lý</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Hiển thị {filteredRevenue.length} trên {revenueData.length} giao dịch
        </div>
      </div>

      {/* Revenue Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold">Ngày</TableHead>
              <TableHead className="font-semibold">Đơn hàng</TableHead>
              <TableHead className="font-semibold">Sản phẩm</TableHead>
              <TableHead className="font-semibold">Người mua</TableHead>
              <TableHead className="font-semibold text-right">Tổng tiền</TableHead>
              <TableHead className="font-semibold text-right">Phí(%)</TableHead>
              <TableHead className="font-semibold text-right">Tiền phí</TableHead>
              <TableHead className="font-semibold text-right">Thực nhận</TableHead>
              <TableHead className="font-semibold text-center">Trạng thái</TableHead>
              <TableHead className="font-semibold text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevenue.map((revenue) => (
              <TableRow key={revenue.orderComboId} className="hover:bg-gray-50">
                <TableCell>{formatDate(revenue.createdDate)}</TableCell>
                <TableCell className="font-medium text-blue-600">
                  {snipppetCode.cutCode(revenue.orderComboId)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{revenue.items.length} sản phẩm</span>
                    </div>
                    <div className="text-xs text-gray-500 max-w-[190px] line-clamp-2">
                      {revenue.items[0]?.itemName || 'Không có tên sản phẩm'}
                      {revenue.items.length > 1 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                          +{revenue.items.length - 1} khác
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getCustomerInitials(revenue.destination.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {revenue.destination.customerName}
                      </div>
                      <div className="text-sm text-gray-500">{revenue.destination.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {revenue.totalPrice.toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {revenue.feePercent.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right text-red-600">
                  -{revenue.feeAmount.toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  {revenue.netAmount.toLocaleString('vi-VN')}₫
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(revenue.status.code)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(revenue.status.code)}
                        <span>{revenue.status.name}</span>
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => openDetailDialog(revenue)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <RevenueDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          revenue={selectedRevenue}
        />
      </div>
    </div>
  );
}
