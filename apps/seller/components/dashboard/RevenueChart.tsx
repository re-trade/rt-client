'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSellerRevenue } from '@/hooks/use-seller-revenue';
import { BarChart3 } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
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
      <span className="ml-3 text-gray-700 font-medium">Đang tải dữ liệu...</span>
    </div>
  );
};

export default function RevenueChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const {
    chartData,
    availableYears,
    formattedTotalRevenue,
    highestMonth,
    formattedAverageMonthlyRevenue,
    isLoading,
    setYear,
  } = useSellerRevenue(selectedYear);

  const handleYearChange = (year: string) => {
    setSelectedYear(Number(year));
    setYear(Number(year));
  };

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden h-full bg-white">
      <CardHeader className="border-b-2 border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Doanh thu
          </CardTitle>
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[80px] bg-white text-gray-900 border border-gray-200 text-sm">
              <SelectValue placeholder={selectedYear.toString()} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Tổng doanh thu {selectedYear}</p>
                <p className="text-xl font-bold text-gray-800">{formattedTotalRevenue}</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Tháng cao nhất</p>
                <p className="text-xl font-bold text-gray-800">
                  {highestMonth
                    ? `${highestMonth.monthName}: ${highestMonth.formattedTotal}`
                    : 'Không có dữ liệu'}
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Trung bình/tháng</p>
                <p className="text-xl font-bold text-gray-800">{formattedAverageMonthlyRevenue}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="monthName"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
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
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Doanh thu"
                  stroke="#2563eb"
                  fillOpacity={0.5}
                  fill="url(#colorRevenue)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
