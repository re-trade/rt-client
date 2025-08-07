import { Calendar, Package, Receipt } from 'lucide-react';

interface OrderStatsGridProps {
  totalItems: number;
  totalValue: number;
  createDate: string | null | undefined;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
}

export function OrderStatsGrid({
  totalItems,
  totalValue,
  createDate,
  formatPrice,
  formatDate,
}: OrderStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Receipt className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng giá trị</p>
            <p className="text-xl font-bold text-gray-800">{formatPrice(totalValue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Ngày đặt</p>
            <p className="text-sm font-bold text-gray-800">
              {createDate ? formatDate(createDate) : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
