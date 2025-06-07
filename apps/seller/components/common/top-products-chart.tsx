"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const topProductsData = [
  { name: "Áo thun nam", sales: 145, revenue: 43500000 },
  { name: "Quần jeans", sales: 132, revenue: 79200000 },
  { name: "Giày sneaker", sales: 98, revenue: 88200000 },
  { name: "Váy maxi", sales: 87, revenue: 39150000 },
  { name: "Áo khoác", sales: 76, revenue: 45600000 },
  { name: "Túi xách", sales: 65, revenue: 32500000 },
]

const chartConfig = {
  sales: {
    label: "Số lượng bán",
    color: "hsl(var(--chart-2))",
  },
}

export function TopProductsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} layout="horizontal">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value, name) => [`${value} sản phẩm`, "Đã bán"]} />}
              />
              <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
