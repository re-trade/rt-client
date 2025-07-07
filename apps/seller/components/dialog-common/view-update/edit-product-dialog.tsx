'use client';

import { MultiSelectCategory } from '@/components/common/MultiSelectCategory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateProductDto, productApi, TProduct, UpdateProductDto } from '@/service/product.api';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SelectBrand } from '@/components/common/SelectBrand';
import { FancyMultiSelect } from '@/components/common/MultiSectCate';

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
    brandId: '',
    model: '',
    currentPrice: '',
    listOfCategories: [] as { id: string; name: string }[],
    quantity: 0,
    warrantyExpiryDate: '',
    condition: '',
    categoryIds: [] as string[],
    tags: '',
    status: '',
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

const formatDateFromArray = (dateInput: number[] | string): string => {
  // Trường hợp là mảng số
  if (Array.isArray(dateInput) && dateInput.length === 3) {
    const [year, month, day] = dateInput;
    const paddedMonth = String(month).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }
  // Trường hợp là chuỗi
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateInput; // Nếu chuỗi đã đúng định dạng YYYY-MM-DD, trả về nguyên vẹn
  }
  // Trường hợp không hợp lệ
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
        listOfCategories: product.listOfCategories || [],
        currentPrice: product.currentPrice?.toString() || '',
        quantity: product.quantity || 0,
        warrantyExpiryDate: formatDateFromArray(product.warrantyExpiryDate),
        condition: product.condition || 'NEW',
        categoryIds: (product.listOfCategories || []).map(c => c.id),
        tags: (product.tags || []).join(','),
        status: product.status || 'DRAFT',
      };
      setFormData(updatedForm);
      setInitialFormData(updatedForm);
      setImagePreviews(product.productImages || []);
    }
  }, [product]);
  // helper: format mảng [YYYY, MM, DD] thành chuỗi YYYY-MM-DD


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

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.error('Form validation failed:', errors);
      return;
    }
    const productData: UpdateProductDto = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      thumbnail: formData.thumbnail,
      productImages: imagePreviews,
      model: formData.model,
      currentPrice: Number(formData.currentPrice) || 0,
      categoryIds: formData.categoryIds,
      brandId: formData.brandId,
      quantity: formData.quantity,
      warrantyExpiryDate: formData.warrantyExpiryDate,
      condition: formData.condition,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    try {
      if (product?.id) {
        const response = await productApi.updateProduct(product.id, productData);
        onUpdateProduct(response);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleFormChange = (field: keyof typeof formData, value: string | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Xóa lỗi nếu dữ liệu hợp lệ
    if (typeof value === 'string' && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else if (typeof value === 'number' && value > 0) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else if (Array.isArray(value) && value.length > 0) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
  const isFormChanged = (): boolean => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };
  const [errors, setErrors] = useState<{
    name?: string;
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    productImages?: string;
    brandId?: string;
    model?: string;
    currentPrice?: string;
    listOfCategories?: string;
    quantity?: string;
    warrantyExpiryDate?: string;
    condition?: string;
    categoryIds?: string;
    tags?: string;
    status?: string;
  }>({});
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Kiểm tra các trường kiểu chuỗi
    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Mô tả ngắn không được để trống';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm không được để trống';
    }
    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Hình ảnh đại diện không được để trống';
    }
    if (!formData.productImages.trim()) {
      newErrors.productImages = 'Hình ảnh sản phẩm không được để trống';
    }
    if (!formData.brandId.trim()) {
      newErrors.brandId = 'Thương hiệu không được để trống';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model không được để trống';
    }
    if (!formData.currentPrice.trim()) {
      newErrors.currentPrice = 'Giá sản phẩm không được để trống';
    }
    if (!formData.warrantyExpiryDate.trim()) {
      newErrors.warrantyExpiryDate = 'Ngày hết hạn bảo hành không được để trống';
    }
    if (!formData.tags.trim()) {
      newErrors.tags = 'Thẻ không được để trống';
    }

    // Kiểm tra các trường kiểu mảng
    if (formData.listOfCategories.length === 0) {
      newErrors.listOfCategories = 'Danh mục không được để trống';
    }
    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'ID danh mục không được để trống';
    }

    // Kiểm tra trường kiểu số
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    // Kiểm tra condition và status (đã cố định trong useState, nên thường không cần kiểm tra thêm)
    if (!formData.condition) {
      newErrors.condition = 'Tình trạng sản phẩm không được để trống';
    }
    if (!formData.status) {
      newErrors.status = 'Trạng thái không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Tên sản phẩm" value={formData.name} onChange={(v) => handleFormChange('name', v)} />
          <InputField label="Giá sản phẩm" type="number" value={formData.currentPrice} onChange={(v) => handleFormChange('currentPrice', v)} />

          <div>
            <Label>Số lượng</Label>
            <Input type="number" value={formData.quantity} onChange={(e) => handleFormChange('quantity', Number(e.target.value))} />
          </div>

          <div>
            <Label>Thương hiệu</Label>
            <SelectBrand
              value={formData.brandId}
              currentBrandId={formData.brandId}
              onChange={(selected) => handleFormChange('brandId', selected)}
            />
          </div>

          <InputField label="Model" value={formData.model} onChange={(v) => handleFormChange('model', v)} />

          <div>
            <Label>Tình trạng sản phẩm</Label>
            <select value={formData.condition} onChange={(e) => handleFormChange('condition', e.target.value)} className="w-full p-2 border rounded">
              <option value="NEW">Mới</option>
              <option value="LIKE_NEW">Như mới</option>
              <option value="USED_GOOD">Đã qua sử dụng - Tốt</option>
              <option value="USED_FAIR">Đã qua sử dụng - Trung bình</option>
              <option value="BROKEN">Hỏng</option>
              <option value="DAMAGED">Hư hại</option>
            </select>
          </div>

          <div>
            <Label>Ngày hết hạn bảo hành</Label>
            <Input type="date" value={formData.warrantyExpiryDate} onChange={(e) => handleFormChange('warrantyExpiryDate', e.target.value)} />
          </div>

          <InputField label="Tags" value={formData.tags} onChange={(v) => handleFormChange('tags', v)} />

          <div className="md:col-span-2">
            <Label>Danh mục</Label>
            <FancyMultiSelect
              value={formData.categoryIds}
              currentCategoryId={formData.listOfCategories}
              onChange={(selected) => handleFormChange('categoryIds', selected)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Mô tả ngắn</Label>
            <Textarea value={formData.shortDescription} onChange={(e) => handleFormChange('shortDescription', e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} />
          </div>

          {/* Thumbnail */}
          <div className="md:col-span-2 flex flex-row items-start">
            <div className="flex flex-col space-y-2">
              <Label>Ảnh đại diện</Label>
              <Button variant="outline" className="flex gap-2 items-center bg-gray-600 text-white hover:bg-gray-500" onClick={handleChooseThumbnail}>
                <ImageIcon className="w-4 h-4" />
                Chọn ảnh
              </Button>
              <Input type="file" accept="image/*" ref={thumbnailInputRef} onChange={handleThumbnailChange} className="hidden" />
            </div>
            <div className="flex-1 flex justify-center ml-8">
              {formData.thumbnail && (
                <div className="relative w-36 h-36">
                  <Image src={formData.thumbnail} alt="Thumbnail" layout="fill" objectFit="cover" className="rounded-lg" />
                  <button type="button" onClick={handleRemoveThumbnail} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
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
              <Button variant="outline" className="flex gap-2 items-center bg-gray-600 text-white hover:bg-gray-500" onClick={handleChooseFiles}>
                <ImageIcon className="w-4 h-4" />
                Chọn ảnh
              </Button>
              <Input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <div className="flex-1 flex flex-wrap gap-4 justify-center ml-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-36 h-36">
                  <Image src={preview} alt={`Preview ${index}`} layout="fill" objectFit="cover" className="rounded-lg" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6" disabled={!isFormChanged()} variant={isFormChanged() ? 'default' : 'secondary'}>
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
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);
