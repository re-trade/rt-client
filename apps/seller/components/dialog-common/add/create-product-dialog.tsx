'use client';

import { FancyMultiSelect } from '@/components/common/MultiSectCate';
import { SelectBrand } from '@/components/common/SelectBrand';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TagInput from '@/components/ui/tag-input';
import { CreateProductDto, productApi, TProductStatus } from '@/service/product.api';
import { storageApi } from '@/service/storage.api';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { Calendar, Image as ImageIcon, Package, Shield, Tag, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface CreateProductDialogProps {
  open: boolean;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductDialog({ onSuccess, open, onOpenChange }: CreateProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    productImages: '',
    brandId: '',
    discount: '',
    model: '',
    currentPrice: '',
    quantity: 0,
    hasWarranty: false,
    warrantyExpiryDate: '',
    condition: 'NEW' as const,
    categoryIds: [] as string[],
    tags: [] as string[],
    status: 'INIT' as TProductStatus,
    categorySelected: true,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warrantyDateError, setWarrantyDateError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [imagePreviews, thumbnailPreview]);

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    if (field === 'categoryIds') {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        categorySelected: true,
        brandId: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (field === 'hasWarranty' && !value) {
      setWarrantyDateError('');
      setFormData((prev) => ({ ...prev, warrantyExpiryDate: '' }));
    }
  };

  const handleTickChange = (checked: boolean) => {
    setTick(checked);
    handleFormChange('status', checked ? 'DRAFT' : 'INIT');
  };

  const validateWarrantyDate = (dateValue: string) => {
    if (!dateValue) {
      setWarrantyDateError('');
      return;
    }

    const today = new Date();
    const warrantyDate = new Date(dateValue);

    today.setHours(0, 0, 0, 0);
    warrantyDate.setHours(0, 0, 0, 0);

    if (warrantyDate <= today) {
      setWarrantyDateError('Ngày hết hạn bảo hành phải là ngày trong tương lai');
    } else {
      setWarrantyDateError('');
    }
  };

  const handleWarrantyDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFormChange('warrantyExpiryDate', value);
    validateWarrantyDate(value);
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index] || '');
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChooseThumbnail = () => {
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
      setThumbnailFile(file);
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    }
    e.target.value = '';
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview('');
      setThumbnailFile(undefined);
      setFormData((prev) => ({ ...prev, thumbnail: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!formData.brandId) {
      toast.error('Vui lòng chọn thương hiệu');
      return;
    }

    if (!formData.currentPrice || Number(formData.currentPrice) <= 0) {
      toast.error('Vui lòng nhập giá sản phẩm hợp lệ');
      return;
    }

    if (formData.categoryIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Vui lòng nhập số lượng sản phẩm hợp lệ và lớn hơn 0');
      return;
    }
    if (formData.shortDescription.trim().length === 0) {
      toast.error('Vui lòng nhập mô tả ngắn cho sản phẩm');
      return;
    }
    if (formData.description.trim().length === 0) {
      toast.error('Vui lòng nhập mô tả cho sản phẩm');
      return;
    }
    if (formData.tags.length === 0) {
      toast.error('Vui lòng nhập ít nhất một thẻ cho sản phẩm');
      return;
    }
    if (!thumbnailFile) {
      toast.error('Vui lòng chọn ảnh đại diện cho sản phẩm');
      return;
    }
    if (formData.model.trim().length === 0) {
      toast.error('Vui lòng nhập model cho sản phẩm');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hình ảnh chi tiết cho sản phẩm');
      return;
    }
    if (formData.hasWarranty) {
      if (!formData.warrantyExpiryDate) {
        toast.error('Vui lòng chọn ngày hết hạn bảo hành');
        return;
      }

      const today = new Date();
      const warrantyDate = new Date(formData.warrantyExpiryDate);

      today.setHours(0, 0, 0, 0);
      warrantyDate.setHours(0, 0, 0, 0);

      if (warrantyDate <= today) {
        toast.error('Ngày hết hạn bảo hành phải là ngày trong tương lai');
        return;
      }
    }

    if (warrantyDateError) {
      toast.error(warrantyDateError);
      return;
    }

    setIsSubmitting(true);
    toast.loading('Đang tạo sản phẩm...');

    try {
      let thumbnailUrl = '';
      let productImageUrls: string[] = [];

      if (thumbnailFile) {
        const res = await storageApi.fileUpload(thumbnailFile);
        thumbnailUrl = res;
      }

      if (selectedFiles.length > 0) {
        const res = await storageApi.fileBulkUpload(selectedFiles);
        productImageUrls = res.content;
      }

      const productData: CreateProductDto = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        thumbnail: thumbnailUrl,
        productImages: productImageUrls,
        brandId: formData.brandId,
        model: formData.model,
        currentPrice: Number(formData.currentPrice) || 0,
        categoryIds: formData.categoryIds,
        quantity: formData.quantity,
        warrantyExpiryDate: formData.hasWarranty ? formData.warrantyExpiryDate : '',
        condition: formData.condition,
        status: formData.status,
        tags: formData.tags.filter((tag) => tag !== ''),
      };
      const response = await productApi.createProduct(productData);
      if (!response.success) {
        toast.error(response.message);
      }
      toast.success('Tạo sản phẩm thành công');
      onOpenChange(false);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Không thể tạo sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      thumbnail: '',
      productImages: '',
      brandId: '',
      discount: '',
      model: '',
      currentPrice: '',
      categoryIds: [],
      quantity: 0,
      hasWarranty: false,
      warrantyExpiryDate: '',
      condition: 'NEW',
      tags: [],
      status: 'INIT',
      categorySelected: true,
    });
    setImagePreviews([]);
    setSelectedFiles([]);
    setThumbnailPreview('');
    setThumbnailFile(undefined);
    setTick(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Tạo sản phẩm mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Package className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPrice" className="text-sm font-medium text-gray-700">
                  Giá sản phẩm <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currentPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentPrice}
                  onChange={(e) => handleFormChange('currentPrice', e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Số lượng
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                  Model
                </Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleFormChange('model', e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nhập model sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                  Tình trạng sản phẩm
                </Label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleFormChange('condition', e.target.value)}
                  className="w-full h-11 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="NEW">Mới</option>
                  <option value="LIKE_NEW">Như mới</option>
                  <option value="USED_GOOD">Đã qua sử dụng - Tốt</option>
                  <option value="USED_FAIR">Đã qua sử dụng - Trung bình</option>
                  <option value="BROKEN">Hỏng</option>
                  <option value="DAMAGED">Hư hại</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                  Thương hiệu <span className="text-red-500">*</span>
                </Label>
                <SelectBrand
                  value={formData.brandId}
                  onChange={(selectedBrand) => handleFormChange('brandId', selectedBrand ?? '')}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <Checkbox
                    id="hasWarranty"
                    checked={formData.hasWarranty}
                    onCheckedChange={(checked) => handleFormChange('hasWarranty', checked as boolean)}
                    className="h-5 w-5 rounded border-2 border-orange-500 bg-white data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:text-white focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <Label
                    htmlFor="hasWarranty"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-orange-500" />
                    Sản phẩm có bảo hành
                  </Label>
                </div>
          {formData.hasWarranty && (
                  <div className="mt-2">
                    <Label
                      htmlFor="warrantyExpiryDate"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Ngày hết hạn bảo hành
                    </Label>
                    <Input
                      id="warrantyExpiryDate"
                      type="date"
                      value={formData.warrantyExpiryDate}
                      onChange={(e) => handleFormChange('warrantyExpiryDate', e.target.value)}
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Tag className="w-5 h-5 text-green-600" />
              Thông tin bổ sung
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <FancyMultiSelect
                value={formData.categoryIds}
                onChange={(selected) => handleFormChange('categoryIds', selected)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-green-600" />
                Tags
              </Label>
              <TagInput
                value={formData.tags}
                onChange={(tags) => handleFormChange('tags', tags)}
                placeholder="Nhập tag và nhấn Enter"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Shield className="w-5 h-5 text-purple-600" />
              Mô tả sản phẩm
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
                  Mô tả ngắn
                </Label>
                <MDEditor
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(value) => handleFormChange('shortDescription', value || '')}
                  height={150}
                  preview="edit"
                  data-color-mode="light"
                  textareaProps={{
                    placeholder: 'Nhập mô tả ngắn gọn về sản phẩm',
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </Label>
                <MDEditor
                  id="description"
                  value={formData.description}
                  onChange={(value) => handleFormChange('description', value || '')}
                  height={200}
                  preview="edit"
                  data-color-mode="light"
                  textareaProps={{
                    placeholder: 'Nhập mô tả chi tiết về sản phẩm',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <ImageIcon className="w-5 h-5 text-orange-600" />
              Hình ảnh sản phẩm
            </h3>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Ảnh đại diện
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseThumbnail}
                    className="h-11 px-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn ảnh
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 flex justify-center">
                  {thumbnailPreview ? (
                    <div className="relative w-40 h-40 group">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        fill
                        className="rounded-lg object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Chưa có ảnh</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Ảnh sản phẩm chi tiết
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseFiles}
                    className="h-11 px-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn nhiều ảnh
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="w-full h-32 relative">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="rounded-lg object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-100">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chưa có ảnh chi tiết</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Draft Checkbox */}
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}