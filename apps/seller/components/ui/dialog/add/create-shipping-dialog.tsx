"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import { useState } from "react"

interface ShippingMethodCreateDialogProps {
  onCreate: (data: {
    name: string
    description: string
    basePrice: number
    freeShippingThreshold?: number
    estimatedDays: string
    isActive: boolean
  }) => void
}

export default function ShippingMethodCreateDialog({ onCreate }: ShippingMethodCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    freeShippingThreshold: "",
    estimatedDays: "",
    isActive: true,
  })

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

  const handleSubmit = () => {
    onCreate({
      name: formData.name,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      freeShippingThreshold: formData.freeShippingThreshold
        ? Number(formData.freeShippingThreshold)
        : undefined,
      estimatedDays: formData.estimatedDays,
      isActive: formData.isActive,
    })
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phương thức
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm phương thức vận chuyển</DialogTitle>
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
            <Input type="number" value={formData.freeShippingThreshold} onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })} placeholder="Để trống nếu không có" />
          </div>
          <div>
            <Label>Thời gian giao hàng</Label>
            <Input value={formData.estimatedDays} onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            <Label>Kích hoạt</Label>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Thêm phương thức
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
