'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const growthData = [
  { month: 'T1', orders: 180, customers: 150, growth: 12 },
  { month: 'T2', orders: 210, customers: 180, growth: 16.7 },
  { month: 'T3', orders: 245, customers: 220, growth: 16.7 },
  { month: 'T4', orders: 220, customers: 200, growth: -10.2 },
  { month: 'T5', orders: 280, customers: 250, growth: 27.3 },
  { month: 'T6', orders: 310, customers: 280, growth: 10.7 },
  { month: 'T7', orders: 350, customers: 320, growth: 12.9 },
  { month: 'T8', orders: 320, customers: 290, growth: -8.6 },
  { month: 'T9', orders: 380, customers: 340, growth: 18.8 },
  { month: 'T10', orders: 410, customers: 370, growth: 7.9 },
  { month: 'T11', orders: 450, customers: 410, growth: 9.8 },
  { month: 'T12', orders: 480, customers: 440, growth: 6.7 },
];

const chartConfig = {
  orders: {
    label: 'Đơn hàng',
    color: 'hsl(var(--chart-3))',
  },
  customers: {
    label: 'Khách hàng',
    color: 'hsl(var(--chart-4))',
  },
};

export function MonthlyGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tăng trưởng hàng tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      value,
                      name === 'orders' ? 'Đơn hàng' : 'Khách hàng',
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
