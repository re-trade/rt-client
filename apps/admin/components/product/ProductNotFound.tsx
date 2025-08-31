'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProductNotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-gray-700 font-medium mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-500 mb-4">Sản phẩm không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    </div>
  );
}
