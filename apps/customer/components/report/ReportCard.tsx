'use client';

import { CustomerReportResponse, ReportStatus } from '@services/report.api';
import { IconCalendar, IconEye, IconFileText, IconUser } from '@tabler/icons-react';

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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:border-orange-300 group backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {report.sellerAvatarUrl ? (
              <img
                src={report.sellerAvatarUrl}
                alt={report.sellerName || 'Seller'}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all duration-300"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-orange-200">
                {report.sellerName?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
              {report.sellerName || 'Người bán không xác định'}
            </h3>
            <p className="text-sm text-gray-500 font-mono">ID: {report.id.substring(0, 8)}...</p>
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${getStatusColor(report.resolutionStatus)} transition-all duration-300 group-hover:scale-105`}
        >
          {getStatusText(report.resolutionStatus)}
        </div>
      </div>

      {/* Report Type */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <IconFileText size={20} className="text-orange-600" />
        </div>
        <div>
          <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
            Loại báo cáo
          </span>
          <p className="font-medium text-gray-900">{report.typeReport}</p>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange-400">
          <p className="text-gray-700 leading-relaxed">{truncateContent(report.content)}</p>
        </div>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <IconCalendar size={16} className="text-blue-600" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Ngày tạo
            </span>
            <p className="text-sm font-semibold text-gray-900">{formatDate(report.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <IconUser size={16} className="text-purple-600" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Mã đơn hàng
            </span>
            <p className="text-sm font-semibold text-gray-900 font-mono">
              {report.orderId.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      {/* Resolution Info */}
      {report.resolutionDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-green-800">
              Đã xử lý - {formatDate(report.resolutionDate)}
            </span>
          </div>
          {report.resolutionDetail && (
            <p className="text-sm text-green-700 leading-relaxed">
              {truncateContent(report.resolutionDetail, 100)}
            </p>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onViewDetail}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold group"
        >
          <IconEye size={18} className="group-hover:scale-110 transition-transform duration-200" />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}
