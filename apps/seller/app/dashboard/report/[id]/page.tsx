'use client';

import { EvidenceList } from '@/components/report/EvidenceList';
import { ReportContent } from '@/components/report/ReportContent';
import { ReportHeader } from '@/components/report/ReportHeader';
import { StatusAlert } from '@/components/report/StatusAlert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReportDetail } from '@/hooks/use-report-detail';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    // State
    report,
    orderDetails,
    evidences,
    loading,
    orderLoading,
    evidenceLoading,
    note,
    images,
    imageUrls,
    submitting,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    // Setters
    setNote,

    // Actions
    handleImageUpload,
    removeImage,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,

    // Helpers
    getStatusColor,
    getSenderRoleStyle,
    formatCreatedDate,
  } = useReportDetail({ id });

  return (
    <div className="space-y-6 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1 text-gray-500 hover:text-orange-600"
        >
          <Link href="/dashboard/report">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>

      {loading ? (
        <ReportDetailSkeleton />
      ) : !report ? (
        <EmptyState />
      ) : (
        <>
          <Card className="border border-gray-200">
            <ReportHeader report={report} getStatusColor={getStatusColor} />
            <ReportContent
              report={report}
              orderDetails={orderDetails}
              orderLoading={orderLoading}
            />
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-orange-600">
                Bằng chứng và phản hồi
              </CardTitle>
              <CardDescription>
                Xem lịch sử bằng chứng và gửi phản hồi của bạn để giải quyết báo cáo
              </CardDescription>
            </CardHeader>
            <EvidenceList
              evidences={evidences}
              evidenceLoading={evidenceLoading}
              reportResolutionStatus={report.resolutionStatus}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
              note={note}
              setNote={setNote}
              images={images}
              imageUrls={imageUrls}
              submitting={submitting}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleSubmit={handleSubmit}
              getSenderRoleStyle={getSenderRoleStyle}
            />
          </Card>

          <StatusAlert status={report.resolutionStatus} resolutionDate={report.resolutionDate} />
        </>
      )}
    </div>
  );
}

function ReportDetailSkeleton() {
  return (
    <>
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div className="flex flex-col items-start md:items-end">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36 mt-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-orange-100 p-3 rounded-full">
        <AlertCircle className="h-8 w-8 text-orange-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Không tìm thấy báo cáo</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        Báo cáo này không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/report">Quay lại danh sách báo cáo</Link>
      </Button>
    </div>
  );
}
