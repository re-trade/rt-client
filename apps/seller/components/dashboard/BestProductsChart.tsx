'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSellerBestProducts } from '@/hooks/use-seller-best-products';
import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CustomTooltip from './CustomToolTip';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 absolute top-0 left-0"
          style={{ animationDirection: 'reverse', opacity: 0.7, animationDuration: '1.5s' }}
        ></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
    </div>
  );
};

export default function BestProductsChart() {
  const { chartData, bestProductsByQuantity, formattedTotalRevenue, totalQuantitySold, isLoading } =
    useSellerBestProducts();

  return (
    <Card className="bg-white shadow-lg border-0 overflow-hidden h-full">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
                <p className="text-xl font-bold text-purple-700">{formattedTotalRevenue}</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Số lượng đã bán</p>
                <p className="text-xl font-bold text-pink-700">{totalQuantitySold}</p>
              </div>
            </div>

            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                <TabsTrigger value="quantity">Số lượng</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => {
                          return value.length > 10 ? value.substring(0, 10) + '...' : value;
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                      />
                      <Tooltip content={CustomTooltip} />
                      <Bar dataKey="revenue" name="Doanh thu">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Không có dữ liệu sản phẩm</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quantity">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => {
                          return value.length > 10 ? value.substring(0, 10) + '...' : value;
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis stroke="#6b7280" axisLine={false} tickLine={false} width={30} />
                      <Tooltip content={CustomTooltip} />
                      <Bar dataKey="quantitySold" name="Số lượng bán">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Không có dữ liệu sản phẩm</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Top 5 sản phẩm bán chạy</h3>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                {bestProductsByQuantity.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.quantitySold} đã bán</p>
                    </div>
                    <p className="font-medium text-sm text-purple-700">
                      {product.formattedRevenue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
