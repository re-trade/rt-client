import { ShoppingBag } from 'lucide-react';

type Props = {
  debouncedSearchTerm: string;
  statusFilter: string;
};

const OrderListEmpty = ({ debouncedSearchTerm, statusFilter }: Props) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng</h3>
        <p className="text-sm text-gray-500">
          {debouncedSearchTerm || statusFilter !== 'all'
            ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại.'
            : 'Chưa có đơn hàng nào được tạo.'}
        </p>
      </div>
    </div>
  );
};

export default OrderListEmpty;
