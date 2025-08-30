'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TReportSellerProfile } from '@/services/report.seller.api';
import Image from 'next/image';

interface ReportDetailsTabProps {
  report: TReportSellerProfile;
}

export default function ReportDetailsTab({ report }: ReportDetailsTabProps) {
  return (
    <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-slate-200/50 bg-slate-50/50">
        <CardTitle className="text-lg text-slate-900">Nội dung tố cáo</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-700 whitespace-pre-wrap">{report.content}</p>

        {report.image && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Ảnh bằng chứng:</p>
            <div className="relative group overflow-hidden rounded-md border border-gray-200">
              <Image
                src={report.image}
                alt="Bằng chứng báo cáo"
                width={600}
                height={400}
                className="max-w-full object-contain"
                unoptimized={true}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                  }
                }}
              />
              <div className="hidden text-center py-4 text-gray-500">
                Không thể tải ảnh bằng chứng
              </div>
            </div>
          </div>
        )}

        {report.resolutionDetail && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Chi tiết xử lý:</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <p className="text-gray-700 whitespace-pre-wrap">{report.resolutionDetail}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
