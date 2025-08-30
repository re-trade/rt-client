'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TReportSellerProfile } from '@/services/report.seller.api';
import { ArrowLeft, CheckCircle, Clock, Flag, RefreshCw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReportHeaderProps {
  report: TReportSellerProfile;
  reportId: string;
  processingAction: string | null;
  onRefresh: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function ReportHeader({
  report,
  reportId,
  processingAction,
  onRefresh,
  onAccept,
  onReject,
}: ReportHeaderProps) {
  const router = useRouter();

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Đã xác minh
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Chờ xử lý
          </Badge>
        );
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
            onClick={() => router.push('/dashboard/report-seller')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200/50 shadow-sm">
            <Flag className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Chi tiết tố cáo người bán
              </h1>
              {getStatusBadge(report.resolutionStatus)}
            </div>
            <p className="text-gray-600">
              ID:{' '}
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border">
                {reportId}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onRefresh} size="lg" className="shadow-sm">
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm mới
          </Button>

          {report.resolutionStatus === 'PENDING' && (
            <>
              <Button
                variant="outline"
                onClick={onAccept}
                disabled={processingAction === 'accept'}
                size="lg"
                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 shadow-sm"
              >
                {processingAction === 'accept' ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Xác nhận xử lí
              </Button>

              <Button
                variant="outline"
                onClick={onReject}
                disabled={processingAction === 'reject'}
                size="lg"
                className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm"
              >
                {processingAction === 'reject' ? (
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                Đóng
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
