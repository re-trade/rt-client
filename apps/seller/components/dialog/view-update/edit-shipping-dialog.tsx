"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"

interface ShippingMethod {
  id: string
  name: string
  description: string
  basePrice: number
  freeShippingThreshold?: number
  estimatedDays: string
  isActive: boolean
}

interface ShippingMethodEditDialogProps {
  method: ShippingMethod | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedMethod: ShippingMethod) => void
}

export default function ShippingMethodEditDialog({ method, open, onOpenChange, onUpdate }: ShippingMethodEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    freeShippingThreshold: "",
    estimatedDays: "",
    isActive: true,
  })

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        description: method.description,
        basePrice: method.basePrice.toString(),
        freeShippingThreshold: method.freeShippingThreshold?.toString() || "",
        estimatedDays: method.estimatedDays,
        isActive: method.isActive,
      })
    }
  }, [method])

  const handleUpdate = () => {
    if (!method) return
    onUpdate({
      ...method,
      name: formData.name,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      freeShippingThreshold: formData.freeShippingThreshold
        ? Number(formData.freeShippingThreshold)
        : undefined,
      estimatedDays: formData.estimatedDays,
      isActive: formData.isActive,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết phương thức vận chuyển</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tên phương thức</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <Label>Phí vận chuyển (đ)</Label>
            <Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} />
          </div>
          <div>
            <Label>Miễn phí từ (đ)</Label>
            <Input type="number" value={formData.freeShippingThreshold} onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })} />
          </div>
          <div>
            <Label>Thời gian giao hàng</Label>
            <Input value={formData.estimatedDays} onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            <Label>Kích hoạt</Label>
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Cập nhật phương thức
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
