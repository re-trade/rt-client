import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SellerReportEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-orange-100 p-3 rounded-full">
        <AlertCircle className="h-8 w-8 text-orange-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Không có báo cáo nào</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        Hiện tại không có báo cáo nào. Các báo cáo sẽ xuất hiện ở đây khi có báo cáo về sản phẩm
        hoặc dịch vụ của bạn.
      </p>
      <Alert className="mt-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700">
          Báo cáo là phản hồi khi có vấn đề với sản phẩm hoặc dịch vụ của bạn. Hãy xử lý các báo cáo
          kịp thời để duy trì uy tín của cửa hàng.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default SellerReportEmpty;
