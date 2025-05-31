"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Search, Store, AlertTriangle, Star, TrendingUp, Lock, Unlock, Eye, Edit, AlertCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data - replace with actual API call
const shops = [
  {
    id: "1",
    name: "Shop Thời Trang ABC",
    owner: "Nguyễn Văn A",
    phone: "0123456789",
    email: "shop1@example.com",
    status: "active",
    createdAt: "2024-01-15",
    totalProducts: 150,
    totalOrders: 500,
    totalRevenue: 50000000,
    rating: 4.8,
    violations: 0,
  },
  {
    id: "2",
    name: "Shop Điện Tử XYZ",
    owner: "Trần Thị B",
    phone: "0987654321",
    email: "shop2@example.com",
    status: "pending",
    createdAt: "2024-03-01",
    totalProducts: 80,
    totalOrders: 200,
    totalRevenue: 30000000,
    rating: 4.5,
    violations: 1,
  },
  {
    id: "3",
    name: "Shop Mỹ Phẩm 123",
    owner: "Lê Văn C",
    phone: "0369852147",
    email: "shop3@example.com",
    status: "suspended",
    createdAt: "2023-12-01",
    totalProducts: 200,
    totalOrders: 1000,
    totalRevenue: 100000000,
    rating: 4.2,
    violations: 3,
  },
]

// Sample chart data
const performanceData = {
  "1": [
    { name: "T1", revenue: 10000000, orders: 100, rating: 4.5 },
    { name: "T2", revenue: 15000000, orders: 150, rating: 4.6 },
    { name: "T3", revenue: 25000000, orders: 200, rating: 4.8 },
  ],
}

const statusLabels = {
  active: "Đang hoạt động",
  pending: "Chờ duyệt",
  suspended: "Đã khóa",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
}

const statuses = ["Tất cả", "active", "pending", "suspended"]
const timeRanges = ["Hôm nay", "Tuần này", "Tháng này", "Năm nay"]

export default function ShopManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState("Tất cả")
  const [selectedTimeRange, setSelectedTimeRange] = useState("Hôm nay")
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const itemsPerPage = 10

  // Filter shops based on search query and filters
  const filteredShops = shops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "Tất cả" || shop.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShops = filteredShops.slice(startIndex, endIndex)

  // Calculate statistics
  const totalShops = shops.length
  const activeShops = shops.filter((shop) => shop.status === "active").length
  const pendingShops = shops.filter((shop) => shop.status === "pending").length
  const suspendedShops = shops.filter((shop) => shop.status === "suspended").length
  const totalRevenue = shops.reduce((sum, shop) => sum + shop.totalRevenue, 0)

  const handleToggleStatus = (shopId: string, currentStatus: string) => {
    // TODO: Implement API call to toggle shop status
    console.log(`Toggle status for shop ${shopId}, current status: ${currentStatus}`)
  }

  const handleViewDetails = (shopId: string) => {
    setSelectedShop(shopId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý cửa hàng</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số cửa hàng</p>
              <h2 className="text-2xl font-bold">{totalShops}</h2>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cửa hàng đang hoạt động</p>
              <h2 className="text-2xl font-bold">{activeShops}</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cửa hàng chờ duyệt</p>
              <h2 className="text-2xl font-bold">{pendingShops}</h2>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cửa hàng bị khóa</p>
              <h2 className="text-2xl font-bold">{suspendedShops}</h2>
            </div>
            <Lock className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Shops Table */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm cửa hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Tất cả" ? status : statusLabels[status as keyof typeof statusLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên cửa hàng</TableHead>
                <TableHead>Chủ cửa hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentShops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.owner}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{shop.phone}</div>
                      <div className="text-sm text-muted-foreground">{shop.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[shop.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[shop.status as keyof typeof statusLabels]}
                    </span>
                  </TableCell>
                  <TableCell>{shop.totalProducts}</TableCell>
                  <TableCell>{shop.totalOrders}</TableCell>
                  <TableCell>{shop.totalRevenue.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{shop.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(shop.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(shop.id, shop.status)}
                      >
                        {shop.status === "suspended" ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                      {shop.violations > 0 && (
                        <Button variant="ghost" size="icon">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1} đến {Math.min(endIndex, filteredShops.length)} trong tổng số{" "}
            {filteredShops.length} cửa hàng
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>

      {/* Shop Details Dialog */}
      {selectedShop && (
        <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết cửa hàng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết và hiệu suất hoạt động của cửa hàng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              {/* Shop Information */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên cửa hàng</p>
                    <p>{shops.find((s) => s.id === selectedShop)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chủ cửa hàng</p>
                    <p>{shops.find((s) => s.id === selectedShop)?.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                    <p>{shops.find((s) => s.id === selectedShop)?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{shops.find((s) => s.id === selectedShop)?.email}</p>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Hiệu suất hoạt động</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData[selectedShop as keyof typeof performanceData]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") return [`${value.toLocaleString('vi-VN')}đ`, "Doanh thu"]
                          if (name === "orders") return [value, "Đơn hàng"]
                          if (name === "rating") return [value, "Đánh giá"]
                          return [value, name]
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        name="Doanh thu"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        name="Đơn hàng"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rating"
                        stroke="#ffc658"
                        name="Đánh giá"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedShop(null)}>
                  Đóng
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleToggleStatus(selectedShop, "active")}
                >
                  Khóa cửa hàng
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 