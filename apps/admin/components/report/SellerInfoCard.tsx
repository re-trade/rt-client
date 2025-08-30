'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TSellerProfile } from '@/services/report.seller.api';
import { Star, Store } from 'lucide-react';
import Image from 'next/image';

interface SellerInfoCardProps {
  seller: TSellerProfile | null;
}

export default function SellerInfoCard({ seller }: SellerInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
        <CardTitle className="flex items-center text-lg text-slate-900">
          <Store className="h-5 w-5 mr-2 text-blue-500" />
          Thông tin người bán
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {seller ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {seller.avatarUrl &&
              typeof seller.avatarUrl === 'string' &&
              seller.avatarUrl.startsWith('http') ? (
                <Image
                  src={seller.avatarUrl}
                  alt={seller.shopName}
                  width={50}
                  height={50}
                  className="rounded-full border object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6 text-gray-500" />
                </div>
              )}

              <div>
                <h3 className="font-medium">{seller.shopName}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                  {seller.avgVote.toFixed(1)}
                  {seller.verified && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs"
                    >
                      Đã xác minh
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">ID Người bán</dt>
                <dd className="font-mono bg-gray-50 p-2 rounded border break-all">{seller.id}</dd>
              </div>

              <div>
                <dt className="text-gray-500 mb-1">Email</dt>
                <dd>{seller.email}</dd>
              </div>

              <div>
                <dt className="text-gray-500 mb-1">Số điện thoại</dt>
                <dd>{seller.phoneNumber || 'N/A'}</dd>
              </div>

              <div>
                <dt className="text-gray-500 mb-1">Địa chỉ</dt>
                <dd>
                  {seller.addressLine && `${seller.addressLine}, `}
                  {seller.ward && `${seller.ward}, `}
                  {seller.district && `${seller.district}, `}
                  {seller.state || 'N/A'}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500 mb-1">Ngày tham gia</dt>
                <dd>{formatDate(seller.createdAt)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="text-center py-6">
            <Store className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Không có thông tin người bán</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
