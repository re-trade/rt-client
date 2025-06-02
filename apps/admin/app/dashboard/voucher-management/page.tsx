'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { VoucherDialog } from '../../components/voucher-dialog';

// Sample data - replace with actual API call
const vouchers = [
  {
    id: '1',
    code: 'SUMMER2024',
    name: 'Khuyến mãi hè 2024',
    type: 'percentage',
    value: 20,
    maxDiscount: 200000,
    minOrder: 500000,
    usage: {
      used: 150,
      total: 1000,
    },
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    conditions: {
      customerGroups: ['all'],
      productGroups: ['all'],
    },
  },
  // Add more sample data...
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  paused: 'bg-yellow-100 text-yellow-800',
} as const;

type VoucherStatus = keyof typeof statusColors;

export default function VoucherManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý voucher</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo voucher mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số voucher</p>
              <h2 className="text-2xl font-bold">{vouchers.length}</h2>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
              <h2 className="text-2xl font-bold">
                {vouchers.filter((v) => v.status === 'active').length}
              </h2>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã hết hạn</p>
              <h2 className="text-2xl font-bold">
                {vouchers.filter((v) => v.status === 'expired').length}
              </h2>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tạm dừng</p>
              <h2 className="text-2xl font-bold">
                {vouchers.filter((v) => v.status === 'paused').length}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo mã hoặc tên voucher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="expired">Hết hạn</SelectItem>
            <SelectItem value="paused">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vouchers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã voucher</TableHead>
              <TableHead>Tên chương trình</TableHead>
              <TableHead>Giá trị giảm</TableHead>
              <TableHead>Điều kiện áp dụng</TableHead>
              <TableHead>Số lượt sử dụng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian hiệu lực</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-medium">{voucher.code}</TableCell>
                <TableCell>{voucher.name}</TableCell>
                <TableCell>
                  {voucher.type === 'percentage' ? `${voucher.value}%` : `${voucher.value.toLocaleString('vi-VN')}đ`}
                  {voucher.maxDiscount && (
                    <span className="text-sm text-muted-foreground">
                      {' '}
                      (tối đa {voucher.maxDiscount.toLocaleString('vi-VN')}đ)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p>Đơn tối thiểu: {voucher.minOrder.toLocaleString('vi-VN')}đ</p>
                    <p>Nhóm khách hàng: {voucher.conditions.customerGroups.join(', ')}</p>
                    <p>Nhóm sản phẩm: {voucher.conditions.productGroups.join(', ')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {voucher.usage.used} / {voucher.usage.total}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[voucher.status as VoucherStatus]}>
                    {voucher.status === 'active' && 'Đang hoạt động'}
                    {voucher.status === 'expired' && 'Hết hạn'}
                    {voucher.status === 'paused' && 'Tạm dừng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p>Từ: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}</p>
                    <p>Đến: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Sửa
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <VoucherDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
} 