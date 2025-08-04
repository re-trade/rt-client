"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOrderManager } from "@/hooks/use-order-manager"
import type { TOrder } from "@/types/order"
import {
  AlertCircle,
  Ban,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Loader,
  Package,
  RefreshCw,
  RotateCcw,
  Search,
  Truck,
  Undo2,
  XCircle,
  ShoppingCart,
  User,
  Hash,
} from "lucide-react"
import { useState } from "react"

const OrderStats = ({ orders }: { orders: TOrder[] }) => {
  const completedOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "COMPLETED")).length
  const pendingOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "PENDING")).length
  const paymentConfirmationOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "PAYMENT_CONFIRMATION"),
  ).length
  const paymentFailedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "PAYMENT_FAILED"),
  ).length
  const paymentCancelledOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "PAYMENT_CANCELLED"),
  ).length
  const unpaidOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "UNPAID")).length
  const preparingOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "PREPARING")).length
  const deliveringOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "DELIVERING")).length
  const deliveredOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "DELIVERED")).length
  const cancelledOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "CANCELLED")).length
  const returnRequestedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "RETURN_REQUESTED"),
  ).length
  const returnApprovedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "RETURN_APPROVED"),
  ).length
  const returnRejectedOrders = orders.filter((o) =>
    o.orderCombos.some((combo) => combo.status === "RETURN_REJECTED"),
  ).length
  const returningOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "RETURNING")).length
  const returnedOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "RETURNED")).length
  const refundedOrders = orders.filter((o) => o.orderCombos.some((combo) => combo.status === "REFUNDED")).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số đơn hàng</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chờ xử lý</p>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã xác nhận thanh toán</p>
            <p className="text-2xl font-bold">{paymentConfirmationOrders}</p>
          </div>
          <CreditCard className="h-8 w-8 text-indigo-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Thanh toán thất bại</p>
            <p className="text-2xl font-bold">{paymentFailedOrders}</p>
          </div>
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chưa thanh toán</p>
            <p className="text-2xl font-bold">{unpaidOrders}</p>
          </div>
          <DollarSign className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chuẩn bị</p>
            <p className="text-2xl font-bold">{preparingOrders}</p>
          </div>
          <Loader className="h-8 w-8 text-cyan-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang giao hàng</p>
            <p className="text-2xl font-bold">{deliveringOrders}</p>
          </div>
          <Truck className="h-8 w-8 text-amber-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã giao hàng</p>
            <p className="text-2xl font-bold">{deliveredOrders}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-lime-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hoàn tất</p>
            <p className="text-2xl font-bold">{completedOrders}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã huỷ</p>
            <p className="text-2xl font-bold">{cancelledOrders}</p>
          </div>
          <Ban className="h-8 w-8 text-red-600" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Yêu cầu hoàn trả</p>
            <p className="text-2xl font-bold">{returnRequestedOrders}</p>
          </div>
          <Undo2 className="h-8 w-8 text-pink-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã chấp nhận trả</p>
            <p className="text-2xl font-bold">{returnApprovedOrders}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Từ chối trả</p>
            <p className="text-2xl font-bold">{returnRejectedOrders}</p>
          </div>
          <XCircle className="h-8 w-8 text-rose-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang hoàn trả</p>
            <p className="text-2xl font-bold">{returningOrders}</p>
          </div>
          <RotateCcw className="h-8 w-8 text-sky-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã hoàn trả</p>
            <p className="text-2xl font-bold">{returnedOrders}</p>
          </div>
          <RotateCcw className="h-8 w-8 text-violet-500" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã hoàn tiền</p>
            <p className="text-2xl font-bold">{refundedOrders}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </Card>
    </div>
  )
}

