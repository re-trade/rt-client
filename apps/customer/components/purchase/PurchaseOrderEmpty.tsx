import { ShoppingBag } from 'lucide-react';

interface Props {
  searchTerm: string;
  statusFilter: string;
}

const PurchaseOrderEmpty = ({ searchTerm, statusFilter }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 border border-orange-200 text-center">
      <div className="mx-auto w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-orange-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
      </h3>
      <p className="text-gray-600">
        {searchTerm || statusFilter !== 'all'
          ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
          : 'Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên'}
      </p>
    </div>
  );
};

export default PurchaseOrderEmpty;
