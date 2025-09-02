import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TSellerProfile } from '@/services/seller.api';
import { RefreshCw, Store } from 'lucide-react';
import { SellerTableRow } from './SellerTableRow';

interface SellerTableProps {
  sellers: TSellerProfile[];
  filteredSellers: TSellerProfile[];
  loading: boolean;
  page: number;
  maxPage: number;
  totalSellers: number;
  onView: (seller: TSellerProfile) => void;
  onPageChange: (page: number) => void;
  refetch: () => void;
}

export const SellerTable = ({
  sellers,
  filteredSellers,
  loading,
  page,
  maxPage,
  totalSellers,
  onView,
  onPageChange,
  refetch,
}: SellerTableProps) => {
  return (
    <Card className="shadow-sm border-0 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách người bán ({filteredSellers.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Store className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người bán</h3>
            <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc tìm kiếm để xem kết quả</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Cửa hàng</TableHead>
                    <TableHead className="font-semibold text-gray-900">Liên hệ</TableHead>
                    <TableHead className="font-semibold text-gray-900">Địa chỉ</TableHead>
                    <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSellers.map((seller, index) => (
                    <SellerTableRow
                      key={seller.id}
                      seller={seller}
                      index={index}
                      onView={onView}
                      refetch={refetch}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {!loading && sellers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Hiển thị <span className="font-medium">{sellers.length}</span> người bán trên
                    trang <span className="font-medium">{page}</span> /{' '}
                    <span className="font-medium">{maxPage}</span> (Tổng cộng{' '}
                    <span className="font-medium">{totalSellers}</span> người bán)
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-2"
                    >
                      ← Trang trước
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(maxPage - 4, page - 2)) + i;
                        return pageNum <= maxPage ? (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(pageNum)}
                            className={`w-10 h-8 ${
                              page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        ) : null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page + 1)}
                      disabled={page === maxPage}
                      className="flex items-center gap-2"
                    >
                      Trang sau →
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
