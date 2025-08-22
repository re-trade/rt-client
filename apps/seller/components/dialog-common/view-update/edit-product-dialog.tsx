'use client';

import { FancyMultiSelect } from '@/components/common/MultiSectCate';
import { SelectBrand } from '@/components/common/SelectBrand';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TagInput from '@/components/ui/tag-input';
import { productApi, TProduct, UpdateProductDto } from '@/service/product.api';
import { storageApi } from '@/service/storage.api';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import { Calendar, Image as ImageIcon, Lock, Package, Shield, Tag, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface EditProductDialogProps {
  product: TProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateProduct?: (product: Partial<UpdateProductDto>) => void;
  isEdit?: boolean;
}

export function formatDateFromArray(dateArr: any[] | undefined | string): string {
  if (!dateArr) return '';
  if (typeof dateArr === 'string') return dateArr;
  if (dateArr.length < 3) return '';

  const [year, month, day] = dateArr;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function EditProductDialog({
  product,
  open,
  onOpenChange,
  onUpdateProduct = () => {},
  isEdit = false,
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    productImages: '',
    brandId: '',
    model: '',
    currentPrice: '',
    quantity: 0,
    hasWarranty: false,
    warrantyExpiryDate: '',
    condition: 'NEW',
    categoryIds: [] as string[],
    tags: [] as string[],
    status: 'DRAFT',
    categorySelected: false,
    retraded: false,
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warrantyDateError, setWarrantyDateError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      const productCategories = product.categories || [];
      const updatedForm = {
        name: product.name || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        thumbnail: product.thumbnail || '',
        productImages: product.productImages.join(','),
        brandId: product.brandId || '',
        model: product.model || '',
        currentPrice: product.currentPrice?.toString() || '',
        quantity: product.quantity || 0,
        hasWarranty: Boolean(product.warrantyExpiryDate),
        warrantyExpiryDate: formatDateFromArray(product.warrantyExpiryDate),
        condition: product.condition || 'NEW',
        categoryIds: productCategories.map((c) => c.id),
        tags: product.tags || [],
        status: product.status || 'DRAFT',
        categorySelected: true,
        retraded: product.retraded || false,
      };
      setFormData(updatedForm as typeof formData);
      setInitialFormData(updatedForm);
      setImagePreviews(product.productImages || []);
      setThumbnailPreview(product.thumbnail || '');
    }
  }, [product]);

  useEffect(() => {
    if (formData.hasWarranty && formData.warrantyExpiryDate) {
      validateWarrantyDate(formData.warrantyExpiryDate);
    } else {
      setWarrantyDateError('');
    }
  }, [formData.hasWarranty, formData.warrantyExpiryDate]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [imagePreviews, thumbnailPreview]);

  const handleFormChange = (field: string, value: any) => {
    if (!isEdit) return;

    if (field === 'categoryIds') {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        categorySelected: true,
        brandId: prev.retraded ? prev.brandId : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (field === 'hasWarranty' && !value) {
      setWarrantyDateError('');
    }
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
    if (isEdit) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    if (!isEdit) return;
    const preview = imagePreviews[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChooseThumbnail = () => {
    if (isEdit) {
      thumbnailInputRef.current?.click();
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) return;
    const file = e.target.files?.[0];
    if (file) {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setSelectedThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      e.target.value = '';
    }
  };

  const handleRemoveThumbnail = () => {
    if (!isEdit) return;
    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview('');
    setSelectedThumbnail(null);
    setFormData((prev) => ({ ...prev, thumbnail: '' }));
  };

  const isFormChanged = () => {
    if (!initialFormData) return false;

    if (selectedThumbnail || selectedFiles.length > 0) return true;

    for (const key in formData) {
      if (key === 'productImages') continue;
      if (
        JSON.stringify(formData[key as keyof typeof formData]) !==
        JSON.stringify(initialFormData[key as keyof typeof initialFormData])
      ) {
        return true;
      }
    }
    return false;
  };

  // ...existing code...

  const handleSubmit = async () => {
    if (!isEdit) return;
    if (!isFormChanged()) {
      toast.info('Không có thay đổi để cập nhật');
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

    try {
      setIsSubmitting(true);

      // Tạo loading toast với ID để có thể dismiss specific toast này
      const loadingToastId = toast.loading('Đang cập nhật sản phẩm...');

      let thumbnailUrl = formData.thumbnail;
      if (selectedThumbnail) {
        thumbnailUrl = await storageApi.fileUpload(selectedThumbnail);
      }

      let productImages = [...imagePreviews];
      if (selectedFiles.length > 0) {
        const existingImages = imagePreviews.filter((url) => !url.startsWith('blob:'));
        const result = await storageApi.fileBulkUpload(selectedFiles);
        const uploadedUrls = result.content || [];
        productImages = [...existingImages, ...uploadedUrls];
      }

      const productData: UpdateProductDto = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        thumbnail: thumbnailUrl,
        productImages,
        brandId: formData.brandId,
        model: formData.model,
        currentPrice: Number(formData.currentPrice) || 0,
        categoryIds: formData.categoryIds,
        quantity: formData.quantity,
        warrantyExpiryDate: formData.hasWarranty ? formData.warrantyExpiryDate : '',
        condition: formData.condition,
        tags: formData.tags.filter(Boolean),
      };

      if (product?.retraded) {
        const validationErrors = [];

        if (product.name !== formData.name) {
          validationErrors.push('Không thể thay đổi tên sản phẩm bán lại');
        }
        if (product.brandId !== formData.brandId) {
          validationErrors.push('Không thể thay đổi thương hiệu cho sản phẩm bán lại');
        }
        if (product.model !== formData.model) {
          validationErrors.push('Không thể thay đổi model cho sản phẩm bán lại');
        }
        if (
          JSON.stringify(product.categories.map((c) => c.id).sort()) !==
          JSON.stringify(formData.categoryIds.sort())
        ) {
          validationErrors.push('Không thể thay đổi danh mục cho sản phẩm bán lại');
        }
        if (product.quantity !== formData.quantity) {
          validationErrors.push('Không thể thay đổi số lượng cho sản phẩm bán lại');
        }

        if (validationErrors.length > 0) {
          // Dismiss loading toast trước khi hiện error
          toast.dismiss(loadingToastId);
          toast.error(validationErrors[0]);
          return;
        }
      }

      if (product?.id) {
        const response = await productApi.updateProduct(product.id, productData);

        // Dismiss loading toast trước khi hiện result
        toast.dismiss(loadingToastId);

        if (!response.success) {
          toast.error(response.message || 'Không thể cập nhật sản phẩm');
          return;
        }

        onUpdateProduct(response.content);
        toast.success('Cập nhật sản phẩm thành công');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      // Bỏ toast.dismiss() ở đây vì nó sẽ dismiss cả success toast
    }
  };

  // ...existing code...

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            {isEdit ? 'Chỉnh sửa sản phẩm' : 'Xem sản phẩm'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-6">
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
                <div className="relative">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm"
                    disabled={!isEdit || formData.retraded}
                  />
                  {formData.retraded && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  )}
                </div>
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
                  disabled={!isEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Số lượng
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    id="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                    disabled={!isEdit || formData.retraded}
                  />
                  {formData.retraded && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                  Model
                </Label>
                <div className="relative">
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleFormChange('model', e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nhập model sản phẩm"
                    disabled={!isEdit || formData.retraded}
                  />
                  {formData.retraded && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  )}
                </div>
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
                  disabled={!isEdit}
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
                <div className="relative">
                  <SelectBrand
                    value={formData.brandId}
                    currentBrandId={formData.brandId}
                    onChange={(selectedBrand) => handleFormChange('brandId', selectedBrand || '')}
                    disabled={formData.retraded}
                  />
                  {formData.retraded && (
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  )}
                </div>
                {formData.retraded && (
                  <p className="text-sm text-amber-600 mt-1">
                    Không thể thay đổi thương hiệu cho sản phẩm bán lại.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Tag className="w-5 h-5 text-green-600" />
              Thông tin bổ sung
            </h3>

            {formData.retraded && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Đây là sản phẩm bán lại. Những trường sau không thể thay đổi: tên, thương hiệu,
                  model, danh mục và số lượng.
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Các trường này đã bị khóa để tránh vi phạm quy định hệ thống.
                </p>
              </div>
            )}

            <div className="space-y-2 mt-4">
              <Label className="text-sm font-medium text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <FancyMultiSelect
                  value={formData.categoryIds}
                  currentCategoryId={product?.categories || []}
                  onChange={(selected) => handleFormChange('categoryIds', selected)}
                  disabled={formData.retraded}
                />
                {formData.retraded && (
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-amber-500" />
                )}
              </div>
              {formData.retraded && (
                <p className="text-sm text-amber-600 mt-1">
                  Không thể thay đổi danh mục cho sản phẩm bán lại.
                </p>
              )}
            </div>

            {/* Warranty Section - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Tình trạng bảo hành
                </Label>
                <select
                  value={formData.hasWarranty ? 'yes' : 'no'}
                  onChange={(e) => handleFormChange('hasWarranty', e.target.value === 'yes')}
                  className="w-full h-11 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  disabled={!isEdit}
                >
                  <option value="no">Không có bảo hành</option>
                  <option value="yes">Còn bảo hành</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="warrantyExpiryDate"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Ngày hết hạn bảo hành
                </Label>
                <Input
                  id="warrantyExpiryDate"
                  type="date"
                  value={formData.warrantyExpiryDate}
                  onChange={handleWarrantyDateChange}
                  className={`h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    warrantyDateError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  disabled={!isEdit || !formData.hasWarranty}
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                />
                {formData.hasWarranty && isEdit && !warrantyDateError && (
                  <p className="text-xs text-gray-500 mt-1">
                    Chọn ngày trong tương lai (sau ngày hôm nay)
                  </p>
                )}
                {warrantyDateError && (
                  <p className="text-xs text-red-500 mt-1">{warrantyDateError}</p>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2 mt-4">
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
                disabled={!isEdit}
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
              {/* Mô tả ngắn */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
                  Mô tả ngắn
                </Label>
                <div className="rounded-md shadow-sm border border-gray-300">
                  <MDEditor
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(value) => handleFormChange('shortDescription', value || '')}
                    preview="edit"
                    height={150}
                    data-color-mode="light"
                    textareaProps={{
                      disabled: !isEdit,
                      placeholder: 'Nhập mô tả ngắn gọn về sản phẩm',
                    }}
                  />
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Mô tả chi tiết
                </Label>
                <div className="rounded-md shadow-sm border border-gray-300">
                  <MDEditor
                    id="description"
                    value={formData.description}
                    onChange={(value) => handleFormChange('description', value || '')}
                    preview="edit"
                    height={200}
                    data-color-mode="light"
                    textareaProps={{
                      disabled: !isEdit,
                      placeholder: 'Nhập mô tả chi tiết về sản phẩm',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <ImageIcon className="w-5 h-5 text-orange-600" />
              Hình ảnh sản phẩm
            </h3>

            {/* Thumbnail */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Ảnh đại diện
                  </Label>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleChooseThumbnail}
                      className="h-11 px-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>
                  )}
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
                      {isEdit && (
                        <button
                          type="button"
                          onClick={handleRemoveThumbnail}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
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

            {/* Product Images */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Ảnh sản phẩm chi tiết
                  </Label>
                  {isEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleChooseFiles}
                      className="h-11 px-4 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn nhiều ảnh
                    </Button>
                  )}
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
                            {isEdit && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
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
        </div>

        <div className="flex gap-4 pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          {isEdit && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormChanged()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
