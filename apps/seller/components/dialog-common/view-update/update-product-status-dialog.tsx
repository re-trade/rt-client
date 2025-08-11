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
    iconClassName: 'bg-orange-600',
    textClassName: 'text-orange-700',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    bgColor: 'bg-orange-500',
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
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [buttonHoldProgress, setButtonHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

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
      if (
        selectedStatus === ProductStatusEnum.DRAFT &&
        product.status !== ProductStatusEnum.INACTIVE
      ) {
        setShowWarning(true);
        return;
      }

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

  const executeStatusUpdate = async () => {
    if (!product || !selectedStatus) return;

    try {
      setIsSubmitting(true);
      await productApi.updateProductStatus(product.id, ProductStatusEnum.DRAFT);
      toast.success('Đã chuyển sản phẩm về trạng thái Bản nháp');
      onSuccess();
      onOpenChange(false);
      setShowWarning(false);
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái sản phẩm');
      console.error('Error updating product status:', error);
    } finally {
      setIsSubmitting(false);
      setButtonHoldProgress(0);
      setIsHolding(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHolding && buttonHoldProgress < 100) {
      timer = setTimeout(() => {
        const newProgress = buttonHoldProgress + 4;
        setButtonHoldProgress(newProgress);
        if (newProgress >= 100) {
          executeStatusUpdate();
        }
      }, 40);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHolding, buttonHoldProgress]);

  const handleMouseDown = () => {
    setIsHolding(true);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setButtonHoldProgress(0);
  };

  const isFormValid = selectedStatus !== null && selectedStatus !== product?.status;

  if (!product) return null;

  const currentStatusConfig = getStatusConfig(product.status);
  const newStatusConfig = selectedStatus ? getStatusConfig(selectedStatus) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-orange-100">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full bg-orange-500')}>
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-orange-500">
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
                  <div className="text-lg font-bold text-orange-600">
                    {product.currentPrice.toLocaleString('vi-VN')}đ
                  </div>
                  <p className="text-sm text-gray-600">Số lượng: {product.quantity || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-500">Chuyển trạng thái</h3>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <span>Chọn trạng thái tiếp theo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Current Status */}
              <Card className="border-2 border-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div
                      className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-full',
                        currentStatusConfig?.bgColor || 'bg-gray-500',
                      )}
                    >
                      {currentStatusConfig?.icon || <AlertCircle className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                  <h4 className="font-medium text-orange-700 mb-1">Hiện tại</h4>
                  <Badge
                    className={cn(
                      'text-xs',
                      currentStatusConfig?.color || 'bg-gray-100 text-gray-700 border-gray-300',
                    )}
                  >
                    {currentStatusConfig?.label || 'Không xác định'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-orange-400" />
              </div>

              {selectedStatus ? (
                <Card className="border-2 border-orange-200 bg-orange-50/30">
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
                    <h4 className="font-medium text-orange-700 mb-1">Mới</h4>
                    <Badge className={cn('text-xs', newStatusConfig?.color)}>
                      {newStatusConfig?.label}
                    </Badge>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                    <h4 className="font-medium text-orange-700 mb-1">Chọn trạng thái mới</h4>
                    <Badge className="text-xs bg-orange-50 text-orange-700 border-orange-200">
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
              <Label className="text-base font-medium text-orange-700">Chọn trạng thái mới</Label>
              <p className="text-sm text-orange-500/70 mt-1">
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
                        'border hover:border-orange-300 cursor-pointer transition-all shadow-sm hover:shadow',
                        selectedStatus === status
                          ? 'border-orange-500 bg-orange-50 shadow'
                          : 'border-gray-200',
                      )}
                      onClick={() => setSelectedStatus(status)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-full', statusConfig?.bgColor)}>
                            {statusConfig?.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-700">{statusConfig?.label}</h4>
                            <p className="text-sm text-gray-500">{statusConfig?.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-2 p-4 text-center border rounded-md border-orange-200 bg-orange-50/30">
                  <p className="text-orange-600">
                    Không có trạng thái nào được phép chuyển đổi từ{' '}
                    <span className="font-semibold">
                      {currentStatusConfig?.label || 'Không xác định'}
                    </span>
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
              className="border-orange-200 hover:bg-orange-50 flex-1 h-11 text-orange-600"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!isFormValid || isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1 h-11 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
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

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-md border-orange-100">
          <DialogHeader>
            <DialogTitle className="text-orange-600">Cảnh báo xác thực</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Chuyển sang trạng thái <strong>Bản nháp</strong> sẽ làm mất xác thực sản phẩm.
                  </p>
                  <p className="text-gray-700">Bạn sẽ cần gửi lại để xác thực sau khi chỉnh sửa.</p>
                </div>
              </div>
            </div>

            <div className="relative mt-4">
              <Button
                className="w-full h-12 bg-orange-500 hover:bg-orange-500 text-white relative overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                disabled={isSubmitting}
              >
                <span className="z-10 relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Giữ để xác nhận
                    </>
                  )}
                </span>
                <span
                  className="absolute left-0 top-0 h-full bg-orange-600 transition-all"
                  style={{ width: `${buttonHoldProgress}%` }}
                />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="w-full border-orange-200 hover:bg-orange-50 text-orange-600 h-11"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
