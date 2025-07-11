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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSellerManager } from '@/hooks/use-seller-manager';
import { TSellerProfile } from '@/services/seller.api';
import { AlertTriangle, Search, Store, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  true: 'Đang hoạt động',
  false: 'Chờ duyệt',
};

const statusColors: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-yellow-100 text-yellow-800',
};

export default function ShopManagementPage() {
  const [selectedSeller, setSelectedSeller] = useState<TSellerProfile | null>(null);
  const {
    sellers,
    loading,
    error,
    page: currentPage,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize: itemsPerPage,
    stats,
  } = useSellerManager();

  if (loading) return <div>Loading sellers...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleViewDetails = (seller: TSellerProfile) => {
    setSelectedSeller(seller);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý cửa hàng</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số cửa hàng</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cửa hàng đã xác thực</p>
              <h2 className="text-2xl font-bold">{stats.verified}</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cửa hàng chờ duyệt</p>
              <h2 className="text-2xl font-bold">{stats.pending}</h2>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Sellers Table */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm cửa hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên cửa hàng</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers?.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell className="font-medium">{seller.shopName}</TableCell>
                  <TableCell>{seller.description}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{seller.addressLine}</div>
                      <div className="text-sm text-muted-foreground">
                        {seller.ward}, {seller.district}, {seller.state}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{seller.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">{seller.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[String(seller.verified)]}`}
                    >
                      {statusLabels[String(seller.verified)]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(seller)}>
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
            {Math.min((currentPage + 1) * itemsPerPage, sellers.length)} trong tổng số{' '}
            {sellers.length} cửa hàng
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

      {/* Seller Details Dialog */}
      {selectedSeller && (
        <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết cửa hàng</DialogTitle>
              <DialogDescription>Thông tin chi tiết của cửa hàng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              {/* Seller Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên cửa hàng</p>
                    <p>{selectedSeller.shopName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                    <p>{selectedSeller.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                    <p>{selectedSeller.addressLine}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSeller.ward}, {selectedSeller.district}, {selectedSeller.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Liên hệ</p>
                    <p>{selectedSeller.phoneNumber}</p>
                    <p className="text-sm text-muted-foreground">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                    <p>{new Date(selectedSeller.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p>{new Date(selectedSeller.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedSeller(null)}>
                  Đóng
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    console.log('Toggle status for seller:', selectedSeller.id);
                  }}
                >
                  {selectedSeller.verified ? 'Khóa cửa hàng' : 'Xác thực cửa hàng'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
