'use client';

import { FancyMultiSelect } from '@/components/common/MultiSectCate';
import { SelectBrand } from '@/components/common/SelectBrand';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateProductDto, productApi } from '@/service/product.api';
import { storageApi } from '@/service/storage.api'; // Added missing import
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
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
    warrantyExpiryDate: '',
    condition: 'NEW' as const,
    categoryIds: [] as string[],
    tags: '',
    status: 'DRAFT' as const,
  });
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['react', 'angular']);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(); // Added missing state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Clean up URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [imagePreviews, thumbnailPreview]);

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    event.target.value = ''; // Reset input
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
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
      setThumbnailFile(file); // Store the actual file
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
    }
    e.target.value = ''; // Reset input
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
    // Basic validation
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
        warrantyExpiryDate: formData.warrantyExpiryDate,
        condition: formData.condition,
        status: formData.status,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const created = await productApi.createProduct(productData);
      toast.success('Tạo sản phẩm thành công');
      // Chỉ đóng dialog khi tạo thành công
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Không thể tạo sản phẩm. Vui lòng thử lại.');
      // Không đóng dialog khi có lỗi để user có thể sửa và thử lại
    } finally {
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
      warrantyExpiryDate: '',
      condition: 'NEW',
      tags: '',
      status: 'DRAFT',
    });
    setImagePreviews([]);
    setSelectedFiles([]);
    setThumbnailPreview('');
    setThumbnailFile(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="brand">Thương hiệu *</Label>
            <SelectBrand
              value={formData.brandId}
              onChange={(selectedBrand) => handleFormChange('brandId', selectedBrand ?? '')}
            />
          </div>

          <div>
            <Label htmlFor="currentPrice">Giá sản phẩm *</Label>
            <Input
              id="currentPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.currentPrice}
              onChange={(e) => handleFormChange('currentPrice', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="quantity">Số lượng</Label>
            <Input
              type="number"
              id="quantity"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => handleFormChange('model', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="warrantyExpiryDate">Ngày hết hạn bảo hành</Label>
            <Input
              id="warrantyExpiryDate"
              type="date"
              value={formData.warrantyExpiryDate}
              onChange={(e) => handleFormChange('warrantyExpiryDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="condition">Tình trạng sản phẩm</Label>
            <select
              id="condition"
              value={formData.condition}
              onChange={(e) => handleFormChange('condition', e.target.value)}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="NEW">Mới</option>
              <option value="LIKE_NEW">Như mới</option>
              <option value="USED_GOOD">Đã qua sử dụng - Tốt</option>
              <option value="USED_FAIR">Đã qua sử dụng - Trung bình</option>
              <option value="BROKEN">Hỏng</option>
              <option value="DAMAGED">Hư hại</option>
            </select>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleFormChange('tags', e.target.value)}
              placeholder="Ngăn cách bằng dấu phẩy"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="categoryIds">Danh mục *</Label>
            {/* <MultiSelectCategory
              value={formData.categoryIds}
              onChange={(selected) => handleFormChange('categoryIds', selected)}
            /> */}
            <FancyMultiSelect
              value={formData.categoryIds}
              onChange={(selected) => handleFormChange('categoryIds', selected)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shortDescription">Mô tả ngắn</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleFormChange('shortDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-row items-start">
              <div className="flex flex-col items-start space-y-2">
                <Label>Ảnh đại diện</Label>
                <Button
                  type="button"
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  variant="outline"
                  onClick={handleChooseThumbnail}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
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
              <div className="flex-1 flex justify-center ml-8">
                {thumbnailPreview && (
                  <div className="relative w-36 h-36">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-row items-start">
              <div className="flex flex-col items-start space-y-2">
                <Label htmlFor="productImages">Ảnh sản phẩm chi tiết</Label>
                <Button
                  type="button"
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  variant="outline"
                  onClick={handleChooseFiles}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Chọn ảnh
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
              <div className="flex-1 flex justify-center ml-4">
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-36 h-36">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="button" onClick={handleSubmit} className="flex-1">
            Tạo sản phẩm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
