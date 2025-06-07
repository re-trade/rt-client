'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const orderStatusData = [
  { name: 'Đã giao hàng', value: 450, color: '#22c55e' },
  { name: 'Đang giao', value: 120, color: '#3b82f6' },
  { name: 'Đang chuẩn bị', value: 80, color: '#f59e0b' },
  { name: 'Chờ xác nhận', value: 45, color: '#ef4444' },
  { name: 'Đã hủy', value: 25, color: '#6b7280' },
];

const chartConfig = {
  orders: {
    label: 'Đơn hàng',
  },
};

export function OrderStatusChart() {
  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value} đơn (${((Number(value) / total) * 100).toFixed(1)}%)`,
                        name,
                      ]}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="flex-1 space-y-2">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{item.value}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
