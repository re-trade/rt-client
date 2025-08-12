import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { type SellerReportResponse } from '@/service/report.api';

interface ReportHeaderProps {
  report: SellerReportResponse;
  getStatusColor: (status: string) => string;
}

export function ReportHeader({ report, getStatusColor }: ReportHeaderProps) {
  return (
    <CardHeader>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getStatusColor(report.resolutionStatus)} capitalize font-medium`}>
              {report.resolutionStatus.toLowerCase()}
            </Badge>
            <Badge variant="outline" className="font-medium">
              {report.typeReport}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">
            Báo cáo về sản phẩm #{report.productId}
          </CardTitle>
          <CardDescription className="mt-1">
            Đơn hàng: #{report.orderId} • Tạo lúc: {formatDateTime(report.createdAt)}
          </CardDescription>
        </div>

        <div className="flex flex-col items-start md:items-end text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Người báo cáo:</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-avatar.png" alt="Customer" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <span className="font-medium">Khách hàng #{report.customerId.slice(0, 8)}</span>
            </div>
          </div>

          {report.resolutionDate && (
            <span className="text-gray-500 mt-1">
              Ngày xử lý: {formatDateTime(report.resolutionDate)}
            </span>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
