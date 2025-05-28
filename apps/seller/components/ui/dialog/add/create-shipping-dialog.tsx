// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import type { ShippingMethod } from "../page"

// interface CreateShippingDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onCreateMethod: (method: Omit<ShippingMethod, "id">) => void
// }

// export function CreateShippingDialog({ open, onOpenChange, onCreateMethod }: CreateShippingDialogProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     basePrice: "",
//     freeShippingThreshold: "",
//     estimatedDays: "",
//     isActive: true,
//   })

//   const handleSubmit = () => {
//     const methodData: Omit<ShippingMethod, "id"> = {
//       name: formData.name,
//       description: formData.description,
//       basePrice: Number(formData.basePrice),
//       freeShippingThreshold: formData.freeShippingThreshold ? Number(formData.freeShippingThreshold) : undefined,
//       estimatedDays: formData.estimatedDays,
//       isActive: formData.isActive,
//     }

//     onCreateMethod(methodData)
//     setFormData({
//       name: "",
//       description: "",
//       basePrice: "",
//       freeShippingThreshold: "",
//       estimatedDays: "",
//       isActive: true,
//     })
//     onOpenChange(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Thêm phương thức vận chuyển</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="name">Tên phương thức</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Mô tả</Label>
//             <Input
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="basePrice">Phí vận chuyển (đ)</Label>
//             <Input
//               id="basePrice"
//               type="number"
//               value={formData.basePrice}
//               onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="freeShippingThreshold">Miễn phí từ (đ)</Label>
//             <Input
//               id="freeShippingThreshold"
//               type="number"
//               value={formData.freeShippingThreshold}
//               onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
//               placeholder="Để trống nếu không có"
//             />
//           </div>
//           <div>
//             <Label htmlFor="estimatedDays">Thời gian giao hàng</Label>
//             <Input
//               id="estimatedDays"
//               value={formData.estimatedDays}
//               onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
//               placeholder="VD: 3-5 ngày"
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="isActive"
//               checked={formData.isActive}
//               onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
//             />
//             <Label htmlFor="isActive">Kích hoạt</Label>
//           </div>
//           <Button onClick={handleSubmit} className="w-full">
//             Thêm phương thức
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
