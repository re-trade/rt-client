"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Address } from "@/components/ui/dialog/add/create-address-dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: Address | null
  onUpdate: (data: Address) => void
}

export default function EditAddressDialog({ open, onOpenChange, address, onUpdate }: Props) {
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    isDefault: false,
  })

  useEffect(() => {
    if (address) {
      const { id, ...rest } = address
      setFormData(rest)
    }
  }, [address])

  const handleUpdate = () => {
    if (!address) return
    onUpdate({ ...address, ...formData })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết địa chỉ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {["name", "phone", "address", "ward", "district", "city"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{
                field === "name" ? "Họ và tên" :
                field === "phone" ? "Số điện thoại" :
                field === "city" ? "Tỉnh/Thành phố" :
                field
              }</Label>
              <Input
                id={field}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            />
            <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Cập nhật địa chỉ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
