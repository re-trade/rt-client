"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  onAdd: (data: Voucher) => void
}

export interface Voucher {
  id: string
  code: string
  name: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit: number
  status: "active" | "inactive"
  usedCount: number
}

export function CreateVoucherDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minOrder: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
  })

  const handleSubmit = () => {
    // validate đơn giản (bạn có thể mở rộng)
    if (!formData.code || !formData.name || !formData.value || !formData.minOrder || !formData.startDate || !formData.endDate || !formData.usageLimit) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const voucherData: Voucher = {
      id: crypto.randomUUID(),
      code: formData.code,
      name: formData.name,
      type: formData.type,
      value: Number(formData.value),
      minOrder: Number(formData.minOrder),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: Number(formData.usageLimit),
      status: "active",
      usedCount: 0,
    }

    onAdd(voucherData)
    setFormData({
      code: "",
      name: "",
      type: "percentage",
      value: "",
      minOrder: "",
      maxDiscount: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
    })
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Tạo voucher mới</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo voucher mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Mã voucher</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="VD: SALE20"
              />
            </div>
            <div>
              <Label htmlFor="name">Tên voucher</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Loại giảm giá</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Giá trị giảm</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === "percentage" ? "20" : "50000"}
              />
            </div>
            <div>
              <Label htmlFor="minOrder">Đơn hàng tối thiểu</Label>
              <Input
                id="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
              />
            </div>
            {formData.type === "percentage" && (
              <div>
                <Label htmlFor="maxDiscount">Giảm tối đa</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="usageLimit">Giới hạn sử dụng</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Tạo voucher
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
