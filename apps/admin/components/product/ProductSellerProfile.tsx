'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TProduct } from '@/services/product.api';
import { TSellerProfile } from '@/services/report.seller.api';
import { Award, Mail, Phone, Store, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductSellerProfileProps {
  product: TProduct;
  sellerProfile: TSellerProfile | null;
  sellerLoading: boolean;
}

export function ProductSellerProfile({
  product,
  sellerProfile,
  sellerLoading,
}: ProductSellerProfileProps) {
  const router = useRouter();

  const handleViewSellerProfile = () => {
    router.push(`/dashboard/seller/${product.sellerId}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-orange-500" />
          Thông tin người bán
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sellerLoading ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ) : sellerProfile ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {sellerProfile.avatarUrl ? (
                <Image
                  src={sellerProfile.avatarUrl}
                  alt={sellerProfile.shopName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6 text-orange-600" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{sellerProfile.shopName}</h4>
                <p className="text-sm text-gray-600">ID: {sellerProfile.id}</p>
                {sellerProfile.verified && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 mt-1"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Đã xác minh
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100">
              {sellerProfile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{sellerProfile.email}</span>
                </div>
              )}
              {sellerProfile.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{sellerProfile.phoneNumber}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleViewSellerProfile}>
              <User className="w-4 h-4 mr-2" />
              Xem hồ sơ đầy đủ
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium">{product.sellerShopName}</p>
                <p className="text-sm text-gray-600">ID: {product.sellerId}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Không thể tải thông tin người bán</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
