'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TReportSellerProfile } from '@/services/report.seller.api';
import { Calendar, CheckCircle, Clock, Flag, XCircle } from 'lucide-react';

interface ReportInfoCardProps {
  report: TReportSellerProfile;
}

export default function ReportInfoCard({ report }: ReportInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
        <CardTitle className="flex items-center text-lg text-slate-900">
          <Flag className="h-5 w-5 mr-2 text-orange-500" />
          Thông tin báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-gray-500 mb-1">Thời gian báo cáo</dt>
            <dd className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {formatDate(report.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-gray-500 mb-1">ID Khách hàng báo cáo</dt>
            <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
              {report.customerId || 'N/A'}
            </dd>
          </div>

          <div>
            <dt className="text-gray-500 mb-1">Loại báo cáo</dt>
            <dd>
              <Badge variant="secondary" className="font-normal">
                {report.typeReport || 'N/A'}
              </Badge>
            </dd>
          </div>

          <div>
            <dt className="text-gray-500 mb-1">Trạng thái xử lý</dt>
            <dd>{getStatusBadge(report.resolutionStatus)}</dd>
          </div>

          {report.resolutionDate && (
            <div>
              <dt className="text-gray-500 mb-1">Thời gian xử lý</dt>
              <dd className="font-medium">{formatDate(report.resolutionDate)}</dd>
            </div>
          )}

          {report.adminId && (
            <div>
              <dt className="text-gray-500 mb-1">ID Admin xử lý</dt>
              <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
                {report.adminId}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-gray-500 mb-1">ID Đơn hàng</dt>
            <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
              {report.orderId || 'N/A'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
