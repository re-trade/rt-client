// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import type { Address } from "../page"

// interface CreateAddressDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onCreateAddress: (address: Omit<Address, "id">) => void
// }

// export function CreateAddressDialog({ open, onOpenChange, onCreateAddress }: CreateAddressDialogProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     ward: "",
//     district: "",
//     city: "",
//     isDefault: false,
//   })

//   const handleSubmit = () => {
//     onCreateAddress(formData)
//     setFormData({
//       name: "",
//       phone: "",
//       address: "",
//       ward: "",
//       district: "",
//       city: "",
//       isDefault: false,
//     })
//     onOpenChange(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Thêm địa chỉ mới</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="name">Họ và tên</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="phone">Số điện thoại</Label>
//             <Input
//               id="phone"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="address">Địa chỉ cụ thể</Label>
//             <Input
//               id="address"
//               value={formData.address}
//               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//               placeholder="Số nhà, tên đường"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label htmlFor="ward">Phường/Xã</Label>
//               <Input
//                 id="ward"
//                 value={formData.ward}
//                 onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="district">Quận/Huyện</Label>
//               <Input
//                 id="district"
//                 value={formData.district}
//                 onChange={(e) => setFormData({ ...formData, district: e.target.value })}
//               />
//             </div>
//           </div>
//           <div>
//             <Label htmlFor="city">Tỉnh/Thành phố</Label>
//             <Input
//               id="city"
//               value={formData.city}
//               onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="isDefault"
//               checked={formData.isDefault}
//               onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
//             />
//             <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
//           </div>
//           <Button onClick={handleSubmit} className="w-full">
//             Thêm địa chỉ
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
