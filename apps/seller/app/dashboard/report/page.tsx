'use client';

import SellerReportEmpty from '@/components/report/ReportSellerEmpty';
import { ReportSellerTable } from '@/components/report/ReportSellerTable';
import SellerReportSkeleton from '@/components/report/SellerReportSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReportsList } from '@/hooks/use-reports-list';
import { Filter, Search } from 'lucide-react';

export default function ReportPage() {
  const {
    reports,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    inputQuery,
    setInputQuery,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    getStatusColor,
  } = useReportsList();

  return (
    <div className="space-y-6 bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-orange-600">
              Báo cáo từ khách hàng
            </CardTitle>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Tìm kiếm báo cáo..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Lọc</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SellerReportSkeleton />
          ) : reports.length === 0 ? (
            <SellerReportEmpty />
          ) : (
            <ReportSellerTable
              reports={reports}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              loading={loading}
              handlePageChange={handlePageChange}
              getStatusColor={getStatusColor}
              handlePageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
