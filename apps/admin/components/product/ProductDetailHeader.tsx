'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductDetailHeaderProps {
  productId: string;
  loading: boolean;
  onRefresh: () => void;
}

export function ProductDetailHeader({ productId, loading, onRefresh }: ProductDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="h-10 w-10 rounded-xl border-gray-300 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-orange-600">Chi tiết sản phẩm</h1>
          <p className="text-gray-600">#{productId}</p>
        </div>
      </div>
    </div>
  );
}
