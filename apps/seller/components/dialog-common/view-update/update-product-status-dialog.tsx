'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { productApi, ProductStatusEnum, TProduct, TProductStatus } from '@/service/product.api';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Package,
  RefreshCw,
  Save,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SELLER_ALLOWED_TRANSITIONS = new Map([
  [ProductStatusEnum.DRAFT, [ProductStatusEnum.INACTIVE, ProductStatusEnum.INIT]],
  [ProductStatusEnum.INACTIVE, [ProductStatusEnum.DRAFT, ProductStatusEnum.INIT]],
  [ProductStatusEnum.ACTIVE, [ProductStatusEnum.INACTIVE, ProductStatusEnum.DRAFT]],
  [ProductStatusEnum.INIT, [ProductStatusEnum.DRAFT, ProductStatusEnum.INACTIVE]],
]);

const ProductStatusOptions = [
  {
    value: ProductStatusEnum.DRAFT,
    label: 'Bản nháp',
    description: 'Sản phẩm đang trong quá trình chỉnh sửa và chưa sẵn sàng',
    icon: <FileText className="h-4 w-4 text-white" />,
    iconClassName: 'bg-blue-600',
    textClassName: 'text-blue-700',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    bgColor: 'bg-blue-500',
  },
  {
    value: ProductStatusEnum.INIT,
    label: 'Khởi tạo',
    description: 'Sản phẩm đã được khởi tạo và đang chờ xét duyệt',
    icon: <Clock className="h-4 w-4 text-white" />,
    iconClassName: 'bg-yellow-600',
    textClassName: 'text-yellow-700',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    bgColor: 'bg-yellow-500',
  },
  {
    value: ProductStatusEnum.ACTIVE,
    label: 'Hoạt động',
    description: 'Sản phẩm đang được hiển thị và có thể mua',
    icon: <CheckCircle className="h-4 w-4 text-white" />,
    iconClassName: 'bg-emerald-600',
    textClassName: 'text-emerald-700',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgColor: 'bg-emerald-500',
  },
  {
    value: ProductStatusEnum.INACTIVE,
    label: 'Ngưng hoạt động',
    description: 'Sản phẩm đã bị tạm ngưng và không thể mua',
    icon: <XCircle className="h-4 w-4 text-white" />,
    iconClassName: 'bg-red-600',
    textClassName: 'text-red-700',
    color: 'bg-red-50 text-red-700 border-red-200',
    bgColor: 'bg-red-500',
  },
  {
    value: ProductStatusEnum.DELETED,
    label: 'Đã xóa',
    description: 'Sản phẩm đã bị xóa khỏi hệ thống',
    icon: <AlertCircle className="h-4 w-4 text-white" />,
    iconClassName: 'bg-gray-600',
    textClassName: 'text-gray-700',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    bgColor: 'bg-gray-500',
  },
];

interface UpdateProductStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProduct | null;
  onSuccess: () => void;
}

export function UpdateProductStatusDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: UpdateProductStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<TProductStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<TProductStatus[]>([]);

  useEffect(() => {
    if (product) {
      setSelectedStatus(null);

      if (SELLER_ALLOWED_TRANSITIONS.has(product.status as ProductStatusEnum)) {
        setAvailableStatuses(
          SELLER_ALLOWED_TRANSITIONS.get(product.status as ProductStatusEnum) || [],
        );
      } else {
        setAvailableStatuses([]);
      }
    }
  }, [product]);

  const getStatusConfig = (status: TProductStatus) => {
    return (
      ProductStatusOptions.find((option) => option.value === status) || ProductStatusOptions[0]
    );
  };

  const handleUpdateStatus = async () => {
    if (!product || !selectedStatus) return;

    try {
      setIsSubmitting(true);
      if (selectedStatus !== product.status) {
        await productApi.updateProductStatus(product.id, selectedStatus);
        toast.success('Đã cập nhật trạng thái sản phẩm thành công');
        onSuccess();
      }

      onOpenChange(false);
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái sản phẩm');
      console.error('Error updating product status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedStatus !== null && selectedStatus !== product?.status;

  if (!product) return null;

  const currentStatusConfig = getStatusConfig(product.status);
  const newStatusConfig = selectedStatus ? getStatusConfig(selectedStatus) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full', currentStatusConfig.bgColor)}>
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Cập nhật trạng thái sản phẩm
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Thay đổi trạng thái và theo dõi tiến trình sản phẩm
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-0 bg-gray-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Mã sản phẩm:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono">
                      {product.id.substring(0, 8)}
                    </code>
                  </div>
                  <div className="font-semibold text-slate-900">{product.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <span>Thương hiệu: {product.brand}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {product.currentPrice.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="text-sm text-gray-600">Số lượng: {product.quantity}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Chuyển trạng thái</h3>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <span>Chọn trạng thái tiếp theo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Card className="border-2 border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div
                      className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-full',
                        currentStatusConfig.bgColor,
                      )}
                    >
                      {currentStatusConfig.icon}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Hiện tại</h4>
                  <Badge className={cn('text-xs', currentStatusConfig.color)}>
                    {currentStatusConfig.label}
                  </Badge>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
              </div>

              {selectedStatus ? (
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div
                        className={cn(
                          'inline-flex h-12 w-12 items-center justify-center rounded-full',
                          newStatusConfig?.bgColor,
                        )}
                      >
                        {newStatusConfig?.icon}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Mới</h4>
                    <Badge className={cn('text-xs', newStatusConfig?.color)}>
                      {newStatusConfig?.label}
                    </Badge>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                        <AlertCircle className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Chọn trạng thái mới</h4>
                    <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                      Chưa chọn
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Chọn trạng thái mới</Label>
              <p className="text-sm text-gray-500 mt-1">
                Chỉ hiển thị các trạng thái được phép chuyển đổi từ trạng thái hiện tại
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableStatuses.length > 0 ? (
                availableStatuses.map((status) => {
                  const statusConfig = getStatusConfig(status);
                  return (
                    <Card
                      key={status}
                      className={cn(
                        'border hover:border-blue-300 cursor-pointer transition-all',
                        selectedStatus === status
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200',
                      )}
                      onClick={() => setSelectedStatus(status)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-full', statusConfig.bgColor)}>
                            {statusConfig.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{statusConfig.label}</h4>
                            <p className="text-sm text-gray-500">{statusConfig.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-2 p-4 text-center border rounded-md border-gray-200 bg-gray-50">
                  <p className="text-gray-500">
                    Không có trạng thái nào được phép chuyển đổi từ {currentStatusConfig.label}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-200 hover:bg-slate-50 flex-1 h-11"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!isFormValid || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-11"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
