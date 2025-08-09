import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, Search, X } from 'lucide-react';

interface ProductListEmptyProps {
  length: number;
  setIsCreateOpen: (isOpen: boolean) => void;
  clearFilters: () => void;
}

const ProductListEmpty = ({ length, setIsCreateOpen, clearFilters }: ProductListEmptyProps) => {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-slate-500 mb-6">
            {length === 0
              ? 'Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên của bạn!'
              : 'Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm khác.'}
          </p>
          {length === 0 ? (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Tạo sản phẩm mới
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductListEmpty;
