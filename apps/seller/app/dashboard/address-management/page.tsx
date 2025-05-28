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

interface Address {
  id: string
  name: string
  phone: string
  address: string
  ward: string
  district: string
  city: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: true,
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0987654321",
    address: "456 Đường XYZ",
    ward: "Phường 2",
    district: "Quận 2",
    city: "TP. Hồ Chí Minh",
    isDefault: false,
  },
]

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    isDefault: false,
  })

  const handleCreate = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      ward: formData.ward,
      district: formData.district,
      city: formData.city,
      isDefault: formData.isDefault,
    }

    // If this is set as default, remove default from others
    let updatedAddresses = addresses
    if (formData.isDefault) {
      updatedAddresses = addresses.map((addr) => ({ ...addr, isDefault: false }))
    }

    setAddresses([...updatedAddresses, newAddress])
    resetForm()
    setIsCreateOpen(false)
  }

  const handleUpdate = () => {
    if (!selectedAddress) return

    let updatedAddresses = addresses.map((address) =>
      address.id === selectedAddress.id
        ? {
            ...address,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            ward: formData.ward,
            district: formData.district,
            city: formData.city,
            isDefault: formData.isDefault,
          }
        : address,
    )

    // If this is set as default, remove default from others
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === selectedAddress.id ? addr : { ...addr, isDefault: false },
      )
    }

    setAddresses(updatedAddresses)
    setIsDetailOpen(false)
    setSelectedAddress(null)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      isDefault: false,
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const openDetailDialog = (address: Address) => {
    setSelectedAddress(address)
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      ward: address.ward,
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    })
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quản lý địa chỉ</h2>
          <p className="text-muted-foreground">Quản lý địa chỉ lấy hàng và giao hàng</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ cụ thể</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, tên đường"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
              </div>
              <Button onClick={handleCreate} className="w-full">
                Thêm địa chỉ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên & SĐT</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Phường/Xã</TableHead>
                <TableHead>Quận/Huyện</TableHead>
                <TableHead>Tỉnh/TP</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-muted-foreground">{address.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{address.address}</TableCell>
                  <TableCell>{address.ward}</TableCell>
                  <TableCell>{address.district}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>
                    {address.isDefault && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Mặc định</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openDetailDialog(address)}>
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
            <DialogTitle>Chi tiết địa chỉ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Họ và tên</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Địa chỉ cụ thể</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-ward">Phường/Xã</Label>
                <Input
                  id="edit-ward"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-district">Quận/Huyện</Label>
                <Input
                  id="edit-district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-city">Tỉnh/Thành phố</Label>
              <Input
                id="edit-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
              />
              <Label htmlFor="edit-isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Cập nhật địa chỉ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
