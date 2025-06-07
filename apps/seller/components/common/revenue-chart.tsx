"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const revenueData = [
  { month: "T1", revenue: 25000000, orders: 180 },
  { month: "T2", revenue: 28000000, orders: 210 },
  { month: "T3", revenue: 32000000, orders: 245 },
  { month: "T4", revenue: 29000000, orders: 220 },
  { month: "T5", revenue: 35000000, orders: 280 },
  { month: "T6", revenue: 38000000, orders: 310 },
  { month: "T7", revenue: 42000000, orders: 350 },
  { month: "T8", revenue: 39000000, orders: 320 },
  { month: "T9", revenue: 45000000, orders: 380 },
  { month: "T10", revenue: 48000000, orders: 410 },
  { month: "T11", revenue: 52000000, orders: 450 },
  { month: "T12", revenue: 55000000, orders: 480 },
]

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [`${(Number(value) / 1000000).toFixed(1)}M đ`, "Doanh thu"]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
