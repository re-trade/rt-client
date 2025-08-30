import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TProductHistory } from '@/service/product-history.api';
import { History, User } from 'lucide-react';
import Image from 'next/image';

interface ProductHistoryListProps {
  history: TProductHistory[];
  loading?: boolean;
}

const HistorySkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-orange-100 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-lg border border-orange-100 p-6 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
      <History className="w-8 h-8 text-orange-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-800 mb-1">Chưa có lịch sử sở hữu</h3>
    <p className="text-gray-500 text-sm max-w-md mx-auto">
      Sản phẩm này chưa có thông tin về những người đã từng sở hữu.
    </p>
  </div>
);

export function ProductHistoryList({ history, loading = false }: ProductHistoryListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-orange-100 shadow-sm">
        <div className="p-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium text-gray-800">Lịch sử sở hữu</h2>
          </div>
        </div>
        <div className="p-4">
          <HistorySkeleton />
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-orange-100 shadow-sm">
        <div className="p-4 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium text-gray-800">Lịch sử sở hữu</h2>
          </div>
        </div>
        <div className="p-4">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-orange-100 shadow-sm">
      <div className="p-4 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-medium text-gray-800">
            Lịch sử sở hữu ({history.length} chủ sở hữu)
          </h2>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={`${item.ownerId}-${index}`}
              className="bg-white rounded-lg border border-orange-100 p-4 hover:border-orange-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-orange-100">
                  <Image
                    src={item.productThumbnail || '/placeholder.jpg'}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">{item.productName}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.productDescription}</p>

                  <div className="flex items-center mt-3 gap-2">
                    <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-orange-100">
                      <Image
                        src={item.ownerAvatarUrl || '/user-placeholder.jpg'}
                        alt={item.ownerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      <User className="w-3 h-3 mr-1" />
                      {item.ownerName}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
