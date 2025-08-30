'use client';

import { PlatformFeeDialog } from '@/components/dialog/PlatformFeeDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlatformFeeManager } from '@/hooks/use-platform-fee-manager';
import { PlatformFee, PlatformFeeCreateUpdate } from '@/services/platform-fee.api';
import { Edit, MoreHorizontal, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function PlatformFeeSettingsPage() {
  const {
    platformFees,
    loading,
    error,
    page,
    maxPage,
    totalFees,
    refresh,
    goToPage,
    handleCreateFee,
    handleUpdateFee,
    handleDeleteFee,
  } = usePlatformFeeManager();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<PlatformFee | null>(null);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openUpdateDialog = (fee: PlatformFee) => {
    setSelectedFee(fee);
    setIsUpdateDialogOpen(true);
  };

  const openDeleteDialog = (fee: PlatformFee) => {
    setSelectedFee(fee);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data: PlatformFeeCreateUpdate) => {
    await handleCreateFee(data);
  };

  const handleUpdateSubmit = async (data: PlatformFeeCreateUpdate) => {
    if (selectedFee) {
      await handleUpdateFee(selectedFee.id, data);
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedFee) {
      await handleDeleteFee(selectedFee.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return <span className="text-2xl font-bold">∞</span>;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cấu hình phí nền tảng</h1>
          <p className="text-gray-600 mt-1">Quản lý cài đặt phí giao dịch trên nền tảng</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            onClick={refresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={openCreateDialog}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-gray-900">Bảng cấu hình phí</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Đang tải dữ liệu cấu hình phí...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : platformFees.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              Chưa có cấu hình phí nào. Vui lòng thêm mới để bắt đầu.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-3 text-left font-medium">Giá tối thiểu</th>
                    <th className="px-4 py-3 text-left font-medium">Giá tối đa</th>
                    <th className="px-4 py-3 text-left font-medium">Tỉ lệ phí</th>
                    <th className="px-4 py-3 text-left font-medium">Mô tả</th>
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {platformFees.map((fee) => (
                    <tr key={fee.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{formatCurrency(fee.minPrice)}</td>
                      <td className="px-4 py-3 align-middle">{formatCurrency(fee.maxPrice)}</td>
                      <td className="px-4 py-3">{formatPercentage(fee.feeRate)}</td>
                      <td className="px-4 py-3">{fee.description}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-orange-600 hover:bg-gray-50"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-gray-700">
                              Thao tác
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openUpdateDialog(fee)}
                              className="cursor-pointer hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(fee)}
                              className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {maxPage > 1 && (
            <div className="flex items-center justify-between mt-6 p-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Trang {page + 1} / {maxPage} ({totalFees} mục)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(0)}
                  disabled={page === 0}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Đầu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === maxPage - 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Sau
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(maxPage - 1)}
                  disabled={page === maxPage - 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cuối
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PlatformFeeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Thêm cấu hình phí mới"
      />

      <PlatformFeeDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onSubmit={handleUpdateSubmit}
        initialData={selectedFee || undefined}
        title="Cập nhật cấu hình phí"
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cấu hình phí này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSubmit}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
