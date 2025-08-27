import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, ImageIcon, Upload, X, Package } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
interface RetradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: any;
  retradeQuantity: number;
  setRetradeQuantity: (quantity: number) => void;
  retradePrice: number;
  setRetradePrice: (price: number) => void;
  shortDescription: string;
  setShortDescription: (desc: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  thumbnail: string;
  setThumbnail: (url: string) => void;
  onSubmit: (thumbnailFile?: File) => void;
  isSubmitting: boolean;
  formatPrice: (price: number) => string;
  status: 'INIT' | 'DRAFT';
  setStatus: (status: 'INIT' | 'DRAFT') => void;
}

export function RetradeModal({
  isOpen,
  onOpenChange,
  selectedItem,
  retradeQuantity,
  setRetradeQuantity,
  retradePrice,
  setRetradePrice,
  shortDescription,
  setShortDescription,
  description,
  setDescription,
  thumbnail,
  setThumbnail,
  onSubmit,
  isSubmitting,
  setStatus,
  formatPrice,
}: RetradeModalProps) {
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [tick, setTick] = useState(false);
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleChooseThumbnail = () => {
    thumbnailInputRef.current?.click();
  };
  const handleTickChange = (checked: boolean) => {
    setTick(checked);
    setStatus(checked ? 'DRAFT' : 'INIT');
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
      setThumbnailFile(file);
      setThumbnail(imageUrl);
    }
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview('');
      setThumbnailFile(undefined);
      setThumbnail('');
    }
  };

  const handleSubmit = () => {
    onSubmit(thumbnailFile);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

        {selectedItem && (
          <Card className="p-4 bg-orange-50 border-orange-200 mb-4 mt-2">
            <div className="flex items-center gap-4">
              {selectedItem.itemThumbnail && (
                <div className="h-20 w-20 relative rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                  <Image
                    src={selectedItem.itemThumbnail}
                    alt={selectedItem.itemName}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-lg text-gray-900">{selectedItem.itemName}</h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Giá gốc:</span>{' '}
                    {formatPrice(selectedItem.basePrice)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Số lượng đã mua:</span> {selectedItem.quantity}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 block">
                Số lượng trao đổi lại
              </label>
              <Input
                id="quantity"
                type="number"
                value={retradeQuantity}
                onChange={(e) =>
                  setRetradeQuantity(
                    Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      selectedItem?.quantity || 1,
                    ),
                  )
                }
                min="1"
                max={selectedItem?.quantity}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Tối đa: {selectedItem?.quantity || 1} sản phẩm
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 block">
                Giá trao đổi (VNĐ)
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
                Giá gốc: {formatPrice(selectedItem?.basePrice || 0)}
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
                    onClick={handleChooseThumbnail}
                    className="w-full h-11 px-4 border-dashed border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên hình ảnh
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
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
                          onClick={handleRemoveThumbnail}
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
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="draft-checkbox"
                checked={tick}
                onCheckedChange={(checked) => handleTickChange(checked as boolean)}
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
        </div>
        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
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
