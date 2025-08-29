'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RetradeOrderItem, RetradeProductDetail } from '@/service/product.api';
import { RetradeRequest } from '@/service/retrade.api';
import { storageApi } from '@/service/storage.api';
import { ImageIcon, Package, ShoppingBag, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface RetradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: RetradeRequest) => Promise<void>;
  productDetail: RetradeProductDetail;
  selectedOrderItem: RetradeOrderItem | null;
  maxRetradeQuantity: number;
  refreshProductDetail: () => void;
}

export default function RetradeModal({
  isOpen,
  onClose,
  onSubmit,
  productDetail,
  selectedOrderItem,
  maxRetradeQuantity,
  refreshProductDetail,
}: RetradeModalProps) {
  const [retradeQuantity, setRetradeQuantity] = useState(1);
  const [retradePrice, setRetradePrice] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (productDetail) {
      if (productDetail.currentPrice) {
        setRetradePrice(productDetail.currentPrice);
      }

      if (productDetail.shortDescription) {
        setShortDescription(productDetail.shortDescription);
      }

      if (productDetail.description) {
        setDescription(productDetail.description);
      }

      if (productDetail.thumbnail) {
        setThumbnail(productDetail.thumbnail);
      }
    }
  }, [productDetail]);

  useEffect(() => {
    if (!isOpen) {
      setThumbnailPreview('');
      setThumbnailFile(undefined);
    }
  }, [isOpen]);

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Helper function to get condition label and color
  function getConditionInfo() {
    if (!productDetail?.condition)
      return { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' };

    const condition = productDetail.condition.toLowerCase();

    if (condition.includes('new') || condition.includes('mới')) {
      return { label: 'Mới', color: 'bg-green-100 text-green-800' };
    } else if (condition.includes('like new') || condition.includes('như mới')) {
      return { label: 'Như mới', color: 'bg-emerald-100 text-emerald-800' };
    } else if (condition.includes('used') || condition.includes('đã sử dụng')) {
      return { label: 'Đã sử dụng', color: 'bg-amber-100 text-amber-800' };
    } else if (condition.includes('refurbished') || condition.includes('tân trang')) {
      return { label: 'Đã tân trang', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { label: condition, color: 'bg-gray-100 text-gray-800' };
    }
  }

  const conditionInfo = getConditionInfo();

  async function handleRetradeSubmit() {
    if (!productDetail || !selectedOrderItem) {
      toast.error('Thiếu thông tin sản phẩm hoặc đơn hàng');
      return;
    }

    if (retradeQuantity <= 0 || retradeQuantity > maxRetradeQuantity) {
      toast.error(`Số lượng phải từ 1 đến ${maxRetradeQuantity}`);
      return;
    }

    if (retradePrice <= 0) {
      toast.error('Giá bán phải lớn hơn 0');
      return;
    }

    setIsSubmitting(true);

    try {
      let thumbnailUrl = thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await storageApi.fileUpload(thumbnailFile);
      }

      const request: RetradeRequest = {
        orderItemId: selectedOrderItem.id,
        quantity: retradeQuantity,
        price: retradePrice,
        shortDescription: shortDescription || productDetail.shortDescription || '',
        description: description || productDetail.description || '',
        thumbnail: thumbnailUrl || productDetail.thumbnail || '',
        status: tick ? 'DRAFT' : 'INIT',
      };

      await onSubmit(request);
      toast.success('Đã gửi yêu cầu đăng bán lại thành công');
      onClose();
      refreshProductDetail();
    } catch (err: any) {
      toast.error(`Đăng bán lại thất bại: ${err.message || 'Đã xảy ra lỗi'}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-orange-600">
            Đăng bán lại sản phẩm
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-500 mt-1">
              Điền đầy đủ thông tin để gửi yêu cầu đăng bán lại
            </p>
          </DialogDescription>
        </DialogHeader>

        {selectedOrderItem && (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Đơn hàng #{selectedOrderItem.id.substring(0, 8)}</p>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 border-orange-200 text-orange-700"
                  >
                    Số lượng tối đa: {selectedOrderItem.retradeQuantity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Người bán: {selectedOrderItem.sellerName || 'Không xác định'}
                </p>
              </div>
            </div>
          </div>
        )}

        {productDetail && (
          <Card className="p-4 bg-gray-50 border-gray-200 mb-4">
            <div className="flex items-center gap-4">
              {productDetail?.thumbnail && (
                <div className="h-20 w-20 relative rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    src={productDetail.thumbnail}
                    alt={productDetail.name || ''}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-900">{productDetail?.name || ''}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Giá gốc:</span>{' '}
                    {formatPrice(productDetail?.currentPrice || 0)}
                  </p>
                  <Badge className={conditionInfo.color}>{conditionInfo.label}</Badge>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 block">
                Số lượng trao đổi lại <span className="text-red-500">*</span>
              </label>
              <Input
                id="quantity"
                type="number"
                value={retradeQuantity}
                onChange={(e) =>
                  setRetradeQuantity(
                    Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      selectedOrderItem?.retradeQuantity || 1,
                    ),
                  )
                }
                min="1"
                max={selectedOrderItem?.retradeQuantity || 1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Tối đa: {selectedOrderItem?.retradeQuantity || 1} sản phẩm
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 block">
                Giá trao đổi (VNĐ) <span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                type="number"
                value={retradePrice}
                onChange={(e) => setRetradePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Giá gốc: {formatPrice(productDetail?.currentPrice || 0)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="shortDescription" className="text-sm font-medium text-gray-700 block">
              Mô tả ngắn
            </label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full"
              placeholder="Nhập mô tả ngắn gọn về sản phẩm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 block">
              Mô tả chi tiết
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px]"
              placeholder="Mô tả chi tiết về tình trạng sản phẩm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="thumbnail" className="text-sm font-medium text-gray-700 block">
              Hình ảnh sản phẩm
            </label>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full h-11 px-4 border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên hình ảnh
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                        const imageUrl = URL.createObjectURL(file);
                        setThumbnailPreview(imageUrl);
                        setThumbnailFile(file);
                        setThumbnail(imageUrl);
                      }
                    }}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Hỗ trợ định dạng: JPG, PNG, GIF
                  </p>
                </div>

                <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200">
                  {thumbnailPreview || thumbnail ? (
                    <div className="relative group">
                      <div className="w-full h-48 relative">
                        <Image
                          src={thumbnailPreview || thumbnail}
                          alt="Thumbnail"
                          fill
                          className="rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                            setThumbnailPreview('');
                            setThumbnailFile(undefined);
                            setThumbnail('');
                          }}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Chưa có ảnh</p>
                        <p className="text-xs text-gray-400 mt-1">Ảnh sản phẩm sẽ hiển thị ở đây</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="draft-checkbox"
              checked={tick}
              onCheckedChange={(checked) => setTick(checked as boolean)}
              className="h-5 w-5 rounded border-2 border-orange-500 bg-white data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white focus:ring-orange-500 focus:ring-offset-0"
            />
            <Label
              htmlFor="draft-checkbox"
              className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-orange-500" />
              Lưu dưới dạng bản nháp
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            {tick
              ? 'Sản phẩm sẽ được lưu dưới dạng bản nháp và không được duyệt cho đến khi chuyển sang trạng thái khởi tạo.'
              : 'Sản phẩm sẽ được lưu và gửi để duyệt ngay lập tức.'}
          </p>
        </div>
        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button
            onClick={handleRetradeSubmit}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Xác nhận đăng bán lại'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
