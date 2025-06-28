'use client';

import { MultiSelectCategory } from '@/components/common/MultiSelectCategory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TProduct } from '@/service/product.api';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProduct | null;
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
  onUpdateProduct,
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    productImages: '',
    brand: '',
    discount: '',
    model: '',
    currentPrice: '',
    categoryIds: '',
    keywords: '',
    tags: '',
    status: 'DRAFT',
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        thumbnail: product.thumbnail,
        productImages: product.productImages.join(','),
        brand: product.brand,
        discount: product.discount?.toString() || '',
        model: product.model,
        currentPrice: product.currentPrice?.toString() || '',
        categoryIds: (product.categories || []).join(','),
        keywords: (product.keywords || []).join(','),
        tags: (product.tags || []).join(','),
        status: product.status || 'DRAFT',
      });
      setImagePreviews(product.productImages || []);
    }
  }, [product]);

  const handleChooseFiles = () => fileInputRef.current?.click();
  const handleChooseThumbnail = () => thumbnailInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, thumbnail: imageUrl });
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData({ ...formData, thumbnail: '' });
  };

  const handleSubmit = () => {
    const productData: Omit<
      TProduct,
      'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'sellerShopName' | 'verified'
    > = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      thumbnail: formData.thumbnail,
      productImages: imagePreviews,
      brand: formData.brand,
      discount: Number(formData.discount) || 0,
      model: formData.model,
      currentPrice: Number(formData.currentPrice) || 0,
      categories: [],
      categoryIds: formData.categoryIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
      keywords: formData.keywords
        .split(',')
        .map((kw) => kw.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: formData.status as 'DRAFT' | 'ACTIVE' | 'INACTIVE',
    };
    onUpdateProduct(productData);
    onOpenChange(false);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Tên sản phẩm"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
          />
          <InputField
            label="Thương hiệu"
            value={formData.brand}
            onChange={(v) => setFormData({ ...formData, brand: v })}
          />
          {/* <InputField
            label="Danh mục"
            value={formData.categoryIds}
            onChange={(v) => setFormData({ ...formData, categoryIds: v })}
          /> */}
          <InputField
            label="Giảm giá (%)"
            type="number"
            value={formData.discount}
            onChange={(v) => setFormData({ ...formData, discount: v })}
          />
          <InputField
            label="Model"
            value={formData.model}
            onChange={(v) => setFormData({ ...formData, model: v })}
          />
          <InputField
            label="Giá sản phẩm"
            type="number"
            value={formData.currentPrice}
            onChange={(v) => setFormData({ ...formData, currentPrice: v })}
          />
          {/* <InputField label="Trạng thái" value={formData.status} onChange={(v) => setFormData({ ...formData, status: v })} placeholder="DRAFT / ACTIVE / INACTIVE" /> */}
          <InputField
            label="Từ khóa"
            value={formData.keywords}
            onChange={(v) => setFormData({ ...formData, keywords: v })}
          />
          <InputField
            label="Tags"
            value={formData.tags}
            onChange={(v) => setFormData({ ...formData, tags: v })}
          />
          <div className="md:col-span-2">
            <Label htmlFor="categoryIds">Danh mục</Label>
            <MultiSelectCategory
              value={formData.categoryIds}
              onChange={(selected) => handleFormChange('categoryIds', selected)}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Mô tả ngắn</Label>
            <Textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2 flex flex-row items-start">
            <div className="flex flex-col space-y-2">
              <Label>Ảnh đại diện</Label>
              <Button
                variant="outline"
                className="flex gap-2 items-center bg-gray-600 text-white hover:bg-gray-500"
                onClick={handleChooseThumbnail}
              >
                <ImageIcon className="w-4 h-4" />
                Chọn ảnh
              </Button>
              <Input
                type="file"
                accept="image/*"
                ref={thumbnailInputRef}
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 flex justify-center ml-8">
              {formData.thumbnail && (
                <div className="relative w-36 h-36">
                  <Image
                    src={formData.thumbnail}
                    alt="Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div className="md:col-span-2 flex flex-row items-start">
            <div className="flex flex-col space-y-2">
              <Label>Ảnh sản phẩm chi tiết</Label>
              <Button
                variant="outline"
                className="flex gap-2 items-center bg-gray-600 text-white hover:bg-gray-500"
                onClick={handleChooseFiles}
              >
                <ImageIcon className="w-4 h-4" />
                Chọn ảnh
              </Button>
              <Input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 flex flex-wrap gap-4 justify-center ml-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-36 h-36">
                  <Image
                    src={preview}
                    alt={`Preview ${index}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6">
          Cập nhật sản phẩm
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);
