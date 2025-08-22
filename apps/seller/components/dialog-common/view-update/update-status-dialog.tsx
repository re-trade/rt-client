'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CreateOrderHistory, DeliveryTypeEnum, orderHistoryApi } from '@/service/orderHistory.api';
import { OrderResponse } from '@/service/orders.api';
import { orderStatusApi, OrderStatusResponse } from '@/service/orderStatus.api';
import { snipppetCode } from '@/service/snippetCode';
import { storageApi } from '@/service/storage.api';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Ban,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Package,
  PackageCheck,
  PackageX,
  RefreshCw,
  RotateCcw,
  Save,
  Truck,
  TruckIcon,
  User,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderResponse | null;
  onUpdateStatus: (orderId: string, newStatus: OrderResponse['orderStatus']) => void;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<OrderResponse['orderStatus']>(
    order?.orderStatus || { id: '', name: '', code: 'PENDING' },
  );
  const [notes, setNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryTypeEnum>(DeliveryTypeEnum.MANUAL);
  const [deliveryCode, setDeliveryCode] = useState('');
  const [deliveryEvidenceImages, setDeliveryEvidenceImages] = useState<string[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      setNotes('');
      setDeliveryType(DeliveryTypeEnum.MANUAL);
      setDeliveryCode('');
      setDeliveryEvidenceImages([]);
    }
  }, [order]);

  useEffect(() => {
    const fetchNextStatus = async () => {
      if (!order) return;
      setIsLoading(true);
      try {
        const response = await orderStatusApi.getNextStepOrderStaus(order.comboId);
        setOrderStatuses(response);
      } catch (error) {
        console.error('Failed to fetch next statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNextStatus();
  }, [order]);

  if (!order) return null;

  const getStatusConfig = (status: OrderResponse['orderStatus']) => {
    const configs: Record<
      string,
      {
        color: string;
        icon: React.ReactElement;
        text: string;
        bgColor: string;
      }
    > = {
      PENDING: {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className="h-4 w-4" />,
        text: 'Chờ xử lý',
        bgColor: 'bg-amber-500',
      },
      PREPARING: {
        color: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: <Package className="h-4 w-4" />,
        text: 'Đang chuẩn bị',
        bgColor: 'bg-violet-500',
      },
      DELIVERING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Truck className="h-4 w-4" />,
        text: 'Đang giao hàng',
        bgColor: 'bg-orange-500',
      },
      DELIVERED: {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <PackageCheck className="h-4 w-4" />,
        text: 'Đã giao hàng',
        bgColor: 'bg-emerald-500',
      },
      RETRIEVED: {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <RotateCcw className="h-4 w-4" />,
        text: 'Đã lấy hàng',
        bgColor: 'bg-blue-500',
      },
      CANCELLED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <Ban className="h-4 w-4" />,
        text: 'Huỷ đơn',
        bgColor: 'bg-red-500',
      },
      RETURNING: {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <RefreshCw className="h-4 w-4" />,
        text: 'Đang hoàn trả',
        bgColor: 'bg-orange-500',
      },
      REFUNDED: {
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <DollarSign className="h-4 w-4" />,
        text: 'Đã hoàn tiền',
        bgColor: 'bg-indigo-500',
      },
      RETURN_REJECTED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Từ chối hoàn trả',
        bgColor: 'bg-red-500',
      },
      RETURN_REQUESTED: {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <RotateCcw className="h-4 w-4" />,
        text: 'Yêu cầu hoàn trả',
        bgColor: 'bg-yellow-500',
      },
      COMPLETED: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Đã hoàn tất',
        bgColor: 'bg-green-500',
      },
      RETURNED: {
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: <PackageX className="h-4 w-4" />,
        text: 'Đã trả hàng',
        bgColor: 'bg-slate-500',
      },
      RETURN_APPROVED: {
        color: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: <CheckCheck className="h-4 w-4" />,
        text: 'Chấp nhận hoàn trả',
        bgColor: 'bg-teal-500',
      },
      PAYMENT_CONFIRMATION: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CreditCard className="h-4 w-4" />,
        text: 'Đã thanh toán',
        bgColor: 'bg-green-500',
      },
      PAYMENT_FAILED: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <AlertTriangle className="h-4 w-4" />,
        text: 'Thanh toán thất bại',
        bgColor: 'bg-red-500',
      },
      PAYMENT_CANCELLED: {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Thanh toán đã huỷ',
        bgColor: 'bg-gray-500',
      },
    };

    return (
      configs[status.code] || {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Chưa rõ',
        bgColor: 'bg-gray-500',
      }
    );
  };

  const requiresTrackingNumber = (
    status: OrderResponse['orderStatus'],
    newStatus: OrderResponse['orderStatus'],
  ) => {
    const onRightStatus =
      ['PREPARING'].includes(status.code) && ['DELIVERING'].includes(newStatus.code);
    const hasInput = deliveryType === DeliveryTypeEnum.MANUAL ? true : deliveryCode.trim() !== '';
    return onRightStatus && !hasInput;
  };

  const displayTrackingNumber = (
    status: OrderResponse['orderStatus'],
    newStatus: OrderResponse['orderStatus'],
  ) => {
    return ['PREPARING'].includes(status.code) && ['DELIVERING'].includes(newStatus.code);
  };

  const requiresDeliveryFields = (status: OrderResponse['orderStatus']) => {
    return status.code === 'DELIVERING';
  };

  const requiresDeliveryEvidence = (status: OrderResponse['orderStatus']) => {
    return status.code === 'DELIVERED';
  };

  const isDeliveryCodeRequired = () => {
    return requiresDeliveryFields(newStatus) && deliveryType !== DeliveryTypeEnum.MANUAL;
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;

    const currentImageCount = deliveryEvidenceImages.length;
    const maxImages = 3;

    if (currentImageCount >= maxImages) {
      toast.error(`Chỉ được tải lên tối đa ${maxImages} hình ảnh.`);
      return;
    }

    const remainingSlots = maxImages - currentImageCount;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(
        `Chỉ tải lên ${remainingSlots} hình ảnh đầu tiên. Tối đa ${maxImages} hình ảnh.`,
      );
    }

    setIsUploadingImages(true);
    try {
      const uploadedUrlResponse = await storageApi.fileBulkUpload(filesToUpload);
      const uploadedUrls = uploadedUrlResponse.content;
      setDeliveryEvidenceImages((prev) => [...prev, ...uploadedUrls]);
    } catch (_) {
      toast.error('Không thể tải lên hình ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSubmit = async () => {
    if (requiresTrackingNumber(order.orderStatus, newStatus)) {
      toast.error('Vui lòng nhập mã vận đơn');
      return;
    }

    if (requiresDeliveryFields(newStatus) && isDeliveryCodeRequired() && !deliveryCode.trim()) {
      toast.error('Vui lòng nhập mã vận đơn');
      return;
    }

    if (requiresDeliveryEvidence(newStatus) && deliveryEvidenceImages.length === 0) {
      toast.error('Vui lòng tải lên ít nhất một hình ảnh bằng chứng giao hàng');
      return;
    }

    setIsLoading(true);
    try {
      const updateStatus: CreateOrderHistory = {
        orderComboId: order.comboId,
        notes: notes,
        newStatusId: newStatus.id,
      };

      if (requiresDeliveryFields(newStatus)) {
        updateStatus.deliveryType = deliveryType;
        if (deliveryType !== DeliveryTypeEnum.MANUAL) {
          updateStatus.deliveryCode = deliveryCode;
        }
      }

      if (requiresDeliveryEvidence(newStatus)) {
        updateStatus.deliveryEvidenceImages = deliveryEvidenceImages;
      }

      const response = await orderHistoryApi.updateStatusOrder(updateStatus);
      if (response.success) {
        onUpdateStatus(order.comboId, newStatus);
        toast.success('Cập nhập trạng thái đơn hàng thành công');
        onOpenChange(false);
      } else {
        response.message.forEach((message) => toast.error(message));
      }
    } catch (_) {
      toast.error('Lỗi, không thể cập nhập trạng thái đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const isFormValid =
    newStatus.code !== order.orderStatus.code &&
    notes.trim() !== '' &&
    !requiresTrackingNumber(order.orderStatus, newStatus) &&
    (!requiresDeliveryEvidence(newStatus) || deliveryEvidenceImages.length > 0) &&
    !isUploadingImages;

  const currentStatusConfig = getStatusConfig(order.orderStatus);
  const newStatusConfig = getStatusConfig(newStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-orange-100">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-orange-600">
                Cập nhật trạng thái đơn hàng
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Thay đổi trạng thái và theo dõi tiến trình đơn hàng
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-0 bg-gray-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                  <AvatarFallback className="text-sm font-medium bg-orange-500 text-white">
                    {getCustomerInitials(order.destination.customerName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
                    <code className="px-2 py-1 bg-white rounded text-sm font-mono">
                      {snipppetCode.cutCode(order.comboId)}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {order.destination.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(order.createDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {order.grandPrice.toLocaleString('vi-VN')}đ
                  </div>
                  <div className="text-sm text-gray-600">{order.items.length} sản phẩm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Transition */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-orange-700">Chuyển trạng thái</h3>

              <div className="flex items-center gap-2 text-sm text-orange-600">
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
                    {currentStatusConfig.text}
                  </Badge>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-gray-400" />
              </div>

              {newStatus.code !== order.orderStatus.code && (
                <Card className="border-2 border-orange-200 bg-orange-50/30">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div
                        className={cn(
                          'inline-flex h-12 w-12 items-center justify-center rounded-full',
                          newStatusConfig.bgColor,
                        )}
                      >
                        {newStatusConfig.icon}
                      </div>
                    </div>
                    <h4 className="font-medium text-orange-700 mb-1">Mới</h4>
                    <Badge className={cn('text-xs', newStatusConfig.color)}>
                      {newStatusConfig.text}
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
            </div>

            <Select
              value={newStatus.code}
              onValueChange={(value) => {
                const selected = orderStatuses.find((s) => s.code === value);
                if (selected) {
                  setNewStatus({
                    ...selected,
                  });
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-200">
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => {
                  const config = getStatusConfig({ ...status });
                  return (
                    <SelectItem key={status.code} value={status.code}>
                      <div className="flex items-center gap-3 py-1">
                        <div className={cn('p-1.5 rounded-full', config.bgColor)}>
                          {config.icon}
                        </div>
                        <span className="font-medium">{config.text}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {displayTrackingNumber(order.orderStatus, newStatus) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2 text-orange-700">
                  <Truck className="h-4 w-4 text-orange-600" />
                  Loại vận chuyển <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={deliveryType}
                  onValueChange={(value) => {
                    setDeliveryType(value as DeliveryTypeEnum);
                    if (value === DeliveryTypeEnum.MANUAL) {
                      setDeliveryCode('');
                    }
                  }}
                >
                  <SelectTrigger className="h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-200">
                    <SelectValue placeholder="Chọn loại vận chuyển" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DeliveryTypeEnum.MANUAL}>
                      <div className="flex items-center gap-3 py-1">
                        <Package className="h-4 w-4" />
                        <span className="font-medium">Giao hàng thủ công</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={DeliveryTypeEnum.GRAB}>
                      <div className="flex items-center gap-3 py-1">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Grab</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={DeliveryTypeEnum.GIAO_HANG_TIET_KIEM}>
                      <div className="flex items-center gap-3 py-1">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Giao hàng tiết kiệm</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={DeliveryTypeEnum.VIETTEL_POST}>
                      <div className="flex items-center gap-3 py-1">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Viettel Post</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deliveryType !== DeliveryTypeEnum.MANUAL && (
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2 text-orange-700">
                    <TruckIcon className="h-4 w-4 text-orange-600" />
                    Mã vận đơn <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={deliveryCode}
                    onChange={(e) => setDeliveryCode(e.target.value)}
                    placeholder="Nhập mã vận đơn"
                    className="h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  />
                  <p className="text-sm text-gray-600">Mã vận đơn từ đơn vị vận chuyển</p>
                </div>
              )}
            </div>
          )}

          {requiresDeliveryEvidence(newStatus) && (
            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center gap-2 text-orange-700">
                <PackageCheck className="h-4 w-4 text-orange-600" />
                Hình ảnh bằng chứng giao hàng <span className="text-red-500">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  deliveryEvidenceImages.length >= 3
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-orange-300'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                  id="evidence-upload"
                  disabled={isUploadingImages || deliveryEvidenceImages.length >= 3}
                />
                <label
                  htmlFor="evidence-upload"
                  className={`cursor-pointer ${
                    isUploadingImages || deliveryEvidenceImages.length >= 3
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="space-y-2">
                    {isUploadingImages ? (
                      <RefreshCw className="h-8 w-8 mx-auto text-gray-400 animate-spin" />
                    ) : (
                      <PackageCheck className="h-8 w-8 mx-auto text-gray-400" />
                    )}
                    <p className="text-sm text-gray-600">
                      {isUploadingImages
                        ? 'Đang tải lên...'
                        : deliveryEvidenceImages.length >= 3
                          ? 'Đã đạt giới hạn tối đa 3 hình ảnh'
                          : 'Nhấp để tải lên hình ảnh bằng chứng giao hàng'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deliveryEvidenceImages.length >= 3
                        ? 'Xóa hình ảnh hiện có để tải lên hình ảnh mới'
                        : `Tối thiểu 1 hình ảnh, tối đa 3 hình ảnh (PNG, JPG, JPEG)`}
                    </p>
                  </div>
                </label>
              </div>
              {deliveryEvidenceImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Đã chọn {deliveryEvidenceImages.length} hình ảnh:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {deliveryEvidenceImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group bg-gray-50 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={image}
                          alt={`Bằng chứng giao hàng ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setDeliveryEvidenceImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2 text-orange-700">
              <FileText className="h-4 w-4 text-orange-600" />
              Ghi chú
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
              rows={4}
              className="resize-none !border-orange-200 hover:!border-orange-300 focus:!border-orange-400 focus-visible:!ring-orange-200 focus-visible:!ring-2 focus-visible:!outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={cn(
                'flex-1 h-12 text-base font-medium',
                isFormValid
                  ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-200'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
            >
              {isLoading ? (
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
