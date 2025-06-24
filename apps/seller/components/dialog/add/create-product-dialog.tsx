'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, getAllCategories } from '@/service/categories.api';
import { CreateProductDto, TProduct } from '@/service/product.api';
import { Image as ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProduct: (product: CreateProductDto) => void;
}

export function CreateProductDialog({
  open,
  onOpenChange,
  onCreateProduct,
}: CreateProductDialogProps) {
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

  const handleSubmit = () => {
    const productData: Omit<
      TProduct,
      'id' | 'createdAt' | 'updatedAt' | 'sellerId' | 'sellerShopName' | 'verified'
    > = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      thumbnail: formData.thumbnail,
      productImages: formData.productImages
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean),
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

    onCreateProduct(productData);
    onOpenChange(false);
    setFormData({
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
  };
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
        console.log('Fetched categories:', response);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Process files after user confirms selection (clicks "OK")
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

  const handleRemoveThumbnail = () => {
    if (formData.thumbnail) {
      URL.revokeObjectURL(formData.thumbnail);
      setFormData({ ...formData, thumbnail: '' });
    }
  };

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleChooseThumbnail = () => {
    thumbnailInputRef.current?.click();
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, thumbnail: imageUrl });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="brand">Thương hiệu</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="categoryIds">Danh mục </Label>
            <Input
              id="categoryIds"
              value={formData.categoryIds}
              onChange={(e) => setFormData({ ...formData, categoryIds: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="categoryIds">Danh mục </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Danh mục</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Label htmlFor="discount">Giảm giá (%)</Label>
            <Input id="discount" type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
          </div> */}

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="currentPrice">Giá sản phẩm</Label>
            <Input
              id="currentPrice"
              type="number"
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
            />
          </div>

          {/* <div>
            <Label htmlFor="keywords">Từ khóa </Label>
            <Input id="keywords" value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} />
          </div> */}

          <div>
            <Label htmlFor="tags">Tags </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="shortDescription">Mô tả ngắn</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <div className="md:col-span-2 flex flex-row items-start">
              <div className="flex flex-col items-start space-y-2">
                <Label>Ảnh đại diện</Label>
                <Button
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm font-medium flex items-center gap-2"
                  variant="outline"
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
                      onClick={() => handleRemoveThumbnail()}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
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
                  className=" bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm font-medium flex items-center gap-2"
                  variant="outline"
                  onClick={handleChooseFiles}
                >
                  <ImageIcon className="w-4 h-4" />
                  Chọn ảnh
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
              <div className="flex-1 flex justify-center ml-4">
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-36 h-35">
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
                )}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full mt-6">
          Tạo sản phẩm
        </Button>
      </DialogContent>
    </Dialog>
  );
}
