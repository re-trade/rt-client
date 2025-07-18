'use client';

import { FancyMultiSelect } from '@/components/common/MultiSectCate';
import { SelectBrand } from '@/components/common/SelectBrand';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { productApi, TProduct, UpdateProductDto } from '@/service/product.api';
import { storageApi } from '@/service/storage.api';
import { Calendar, Image as ImageIcon, Package, Shield, Tag, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProduct | null;
  isEdit: boolean; // New prop to control editability
  onUpdateProduct: (
    product: Omit<
      TProduct,
      'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'sellerShopName' | 'verified'
    >,
  ) => void;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  isEdit,
  onUpdateProduct,
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
    warrantyExpiryDate: '',
    condition: 'NEW' as const,
    categoryIds: [] as string[],
    tags: '',
    status: 'DRAFT' as const,
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format date from array to string
  const formatDateFromArray = (dateInput: number[] | string): string => {
    if (Array.isArray(dateInput) && dateInput.length === 3) {
      const [year, month, day] = dateInput;
      const paddedMonth = String(month).padStart(2, '0');
      const paddedDay = String(day).padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
    if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }
    return '';
  };

  useEffect(() => {
    if (product) {
      console.log('Editing product:', product);
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
        warrantyExpiryDate: formatDateFromArray(product.warrantyExpiryDate),
        condition: product.condition || 'NEW',
        categoryIds: (product.categories || []).map((c) => c.id),
        tags: (product.tags || []).join(','),
        status: product.status || 'DRAFT',
      };
      setFormData(updatedForm);
      setInitialFormData(updatedForm);
      setImagePreviews(product.productImages || []);
      setThumbnailPreview(product.thumbnail || '');
    }
  }, [product]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [imagePreviews, thumbnailPreview]);

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    if (isEdit) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleChooseFiles = () => {
    if (isEdit) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) return;
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    if (!isEdit) return;
    const preview = imagePreviews[index];
    if (preview.startsWith('blob:')) {
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
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
      setThumbnailFile(file);
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    }
    e.target.value = '';
  };

  const handleRemoveThumbnail = () => {
    if (!isEdit) return;
    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview('');
    setThumbnailFile(undefined);
    setFormData((prev) => ({ ...prev, thumbnail: '' }));
  };

  const isFormChanged = (): boolean => {
    if (!isEdit || !initialFormData) return false;
    return (
      JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
      selectedFiles.length > 0 ||
      thumbnailFile !== undefined
    );
  };

  const handleSubmit = async () => {
    if (!isEdit) return;

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

    setIsSubmitting(true);
    toast.loading('Đang cập nhật sản phẩm...');

    try {
      let thumbnailUrl = formData.thumbnail;
      let productImageUrls = imagePreviews;

      // Upload new thumbnail if changed
      if (thumbnailFile) {
        const res = await storageApi.fileUpload(thumbnailFile);
        thumbnailUrl = res;
      }

      // Upload new product images if any
      if (selectedFiles.length > 0) {
        const res = await storageApi.fileBulkUpload(selectedFiles);
        // Filter out blob URLs and add new uploaded URLs
        const existingUrls = imagePreviews.filter((url) => !url.startsWith('blob:'));
        productImageUrls = [...existingUrls, ...res.content];
      }

      const productData: UpdateProductDto = {
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
        warrantyExpiryDate: formData.warrantyExpiryDate,
        condition: formData.condition,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (product?.id) {
        const response = await productApi.updateProduct(product.id, productData);
        onUpdateProduct(response);
        toast.success('Cập nhật sản phẩm thành công');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

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
                  disabled={!isEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                  Thương hiệu <span className="text-red-500">*</span>
                </Label>
                <SelectBrand
                  value={formData.brandId}
                  currentBrandId={formData.brandId}
                  onChange={(selectedBrand) => handleFormChange('brandId', selectedBrand ?? '')}
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-200">
              <Tag className="w-5 h-5 text-green-600" />
              Thông tin bổ sung
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
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
                  disabled={!isEdit}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleFormChange('tags', e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ngăn cách bằng dấu phẩy"
                  disabled={!isEdit}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <FancyMultiSelect
                value={formData.categoryIds}
                currentCategoryId={product?.categories}
                onChange={(selected) => handleFormChange('categoryIds', selected)}
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
                      placeholder: "Nhập mô tả ngắn gọn về sản phẩm",
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
                      placeholder: "Nhập mô tả chi tiết về sản phẩm",
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

        {/* Action Buttons */}
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