const AdvancedFilters = ({
  searchQuery,
  onSearch,
  selectedCategory,
  setSelectedCategory,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  updatedAfter,
  setUpdatedAfter,
}: {
  searchQuery: string
  onSearch: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortField: string
  setSortField: (field: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  updatedAfter: string
  setUpdatedAfter: (date: string) => void
}) => {
  const handleClearFilters = () => {
    onSearch("")
    setSelectedCategory("all")
    setSortField("orderId")
    setSortOrder("asc")
    setUpdatedAfter("")
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Bộ lọc nâng cao</h3>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          <XCircle className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger>
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orderId">ID</SelectItem>
            <SelectItem value="customerId">ID Khách hàng</SelectItem>
            <SelectItem value="customerName">Tên Khách hàng</SelectItem>
            <SelectItem value="phone">Số điện thoại</SelectItem>
            <SelectItem value="status">Tình trạng</SelectItem>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Thứ tự" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Tăng dần</SelectItem>
            <SelectItem value="desc">Giảm dần</SelectItem>
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <Input id="updatedAfter" type="date" value={updatedAfter} onChange={(e) => setUpdatedAfter(e.target.value)} />
        </div>
      </div>
    </Card>
  )
}

const OrderDetailModal = ({
  order,
  isOpen,
  onClose,
  onVerify,
}: {
  order: TOrder | null
  isOpen: boolean
  onClose: () => void
  onVerify?: (id: string) => void
}) => {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin đơn hàng
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về đơn hàng</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p className="max-w-[150px] truncate overflow-hidden whitespace-nowrap">{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID khách hàng</p>
                <p>{order.customerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên khách hàng</p>
                <p>{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{order.destination.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p>{new Date(order.updatedAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
        {order.status === "PENDING" && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="text-green-600 border-green-600 bg-transparent"
              onClick={() => onVerify && onVerify(order.orderId)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Hủy đơn hàng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("orderId")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [updatedAfter, setUpdatedAfter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<{
    [orderId: string]: { combos: boolean; items: boolean }
  }>({})

  const {
    orders = [],
    page,
    maxPage,
    totalOrders,
    loading,
    error,
    refetch,
    goToPage,
    searchOrders,
    cancelOrder,
  } = useOrderManager()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    searchOrders(query)
    goToPage(1, query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    goToPage(1, searchQuery)
  }

  const handleSortFieldChange = (field: string) => {
    setSortField(field)
    setCurrentPage(1)
    goToPage(1, searchQuery)
  }

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order)
    setCurrentPage(1)
    goToPage(1, searchQuery)
  }

  const handleUpdatedAfterChange = (date: string) => {
    setUpdatedAfter(date)
    setCurrentPage(1)
    goToPage(1, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    goToPage(newPage, searchQuery)
  }

  const handleCancel = async (orderId: string) => {
    const result = await cancelOrder(orderId)
    if (result.success) {
      setDeleteSuccess("Hủy đơn hàng thành công!")
    } else {
      setDeleteError(result.message || "Lỗi hủy đơn hàng")
    }
  }

  const handleView = (order: TOrder) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
        setExpandedSections((prevSections) => {
          const newSections = { ...prevSections }
          delete newSections[orderId]
          return newSections
        })
      } else {
        newSet.add(orderId)
        setExpandedSections((prevSections) => ({
          ...prevSections,
          [orderId]: { combos: false, items: false },
        }))
      }
      return newSet
    })
  }

  const toggleSection = (orderId: string, section: "combos" | "items") => {
    setExpandedSections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [section]: !prev[orderId]?.[section],
      },
    }))
  }

  const sortedOrders = [...orders].sort((a: TOrder, b: TOrder) => {
    let valueA: any
    let valueB: any
    switch (sortField) {
      case "orderId":
        valueA = a.orderId.toLowerCase()
        valueB = b.orderId.toLowerCase()
        break
      case "customerId":
        valueA = a.customerId.toLowerCase()
        valueB = b.customerId.toLowerCase()
        break
      case "customerName":
        valueA = a.customerName.toLowerCase()
        valueB = b.customerName.toLowerCase()
        break
      case "phone":
        valueA = a.destination.phone.toLowerCase()
        valueB = b.destination.phone.toLowerCase()
        break
      case "grandTotal":
        valueA = a.grandTotal
        valueB = b.grandTotal
        break
      case "status":
        valueA = a.orderCombos[0]?.status?.toLowerCase() || ""
        valueB = b.orderCombos[0]?.status?.toLowerCase() || ""
        break
      case "createdAt":
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      case "updatedAt":
        valueA = new Date(a.updatedAt).getTime()
        valueB = new Date(b.updatedAt).getTime()
        break
      default:
        return 0
    }
    if (valueA === valueB) return 0
    if (!valueA) return 1
    if (!valueB) return -1
    return sortOrder === "asc" ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1
  })

  const filteredOrders = sortedOrders.filter((order: TOrder) => {
    const matchesCategory =
      selectedCategory === "all" ||
      order.orderCombos.some((combo) => combo.status.toLowerCase().includes(selectedCategory.toLowerCase()))
    const orderLastUpdate = new Date(order.updatedAt)
    const matchesLastUpdate = !updatedAfter || orderLastUpdate >= new Date(updatedAfter)
    return matchesCategory && matchesLastUpdate
  })

  const getStatusColor = (status?: string): string => {
    switch (status ?? "PENDING") {
      case "PENDING":
        return "bg-gray-100 text-gray-800"
      case "PAYMENT_CONFIRMATION":
      case "PREPARING":
      case "DELIVERING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
      case "RETURNED":
      case "REFUNDED":
        return "bg-green-100 text-green-800"
      case "PAYMENT_FAILED":
      case "CANCELLED":
      case "RETURN_REJECTED":
        return "bg-red-100 text-red-800"
      case "DELIVERED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status ?? "PENDING") {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "PAYMENT_CONFIRMATION":
        return <CreditCard className="h-4 w-4" />
      case "PREPARING":
        return <Loader className="h-4 w-4" />
      case "DELIVERING":
        return <Truck className="h-4 w-4" />
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <Ban className="h-4 w-4" />
      case "PAYMENT_FAILED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {deleteSuccess && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Thành công:</span> {deleteSuccess}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteSuccess(null)
              }}
              className="text-green-600 hover:text-green-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {(error || deleteError) && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Lỗi:</span> {error || deleteError}
              {(error || deleteError)?.includes("đăng nhập") && (
                <div className="mt-2 text-sm">
                  <p>Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao tác này.</p>
                  <p className="mt-1 text-xs text-red-600">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3 giây.
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteError(null)
              }}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <OrderStats orders={orders} />

      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        sortField={sortField}
        setSortField={handleSortFieldChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortOrderChange}
        updatedAfter={updatedAfter}
        setUpdatedAfter={handleUpdatedAfterChange}
      />

      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải ...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>Không tìm thấy đơn hàng</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>ID khách hàng</TableHead>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Ngày cập nhật cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: TOrder) => (
                  <>
                    <TableRow key={order.orderId}>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleExpandOrder(order.orderId)}>
                          {expandedOrders.has(order.orderId) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                        {order.orderId}
                      </TableCell>
                      <TableCell className="font-medium">{order.customerId}</TableCell>
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                        {order.destination.phone}
                      </TableCell>
                      <TableCell className="font-medium">{order.status ?? "Pending"}</TableCell>
                      <TableCell className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleView(order)}>
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedOrders.has(order.orderId) && (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <div className="p-6 bg-muted/30 rounded-lg space-y-6">
                            {/* Order Combos Section */}
                            <div>
                              <div className="flex items-center mb-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSection(order.orderId, "combos")}
                                  className="mr-2 p-0"
                                >
                                  {expandedSections[order.orderId]?.combos ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                                <Package className="h-5 w-5 mr-2 text-blue-600" />
                                <h4 className="font-semibold text-lg">Danh sách Order Combos</h4>
                                <Badge variant="secondary" className="ml-2">
                                  {order.orderCombos.length} combo(s)
                                </Badge>
                              </div>

                              {expandedSections[order.orderId]?.combos && (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {order.orderCombos.map((combo) => (
                                    <Card key={combo.comboId} className="border-l-4 border-l-blue-500">
                                      <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Hash className="h-4 w-4" />
                                            {combo.comboId}
                                          </CardTitle>
                                          <Badge className={`${getStatusColor(combo.status)} flex items-center gap-1`}>
                                            {getStatusIcon(combo.status)}
                                            {combo.status}
                                          </Badge>
                                        </div>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <p className="text-muted-foreground flex items-center gap-1">
                                              <User className="h-3 w-3" />
                                              Seller ID
                                            </p>
                                            <p className="font-medium truncate">{combo.sellerId}</p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">Tên Seller</p>
                                            <p className="font-medium truncate">{combo.sellerName}</p>
                                          </div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                                              <DollarSign className="h-3 w-3" />
                                              Số tiền
                                            </p>
                                            <p className="font-bold text-lg text-green-600">
                                              {combo.grandPrice?.toLocaleString("vi-VN")} ₫
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-muted-foreground text-sm">Items</p>
                                            <Badge variant="outline">{combo.itemIds.length} sản phẩm</Badge>
                                          </div>
                                        </div>

                                        {combo.itemIds.length > 0 && (
                                          <div>
                                            <p className="text-muted-foreground text-xs mb-1">Item IDs:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {combo.itemIds.slice(0, 3).map((itemId, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                  {itemId}
                                                </Badge>
                                              ))}
                                              {combo.itemIds.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                  +{combo.itemIds.length - 3} more
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Order Items Section */}
                            <div>
                              <div className="flex items-center mb-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSection(order.orderId, "items")}
                                  className="mr-2 p-0"
                                >
                                  {expandedSections[order.orderId]?.items ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                                <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                                <h4 className="font-semibold text-lg">Danh sách Items</h4>
                                <Badge variant="secondary" className="ml-2">
                                  {order.items.length} item(s)
                                </Badge>
                              </div>

                              {expandedSections[order.orderId]?.items && (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {order.items.map((item) => (
                                    <Card
                                      key={item.productId}
                                      className="border-l-4 border-l-green-500 overflow-hidden"
                                    >
                                      <CardContent className="p-0">
                                        {/* Product Image and Basic Info */}
                                        <div className="flex p-4 pb-3">
                                          <div className="flex-shrink-0 mr-4">
                                            <img
                                              src={item.productThumbnail || "/placeholder.svg"}
                                              alt={item.productName}
                                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                              onError={(e) => {
                                                e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                                              }}
                                            />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
                                              {item.productName}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mb-1">ID: {item.productId}</p>
                                            <div className="flex items-center gap-1">
                                              <User className="h-3 w-3 text-muted-foreground" />
                                              <p className="text-xs text-muted-foreground truncate">
                                                {item.sellerName}
                                              </p>
                                            </div>
                                          </div>
                                        </div>

                                        <Separator />

                                        {/* Pricing and Quantity Info */}
                                        <div className="p-4 pt-3">
                                          <div className="grid grid-cols-3 gap-3 text-center">
                                            <div>
                                              <p className="text-xs text-muted-foreground mb-1">Số lượng</p>
                                              <div className="flex items-center justify-center">
                                                <Badge
                                                  variant="outline"
                                                  className="text-blue-600 border-blue-200 bg-blue-50"
                                                >
                                                  {item.quantity}
                                                </Badge>
                                              </div>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground mb-1">Đơn giá</p>
                                              <p className="font-medium text-sm">
                                                {item.unitPrice?.toLocaleString("vi-VN")} ₫
                                              </p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground mb-1">Tổng tiền</p>
                                              <p className="font-bold text-sm text-green-600">
                                                {item.totalPrice?.toLocaleString("vi-VN")} ₫
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && orders.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredOrders.length} đơn hàng trên trang {page} / {maxPage} (Tổng cộng {totalOrders} đơn hàng)
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page} / {maxPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === maxPage}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedOrder(null)
        }}
        onVerify={async (id: string) => {
          const result = await cancelOrder(id)
          if (result.success) setDeleteSuccess("Hủy đơn hàng thành công!")
          else setDeleteError(result.message || "Lỗi hủy đơn hàng")
          setIsDetailModalOpen(false)
          setSelectedOrder(null)
          refetch()
        }}
      />
    </div>
  )
}
