'use client';

import { IconCalendar, IconEye, IconFileText, IconUser } from '@tabler/icons-react';
import { CustomerReportResponse, ReportStatus } from '../../services/report.api';

interface ReportCardProps {
  report: CustomerReportResponse;
  onViewDetail: () => void;
  getStatusColor: (status: ReportStatus) => string;
  getStatusText: (status: ReportStatus) => string;
}

export default function ReportCard({
  report,
  onViewDetail,
  getStatusColor,
  getStatusText,
}: ReportCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-orange-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          {report.sellerAvatarUrl && (
            <img
              src={report.sellerAvatarUrl}
              alt={report.sellerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{report.sellerName}</h3>
            <p className="text-sm text-gray-600">Mã: {report.id.substring(0, 8)}...</p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.resolutionStatus)}`}
        >
          {getStatusText(report.resolutionStatus)}
        </div>
      </div>

      {/* Report Type */}
      <div className="flex items-center gap-2 mb-3">
        <IconFileText size={16} className="text-orange-500" />
        <span className="text-sm font-medium text-gray-700">{report.typeReport}</span>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">{truncateContent(report.content)}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <IconCalendar size={16} className="text-gray-400" />
          <span className="text-gray-600">Tạo: {formatDate(report.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <IconUser size={16} className="text-gray-400" />
          <span className="text-gray-600">Đơn: {report.orderId}</span>
        </div>
      </div>

      {/* Resolution Info */}
      {report.resolutionDate && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Xử lý:</span> {formatDate(report.resolutionDate)}
          </p>
          {report.resolutionDetail && (
            <p className="text-sm text-gray-700 mt-1">
              {truncateContent(report.resolutionDetail, 100)}
            </p>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onViewDetail}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
        >
          <IconEye size={16} />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}
