import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ProductListSkeleton = () => {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardContent className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <p className="text-slate-500 font-medium">Đang tải sản phẩm...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductListSkeleton;
