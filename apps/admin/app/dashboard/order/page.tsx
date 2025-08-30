'use client';

import OrderHeader from '@/components/order/OrderHeader';
import OrderPagination from '@/components/order/OrderPagination';
import OrderSearchBar from '@/components/order/OrderSearchBar';
import OrderStatsCards from '@/components/order/OrderStatsCards';
import OrderTable from '@/components/order/OrderTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderComboManager } from '@/hooks/use-order-manager';
import { TOrderCombo } from '@/services/order.api';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrderManagementPage() {
  const router = useRouter();
  const {
    orderCombos,
    page,
    maxPage,
    totalOrders,
    loading,
    error,
    refetch,
    goToPage,
    searchOrders,
  } = useOrderComboManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchOrders(searchQuery.trim());
    } else {
      refetch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    refetch();
  };

  const handleRowClick = (combo: TOrderCombo) => {
    router.push(`/dashboard/order/${combo.comboId}`);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <OrderHeader totalOrders={totalOrders} onRefresh={refetch} />

      <OrderStatsCards orderCombos={orderCombos || []} />

      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-slate-200/50 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold text-slate-900">Danh sách đơn hàng</CardTitle>

            <OrderSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              onClearSearch={clearSearch}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <OrderTable
            orderCombos={orderCombos || []}
            loading={loading}
            onRowClick={handleRowClick}
            searchQuery={searchQuery}
          />

          <OrderPagination
            page={page}
            maxPage={maxPage}
            totalOrders={totalOrders}
            onPageChange={goToPage}
            searchQuery={searchQuery}
          />
        </CardContent>
      </Card>
    </div>
  );
}
