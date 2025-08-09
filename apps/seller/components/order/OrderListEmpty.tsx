import { ShoppingBag } from 'lucide-react';

type Props = {
  debouncedSearchTerm: string;
  statusFilter: string;
};

const OrderListEmpty = ({ debouncedSearchTerm, statusFilter }: Props) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Không có đơn hàng</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {debouncedSearchTerm || statusFilter !== 'all'
            ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại.'
            : 'Chưa có đơn hàng nào được tạo.'}
        </p>
      </div>
    </div>
  );
};

export default OrderListEmpty;
