"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { OrderTable } from "@/components/dialog/view-update/order-table" 
import { OrderDetailDialog } from "@/components/dialog/add/order-detail-dialog"
import { UpdateStatusDialog } from "@/components/dialog/view-update/update-status-dialog"

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  shippingAddress: string
  items: OrderItem[]
  totalAmount: number
  shippingFee: number
  discount: number
  finalAmount: number
  paymentMethod: "cod" | "bank_transfer" | "e_wallet"
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "pending" | "confirmed" | "preparing" | "ready_to_ship" | "shipped" | "delivered" | "cancelled"
  shippingMethod: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0123456789",
    customerEmail: "nguyenvana@email.com",
    shippingAddress: "123 Đường ABC, Phường 1, Quận 1, TP.HCM",
    items: [
      {
        id: "1",
        productName: "Áo thun nam",
        quantity: 2,
        price: 299000,
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "2",
        productName: "Quần jeans",
        quantity: 1,
        price: 599000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    totalAmount: 1197000,
    shippingFee: 30000,
    discount: 50000,
    finalAmount: 1177000,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "confirmed",
    shippingMethod: "Giao hàng tiêu chuẩn",
    notes: "Giao hàng giờ hành chính",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    customerEmail: "tranthib@email.com",
    shippingAddress: "456 Đường XYZ, Phường 2, Quận 2, TP.HCM",
    items: [
      {
        id: "3",
        productName: "Váy maxi",
        quantity: 1,
        price: 450000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    totalAmount: 450000,
    shippingFee: 30000,
    discount: 0,
    finalAmount: 480000,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    orderStatus: "preparing",
    shippingMethod: "Giao hàng nhanh",
    trackingNumber: "VN123456789",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Lê Văn C",
    customerPhone: "0369852147",
    customerEmail: "levanc@email.com",
    shippingAddress: "789 Đường DEF, Phường 3, Quận 3, TP.HCM",
    items: [
      {
        id: "4",
        productName: "Giày sneaker",
        quantity: 1,
        price: 899000,
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    totalAmount: 899000,
    shippingFee: 50000,
    discount: 100000,
    finalAmount: 849000,
    paymentMethod: "e_wallet",
    paymentStatus: "paid",
    orderStatus: "shipped",
    shippingMethod: "Giao hàng hỏa tốc",
    trackingNumber: "VN987654321",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setIsUpdateStatusOpen(true)
  }

  const handleStatusUpdate = (
    orderId: string,
    newStatus: Order["orderStatus"],
    trackingNumber?: string,
    notes?: string,
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              orderStatus: newStatus,
              trackingNumber: trackingNumber || order.trackingNumber,
              notes: notes || order.notes,
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    )
    setSelectedOrder(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
        <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trạng thái đơn hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
            <SelectItem value="ready_to_ship">Sẵn sàng giao</SelectItem>
            <SelectItem value="shipped">Đã giao shipper</SelectItem>
            <SelectItem value="delivered">Đã giao hàng</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Trạng thái thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thanh toán</SelectItem>
            <SelectItem value="pending">Chờ thanh toán</SelectItem>
            <SelectItem value="paid">Đã thanh toán</SelectItem>
            <SelectItem value="failed">Thanh toán thất bại</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrderTable orders={filteredOrders} onViewDetail={handleViewDetail} onUpdateStatus={handleUpdateStatus} />

      <OrderDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} order={selectedOrder} />

      <UpdateStatusDialog
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        order={selectedOrder}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  )
}
