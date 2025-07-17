'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { TProduct } from '@/service/product.api';
import {
  Award,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  Info,
  Package,
  Shield,
  Star,
  Tag,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProduct | null;
}

export function ProductDetailsDialog({ open, onOpenChange, product }: ProductDetailsDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Helper function to format date
  const formatDate = (dateInput: number[] | string): string => {
    if (Array.isArray(dateInput) && dateInput.length === 3) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString('vi-VN');
    }
    if (typeof dateInput === 'string') {
      return new Date(dateInput).toLocaleDateString('vi-VN');
    }
    return 'Không xác định';
  };
  

  // Helper function to get condition label
  const getConditionLabel = (condition: string): { label: string; color: string } => {
    const conditions = {
      NEW: { label: 'Mới', color: 'bg-green-100 text-green-800' },
      LIKE_NEW: { label: 'Như mới', color: 'bg-blue-100 text-blue-800' },
      USED_GOOD: { label: 'Đã qua sử dụng - Tốt', color: 'bg-yellow-100 text-yellow-800' },
      USED_FAIR: { label: 'Đã qua sử dụng - Trung bình', color: 'bg-orange-100 text-orange-800' },
      BROKEN: { label: 'Hỏng', color: 'bg-red-100 text-red-800' },
      DAMAGED: { label: 'Hư hại', color: 'bg-red-100 text-red-800' },
    };
    return (
      conditions[condition as keyof typeof conditions] || {
        label: condition,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  // Helper function to get status label
  const getStatusLabel = (status: string): { label: string; color: string } => {
    const statuses = {
      DRAFT: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
      PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
      ACTIVE: { label: 'Đang bán', color: 'bg-green-100 text-green-800' },
      INACTIVE: { label: 'Ngưng bán', color: 'bg-red-100 text-red-800' },
      SOLD: { label: 'Đã bán', color: 'bg-blue-100 text-blue-800' },
    };
    return (
      statuses[status as keyof typeof statuses] || {
        label: status,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const images = product ? [product.thumbnail, ...product.productImages].filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
      setIsImageLoading(true);
    }
  }, [open]);

  if (!product) return null;

  const conditionInfo = getConditionLabel(product.condition);
  const statusInfo = getStatusLabel(product.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Product Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[currentImageIndex]}
                      alt={product.name}
                      fill
                      className="object-cover transition-opacity duration-300"
                      onLoad={() => setIsImageLoading(false)}
                    />
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl"></div>
                    )}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Không có hình ảnh</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Thumbnail Carousel */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Status */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${conditionInfo.color} px-3 py-1 text-sm font-bold`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {conditionInfo.label}
                  </Badge>
                  <Badge className={`${statusInfo.color} px-3 py-1 text-sm font-bold`}>
                    <Info className="w-4 h-4 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  {product.verified && (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-bold">
                      <Award className="w-4 h-4 mr-1" />
                      Đã xác minh
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price and Quantity */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 border border-green-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-black flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Giá bán
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {product.currentPrice?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black flex items-center gap-1 justify-end">
                      <Package className="w-4 h-4" />
                      Số lượng
                    </p>
                    <p className="text-xl font-semibold text-teal-700">{product.quantity}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-black">Đánh giá trung bình:</p>
                  <p className="text-xl font-semibold text-yellow-700">
                    {product.avgVote || 'Chưa có đánh giá'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Detailed Information */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Thông tin sản phẩm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Building2 className="w-4 h-4" />
                    <span className="font-bold">Thương hiệu:</span>
                    <span className="text-gray-800">{product.brand || 'Không xác định'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Hash className="w-4 h-4" />
                    <span className="font-bold">Model:</span>
                    <span className="text-gray-800">{product.model || 'Không xác định'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Wrench className="w-4 h-4" />
                    <span className="font-bold">Bảo hành:</span>
                    <span className="text-gray-800">
                      {product.warrantyExpiryDate || 'Không xác định'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold">Ngày tạo:</span>
                    <span className="text-gray-800">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold">Cập nhật:</span>
                    <span className="text-gray-800">{formatDate(product.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black">
                    <Tag className="w-4 h-4" />
                    <span className="font-bold">Tag:</span>
                    <span className="text-gray-800">{product.tags || 'Không xác định'}</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-start gap-2 text-sm text-black">
                    <Tag className="w-4 h-4 mt-1" />
                    <span className="font-bold mt-[2px] ">Danh mục:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.categories?.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="text-xs bg-gray-50 border-gray-200"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Mô tả sản phẩm
              </h3>
              <div className="space-y-4">
                {product.shortDescription && (
                  <div>
                    <p className="text-sm text-black font-bold mb-2">Mô tả ngắn</p>
                    <p className="text-gray-800 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>
                )}
                {product.description && (
                  <div>
                    <p className="text-sm text-black font-bold mb-2">Mô tả chi tiết</p>
                    <div className="text-gray-800 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </div>
                  </div>
                )}
                {!product.shortDescription && !product.description && (
                  <p className="text-sm text-gray-500 italic">Không có mô tả</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
