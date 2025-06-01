"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit } from "lucide-react"
import ShippingMethodCreateDialog from "@/components/ui/dialog/add/create-shipping-dialog"
import ShippingMethodEditDialog from "@/components/ui/dialog/view-update/edit-shipping-dialog"

interface ShippingMethod {
  id: string
  name: string
  description: string
  basePrice: number
  freeShippingThreshold?: number
  estimatedDays: string
  isActive: boolean
}

const mockShippingMethods: ShippingMethod[] = [
  {
    id: "1",
    name: "Giao hàng tiêu chuẩn",
    description: "Giao hàng trong 3-5 ngày làm việc",
    basePrice: 30000,
    freeShippingThreshold: 500000,
    estimatedDays: "3-5 ngày",
    isActive: true,
  },
  {
    id: "2",
    name: "Giao hàng nhanh",
    description: "Giao hàng trong 1-2 ngày làm việc",
    basePrice: 50000,
    freeShippingThreshold: 1000000,
    estimatedDays: "1-2 ngày",
    isActive: true,
  },
  {
    id: "3",
    name: "Giao hàng hỏa tốc",
    description: "Giao hàng trong ngày",
    basePrice: 100000,
    estimatedDays: "Trong ngày",
    isActive: false,
  },
]

export default function ShippingManagement() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(mockShippingMethods)
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    freeShippingThreshold: "",
    estimatedDays: "",
    isActive: true,
  })

  const handleCreate = () => {
    const newMethod: ShippingMethod = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      freeShippingThreshold: formData.freeShippingThreshold ? Number(formData.freeShippingThreshold) : undefined,
      estimatedDays: formData.estimatedDays,
      isActive: formData.isActive,
    }
    setShippingMethods([...shippingMethods, newMethod])
    resetForm()
    setIsCreateOpen(false)
  }

  const handleUpdate = () => {
    if (!selectedMethod) return

    const updatedMethods = shippingMethods.map((method) =>
      method.id === selectedMethod.id
        ? {
          ...method,
          name: formData.name,
          description: formData.description,
          basePrice: Number(formData.basePrice),
          freeShippingThreshold: formData.freeShippingThreshold ? Number(formData.freeShippingThreshold) : undefined,
          estimatedDays: formData.estimatedDays,
          isActive: formData.isActive,
        }
        : method,
    )
    setShippingMethods(updatedMethods)
    setIsDetailOpen(false)
    setSelectedMethod(null)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      freeShippingThreshold: "",
      estimatedDays: "",
      isActive: true,
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const openDetailDialog = (method: ShippingMethod) => {
    setSelectedMethod(method)
    setFormData({
      name: method.name,
      description: method.description,
      basePrice: method.basePrice.toString(),
      freeShippingThreshold: method.freeShippingThreshold?.toString() || "",
      estimatedDays: method.estimatedDays,
      isActive: method.isActive,
    })
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Phương thức vận chuyển</h2>
          <p className="text-muted-foreground">Quản lý các phương thức giao hàng</p>
        </div>
        <ShippingMethodCreateDialog
          onCreate={(newData) => {
            const newMethod = { ...newData, id: Date.now().toString() }
            setShippingMethods([...shippingMethods, newMethod])
          }}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phương thức</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Phí vận chuyển</TableHead>
                <TableHead>Miễn phí từ</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell>{method.basePrice.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>
                    {method.freeShippingThreshold
                      ? `${method.freeShippingThreshold.toLocaleString("vi-VN")}đ`
                      : "Không có"}
                  </TableCell>
                  <TableCell>{method.estimatedDays}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${method.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {method.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openDetailDialog(method)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết phương thức vận chuyển</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Tên phương thức</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-basePrice">Phí vận chuyển (đ)</Label>
              <Input
                id="edit-basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-freeShippingThreshold">Miễn phí từ (đ)</Label>
              <Input
                id="edit-freeShippingThreshold"
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
                placeholder="Để trống nếu không có"
              />
            </div>
            <div>
              <Label htmlFor="edit-estimatedDays">Thời gian giao hàng</Label>
              <Input
                id="edit-estimatedDays"
                value={formData.estimatedDays}
                onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Kích hoạt</Label>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Cập nhật phương thức
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
