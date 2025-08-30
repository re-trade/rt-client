'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TEvidence } from '@/services/report.seller.api';
import { ChevronLeft, ChevronRight, ExternalLink, Package, RefreshCw, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface EvidenceListProps {
  evidence: TEvidence[];
  loading: boolean;
  onRefresh: () => void;
}

const ITEMS_PER_PAGE = 3;

export default function EvidenceList({ evidence, loading, onRefresh }: EvidenceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const totalPages = Math.ceil(evidence.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvidence = evidence.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const getRoleInVietnamese = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'seller':
        return 'Người bán';
      case 'customer':
        return 'Khách hàng';
      case 'admin':
        return 'Quản trị viên';
      default:
        return role || 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-24 w-full rounded" />
                <Skeleton className="h-24 w-full rounded" />
                <Skeleton className="h-24 w-full rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (evidence.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-medium mb-2">Chưa có bằng chứng</h3>
        <p className="text-gray-500 mb-4">Không có bằng chứng nào được gửi cho báo cáo này</p>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {currentEvidence.map((item, index) => (
          <Card
            key={item.id || index}
            className="border border-slate-200 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.senderAvatarUrl &&
                    typeof item.senderAvatarUrl === 'string' &&
                    item.senderAvatarUrl.startsWith('http') ? (
                      <Image
                        src={item.senderAvatarUrl}
                        alt={item.senderName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-avatar.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-[40px] h-[40px] bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{item.senderName || 'N/A'}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getRoleInVietnamese(item.senderRole)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium text-slate-700 mb-2">Ghi chú:</h4>
                  <div className="bg-slate-50 p-3 rounded-lg border">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {item.notes || 'Không có ghi chú'}
                    </p>
                  </div>
                </div>

                {item.evidenceUrls && item.evidenceUrls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3">
                      Tệp bằng chứng ({item.evidenceUrls.length}):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {item.evidenceUrls.map((url, urlIndex) => {
                        const isValidUrl = url && typeof url === 'string' && url.startsWith('http');
                        const isImage =
                          isValidUrl && /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url);

                        return isValidUrl && isImage ? (
                          <div
                            key={urlIndex}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                            onClick={() => handleImageClick(url)}
                          >
                            <Image
                              src={url}
                              alt={`Bằng chứng ${urlIndex + 1}`}
                              width={150}
                              height={120}
                              className="w-full h-[120px] object-cover group-hover:scale-105 transition-transform duration-200"
                              unoptimized={true}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) {
                                  fallback.classList.remove('hidden');
                                }
                              }}
                            />
                            <div className="hidden text-center py-6 text-gray-500 text-xs">
                              Không thể tải ảnh
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                <ExternalLink className="h-4 w-4 text-slate-700" />
                              </div>
                            </div>
                          </div>
                        ) : isValidUrl ? (
                          <a
                            key={urlIndex}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors text-blue-600 hover:text-blue-700"
                          >
                            <div className="text-center">
                              <ExternalLink className="h-6 w-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">Xem tệp</span>
                            </div>
                          </a>
                        ) : (
                          <div
                            key={urlIndex}
                            className="flex items-center justify-center p-4 border border-red-200 rounded-lg bg-red-50 text-red-500 text-sm"
                          >
                            URL không hợp lệ
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, evidence.length)} trong số{' '}
            {evidence.length} bằng chứng
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-8 w-8 p-0 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page
                      ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500'
                      : 'border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-8 w-8 p-0 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleCloseImage}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Bằng chứng phóng to"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              unoptimized={true}
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={handleCloseImage}
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
