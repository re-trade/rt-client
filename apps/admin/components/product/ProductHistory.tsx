'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, RefreshCw, User } from 'lucide-react';
import Image from 'next/image';

type TProductHistory = {
  productId: string;
  productName: string;
  productThumbnail: string;
  productDescription: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
};

interface ProductHistoryProps {
  productHistory: TProductHistory[];
  historyLoading: boolean;
  onRefreshHistory: () => void;
}

export function ProductHistory({
  productHistory,
  historyLoading,
  onRefreshHistory,
}: ProductHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Lịch sử sở hữu
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefreshHistory} disabled={historyLoading}>
            <RefreshCw className={`h-3 w-3 ${historyLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : productHistory.length > 0 ? (
          <div className="space-y-3">
            {productHistory.map((history, index) => (
              <div
                key={history.productId}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50"
              >
                <div className="flex-shrink-0">
                  {history.ownerAvatarUrl ? (
                    <Image
                      src={history.ownerAvatarUrl}
                      alt={history.ownerName}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {history.ownerName}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-xs bg-white/80 border-orange-300 text-orange-700"
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{history.productDescription}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Hiện tại</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Chưa có lịch sử</p>
            <p className="text-xs text-gray-500 mt-1">Sản phẩm chưa có chủ sở hữu trước</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
