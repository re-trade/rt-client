import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { formatDateTime } from '@/lib/utils';
import { SellerReportResponse } from '@/service/report.api';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface Props {
  reports: SellerReportResponse[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  loading: boolean;
  getStatusColor(data: string): string;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

export function ReportSellerTable({
  reports,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  loading,
  handlePageChange,
  getStatusColor,
  handlePageSizeChange,
}: Props) {
  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/dashboard/report/${report.id}`}
            className="block transition-all hover:shadow-md"
          >
            <Card className="border border-gray-200 hover:border-orange-300">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getStatusColor(
                          report.resolutionStatus,
                        )} capitalize font-medium`}
                      >
                        {report.resolutionStatus.toLowerCase()}
                      </Badge>
                      <Badge variant="outline" className="font-medium">
                        {report.typeReport}
                      </Badge>
                    </div>
                    <h3 className="mt-2 font-bold text-lg line-clamp-1">
                      Báo cáo về sản phẩm #{report.productId}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Đơn hàng: #{report.orderId}</p>
                    <p className="text-gray-700 mt-2 line-clamp-2">{report.content}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1 text-sm text-gray-500">
                    <span>Tạo: {formatDateTime(report.createdAt)}</span>
                    {report.resolutionDate && (
                      <span>Xử lý: {formatDateTime(report.resolutionDate)}</span>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <ShieldAlert className="h-6 w-6 text-orange-500" />
                      <span>Báo cáo đơn hàng</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {reports.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            pageSizeOptions={[10, 20, 50]}
            loading={loading}
            className="mt-4"
          />
        </div>
      )}
    </>
  );
}
