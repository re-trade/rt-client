'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useReportDetail } from '@/hooks/use-report-detail';
import { formatDateTime } from '@/lib/utils';
import { AlertCircle, ArrowLeft, Image as ImageIcon, Send } from 'lucide-react';
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
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={`${getStatusColor(report.resolutionStatus)} capitalize font-medium`}
                    >
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
                      <span className="font-medium">
                        Khách hàng #{report.customerId.slice(0, 8)}
                      </span>
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
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nội dung báo cáo:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                    {report.content}
                  </div>
                </div>

                {report.resolutionDetail && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Thông tin xử lý:</h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-gray-800">
                      {report.resolutionDetail}
                    </div>
                  </div>
                )}

                {/* Order Details Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Chi tiết đơn hàng:</h3>
                  {orderLoading ? (
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                      <span className="ml-2 text-sm text-gray-500">
                        Đang tải thông tin đơn hàng...
                      </span>
                    </div>
                  ) : !orderDetails ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
                      Không tìm thấy thông tin đơn hàng
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-3">
                        <div>
                          <p className="font-medium">Mã đơn: #{orderDetails.comboId}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Ngày tạo: {formatDateTime(orderDetails.createDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${
                              orderDetails.orderStatus.code === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : orderDetails.orderStatus.code === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {orderDetails.orderStatus.name}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            Thanh toán:{' '}
                            {orderDetails.paymentStatus === 'PAID'
                              ? 'Đã thanh toán'
                              : 'Chưa thanh toán'}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-2">Sản phẩm trong đơn:</h4>
                        <div className="space-y-2">
                          {orderDetails.items.map((item, index) => (
                            <div
                              key={item.itemId}
                              className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100"
                            >
                              <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                <img
                                  src={item.itemThumbnail || '/placeholder-product.png'}
                                  alt={item.itemName}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-product.png';
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm line-clamp-1">{item.itemName}</p>
                                <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-orange-600">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                  }).format((item.basePrice - item.discount) * item.quantity)}
                                </p>
                                {item.discount > 0 && (
                                  <p className="text-xs text-gray-500 line-through">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                    }).format(item.basePrice * item.quantity)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <div>
                          <h4 className="text-sm font-medium">Thông tin giao hàng:</h4>
                          <p className="text-sm mt-1">
                            {orderDetails.destination.addressLine}, {orderDetails.destination.ward},{' '}
                            {orderDetails.destination.district}, {orderDetails.destination.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng giá trị:</p>
                          <p className="text-lg font-bold text-orange-600">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(orderDetails.grandPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
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
            <CardContent>
              {evidenceLoading ? (
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
              ) : evidences.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Chưa có bằng chứng</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    Chưa có bằng chứng nào được cung cấp. Hãy gửi bằng chứng và giải trình của bạn
                    bên dưới để hỗ trợ việc giải quyết báo cáo này.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {evidences.map((evidence) => (
                      <div
                        key={evidence.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                          <Avatar>
                            <AvatarImage
                              src={evidence.senderAvatarUrl || '/placeholder-avatar.png'}
                            />
                            <AvatarFallback>{evidence.senderName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {evidence.senderRole === 'CUSTOMER'
                                  ? `Khách hàng #${evidence.senderId.slice(0, 8)}`
                                  : evidence.senderName}
                              </span>
                              <Badge
                                className={`${getSenderRoleStyle(evidence.senderRole)} text-xs`}
                              >
                                {evidence.senderRole === 'CUSTOMER'
                                  ? 'Khách hàng'
                                  : evidence.senderRole === 'SELLER'
                                    ? 'Người bán'
                                    : 'Admin'}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDateTime(evidence.createdAt || '')}
                            </div>
                          </div>
                        </div>

                        {/* Note section */}
                        {evidence.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                              Nội dung giải trình:
                            </h4>
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                              <p className="text-gray-800 whitespace-pre-wrap">{evidence.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Evidence images section */}
                        {evidence.evidenceUrls && evidence.evidenceUrls.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                              Hình ảnh bằng chứng ({evidence.evidenceUrls.length}):
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                              {evidence.evidenceUrls.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block relative group"
                                >
                                  <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                    <img
                                      src={url}
                                      alt={`Bằng chứng ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-image.png';
                                      }}
                                    />
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 truncate">
                                    Hình ảnh {index + 1}
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination for evidences */}
                  {totalPages > 1 && (
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
                        loading={evidenceLoading}
                        className="mt-4"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Reply Form */}
              {report.resolutionStatus.toLowerCase() !== 'resolved' && (
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Gửi phản hồi của bạn</h3>

                  <div className="space-y-4">
                    <label
                      htmlFor="evidence-note"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nội dung giải trình của bạn:
                    </label>
                    <Textarea
                      id="evidence-note"
                      placeholder="Nhập thông tin giải trình và phản hồi của bạn..."
                      className="min-h-[120px]"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />

                    {imageUrls.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Hình ảnh đính kèm ({imageUrls.length}/5):
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 truncate">
                                Hình ảnh {index + 1}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={images.length >= 5 || submitting}
                        className="gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        {images.length === 0 ? 'Thêm hình ảnh' : `Hình ảnh (${images.length}/5)`}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={images.length >= 5}
                      />

                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="ml-auto gap-2 bg-orange-600 hover:bg-orange-700"
                        disabled={submitting || (!note.trim() && images.length === 0)}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Gửi phản hồi
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-4">
                      <p className="text-xs text-blue-700">
                        <strong>Hướng dẫn:</strong> Bạn có thể đính kèm tối đa 5 hình ảnh làm bằng
                        chứng. Vui lòng cung cấp đầy đủ thông tin giải trình và tham chiếu đến thông
                        tin đơn hàng nếu cần để hỗ trợ việc xử lý báo cáo nhanh chóng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {report.resolutionStatus.toLowerCase() === 'pending' && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-800" />
              <AlertDescription className="text-yellow-800">
                Báo cáo này đang chờ xử lý. Vui lòng cung cấp bằng chứng và giải trình của bạn để hỗ
                trợ việc giải quyết báo cáo.
              </AlertDescription>
            </Alert>
          )}

          {report.resolutionStatus.toLowerCase() === 'resolved' && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Báo cáo này đã được giải quyết vào ngày{' '}
                {formatDateTime(report.resolutionDate || '')}.
              </AlertDescription>
            </Alert>
          )}
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
