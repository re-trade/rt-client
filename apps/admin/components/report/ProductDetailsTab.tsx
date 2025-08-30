'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TProduct } from '@/services/report.seller.api';
import { ExternalLink, Package, ShoppingBag, Star, Tag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductDetailsTabProps {
  product: TProduct | null;
  formatDate: (dateString?: string) => string;
}

export default function ProductDetailsTab({ product, formatDate }: ProductDetailsTabProps) {
  const router = useRouter();

  if (!product) {
    return (
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
          <CardTitle className="text-lg text-slate-900">Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium mb-2">Không có thông tin sản phẩm</h3>
            <p className="text-gray-500">Sản phẩm không tồn tại hoặc đã bị xóa khỏi hệ thống</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
        <CardTitle className="text-lg text-slate-900">Thông tin sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="relative aspect-square rounded-md border overflow-hidden">
              {product.thumbnail &&
              typeof product.thumbnail === 'string' &&
              product.thumbnail.startsWith('http') ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          <div className="md:w-2/3">
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {product.condition || 'N/A'}
              </Badge>
              {product.verified && (
                <Badge className="bg-green-50 text-green-700 border-green-200">Đã xác minh</Badge>
              )}
            </div>

            <div className="text-2xl font-bold text-orange-600 mb-4">
              {product.currentPrice.toLocaleString('vi-VN')}đ
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Mô tả ngắn:</p>
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">ID Sản phẩm:</p>
                  <p className="font-mono bg-gray-50 p-2 rounded border break-all">{product.id}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Thương hiệu:</p>
                  <p>{product.brand || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Model:</p>
                  <p>{product.model || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Số lượng:</p>
                  <p>{product.quantity} sản phẩm</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Đánh giá:</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{product.avgVote.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Ngày tạo:</p>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Danh mục:</p>
              <div className="flex flex-wrap gap-2">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((category) => (
                    <Badge key={category.id} variant="outline" className="bg-gray-50">
                      <Tag className="h-3 w-3 mr-1" />
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">Không có danh mục</span>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() => router.push(`/dashboard/product/${product.id}`)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem chi tiết sản phẩm
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-medium text-gray-700 mb-4">Mô tả chi tiết:</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>

        {product.productImages && product.productImages.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-4">Hình ảnh sản phẩm:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.productImages.map((img, i) => {
                const isValidUrl = img && typeof img === 'string' && img.startsWith('http');
                return (
                  isValidUrl && (
                    <div
                      key={i}
                      className="relative aspect-square rounded-md border overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Ảnh ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
