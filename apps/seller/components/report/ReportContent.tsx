import { CardContent } from '@/components/ui/card';
import { type OrderResponse } from '@/service/orders.api';
import { type SellerReportResponse } from '@/service/report.api';
import { OrderDetails } from './OrderDetails';

interface ReportContentProps {
  report: SellerReportResponse;
  orderDetails: OrderResponse | null;
  orderLoading: boolean;
}

export function ReportContent({ report, orderDetails, orderLoading }: ReportContentProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Nội dung báo cáo:</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
            {report.content}
          </div>
        </div>

        {report.resolutionDetail && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin xử lý:</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-gray-800">
              {report.resolutionDetail}
            </div>
          </div>
        )}

        {/* Order Details Section */}
        <OrderDetails orderDetails={orderDetails} orderLoading={orderLoading} />
      </div>
    </CardContent>
  );
}
