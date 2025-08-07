import { Clock } from 'lucide-react';

interface OrderStatusCardProps {
  statusDisplay: any;
}

export function OrderStatusCard({ statusDisplay }: OrderStatusCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Clock className="w-5 h-5 text-orange-600" />
        </div>
        Trạng thái đơn hàng
      </h2>
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
        <div
          className={`p-3 rounded-full ${statusDisplay.color.replace('border-', 'bg-').replace('text-', 'text-white ').split(' ')[0]} text-white`}
        >
          <statusDisplay.icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{statusDisplay.label}</h3>
          <p className="text-sm text-gray-600">{statusDisplay.description}</p>
        </div>
      </div>
    </div>
  );
}
