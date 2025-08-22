'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getDashboardRevenue,
  getProductStatsByStatus,
  type ProductStatusChartData,
} from '@/services/dashboard.api';
import { BarChart3, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey?: string }>;
  label?: string | number;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

type RevenueData = {
  month: string;
  value: number;
};

const getMonthName = (monthNum: string): string => {
  return `Tháng ${monthNum}`;
};

function AdminRevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardRevenue(selectedYear);
        const formattedData = data.map((item) => ({
          month: getMonthName(item.month),
          value: item.total,
        }));
        setRevenueData(formattedData);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Không thể tải dữ liệu doanh thu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedYear]);

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);

  // Find highest revenue month
  const highestMonth =
    revenueData.length > 0
      ? revenueData.reduce(
          (max, item) => (max && max.value > item.value ? max : item),
          revenueData[0],
        )
      : null;

  // Calculate average monthly revenue
  const avgRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('vi-VN')} đ`;
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden h-full bg-white">
      <CardHeader className="border-b-2 border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Doanh thu
          </CardTitle>
          <select
            className="text-sm border border-gray-200 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Tổng doanh thu {selectedYear}</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Tháng cao nhất</p>
                <p className="text-xl font-bold text-gray-800">
                  {highestMonth
                    ? `${highestMonth.month}: ${formatCurrency(highestMonth.value)}`
                    : 'N/A'}
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Trung bình tháng</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(avgRevenue)}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  tickFormatter={(value) => (value > 0 ? `${(value / 1000000).toFixed(1)}M` : '0')}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip content={(props: TooltipProps<number, string>) => CustomTooltip(props)} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
                  stroke="#2563eb"
                  fillOpacity={0.5}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AdminProductChart() {
  const [productData, setProductData] = useState<ProductStatusChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const total = productData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProductStatsByStatus();
        setProductData(data);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Không thể tải dữ liệu sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden h-full bg-white">
      <CardHeader className="border-b-2 border-gray-200">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Package className="h-5 w-5 text-blue-600" />
          Trạng thái sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80">
            <p className="text-red-500">{error}</p>
          </div>
        ) : productData.length === 0 ? (
          <div className="flex justify-center items-center h-80">
            <p>Không có dữ liệu sản phẩm</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={1}
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => CustomTooltip(props)}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg mb-3 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">Tổng sản phẩm</p>
                    <p className="text-xl font-bold text-gray-800">{total}</p>
                  </div>
                </div>
              </div>

              {productData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-700">{item.value}</span>
                    {total > 0 && (
                      <span className="text-xs text-gray-500">
                        ({Math.round((item.value / total) * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { AdminProductChart, AdminRevenueChart };
