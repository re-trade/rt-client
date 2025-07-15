'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomerManager } from '@/hooks/use-customer-manager';
import { TCustomerProfile } from '@/services/customer.api';
import { AlertTriangle, Search, Store, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  true: 'Đang hoạt động',
  false: 'Không hoạt động',
};

const statusColors: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-yellow-800',
};

export default function CustomerManagementPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<TCustomerProfile | null>(null);
  const {
    customers,
    loading,
    error,
    page: currentPage,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize: itemsPerPage,
    stats,
    disableCustomer,
    enableCustomer,
  } = useCustomerManager();

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleViewDetails = (customer: TCustomerProfile) => {
    setSelectedCustomer(customer);
  };

  const handleToggleStatus = async (customer: TCustomerProfile) => {
    const success = customer.enabled
      ? await disableCustomer(customer.id)
      : await enableCustomer(customer.id);
    if (success) {
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số khách hàng</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground"> Khách hàng hợp lệ</p>
              <h2 className="text-2xl font-bold">{stats.verified}</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground"> Khách hàng bị hạn chế</p>
              <h2 className="text-2xl font-bold">{stats.pending}</h2>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              {/* <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              /> */}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>

                <TableHead>Họ</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>

                  <TableCell className="font-medium">{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{customer.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[String(customer.enabled)]}`}
                    >
                      {statusLabels[String(customer.enabled)]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(customer)}>
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {currentPage * itemsPerPage + 1} đến{' '}
            {Math.min((currentPage + 1) * itemsPerPage, customers.length)} trong tổng số{' '}
            {customers.length} cửa hàng
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * itemsPerPage >= stats.total}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết cửa hàng</DialogTitle>
              <DialogDescription>Thông tin chi tiết của khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                    <p>{selectedCustomer.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên khách hàng</p>
                    <p>{selectedCustomer.firstName + ' ' + selectedCustomer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Giới tính</p>
                    <p>{selectedCustomer.gender === '0' ? 'Nam' : 'Nữ'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                    <p>{selectedCustomer.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p>{new Date(selectedCustomer.lastUpdate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  {/* <div>
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p>{new Date(selectedSeller.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div> */}
                </div>
              </div>

              <DialogFooter>
                {/* <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                  Đóng
                </Button> */}
                <Button
                  className={
                    selectedCustomer.enabled
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                  onClick={() => handleToggleStatus(selectedCustomer)}
                >
                  {selectedCustomer.enabled ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}{' '}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
