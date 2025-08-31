'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TProduct } from '@/services/product.api';
import { Award, Calendar, Clock, Package, Shield } from 'lucide-react';
import Image from 'next/image';

interface ProductInfoCardProps {
  product: TProduct;
}

const productStatusConfig = {
  ACTIVE: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800 border-green-300' },
  INACTIVE: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  DELETED: { label: 'Đã xóa', color: 'bg-red-100 text-red-800 border-red-300' },
  INIT: { label: 'Khởi tạo', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  DRAFT: { label: 'Bản nháp', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  DEFAULT: { label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

const conditionConfig = {
  NEW: { label: 'Mới', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  LIKE_NEW: { label: 'Như mới', color: 'bg-green-100 text-green-800 border-green-300' },
  USED_GOOD: { label: 'Tốt', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  USED_FAIR: { label: 'Khá', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  DAMAGED: { label: 'Hư hại', color: 'bg-red-100 text-red-800 border-red-300' },
  BROKEN: { label: 'Hỏng', color: 'bg-red-100 text-red-800 border-red-300' },
  DEFAULT: { label: 'Khác', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export function ProductInfoCard({ product }: ProductInfoCardProps) {
  const getStatusBadge = (status: string) => {
    const config =
      productStatusConfig[status as keyof typeof productStatusConfig] ||
      productStatusConfig.DEFAULT;
    return (
      <Badge variant="outline" className={config.color}>
        <Package className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const config =
      conditionConfig[condition as keyof typeof conditionConfig] || conditionConfig.DEFAULT;
    return (
      <Badge variant="outline" className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <CardTitle className="text-xl font-bold text-gray-900">{product.name}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(product.status)}
              {getConditionBadge(product.condition)}
              {product.verified ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Award className="h-3 w-3 mr-1" />
                  Đã xác minh
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Chưa xác minh
                </Badge>
              )}
              {product.retraded && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Đã tái bán
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {product.currentPrice.toLocaleString('vi-VN')} VND
            </div>
            <div className="text-sm text-gray-500">Số lượng: {product.quantity}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            {product.thumbnail && (
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border">
                <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
              </div>
            )}
            {product.productImages && product.productImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.productImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-50 rounded overflow-hidden border"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-500" />
                Thông tin sản phẩm
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                {product.model && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{product.model}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tình trạng:</span>
                  {getConditionBadge(product.condition)}
                </div>
                {product.warrantyExpiryDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bảo hành đến:</span>
                    <span className="text-sm">{formatDate(product.warrantyExpiryDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Thông tin thời gian
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="text-sm">{formatDate(product.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cập nhật cuối:</span>
                  <span className="text-sm">{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
