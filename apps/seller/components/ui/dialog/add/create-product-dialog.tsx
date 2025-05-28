// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import type { Product } from "../page"

// interface CreateProductDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onCreateProduct: (product: Omit<Product, "id">) => void
// }

// export function CreateProductDialog({ open, onOpenChange, onCreateProduct }: CreateProductDialogProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     category: "",
//     description: "",
//     image: "",
//   })

//   const handleSubmit = () => {
//     const productData: Omit<Product, "id"> = {
//       name: formData.name,
//       price: Number(formData.price),
//       stock: Number(formData.stock),
//       category: formData.category,
//       description: formData.description,
//       image: formData.image || "/placeholder.svg?height=100&width=100",
//       status: "active",
//     }

//     onCreateProduct(productData)
//     setFormData({ name: "", price: "", stock: "", category: "", description: "", image: "" })
//     onOpenChange(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Tạo sản phẩm mới</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="name">Tên sản phẩm</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="price">Giá</Label>
//             <Input
//               id="price"
//               type="number"
//               value={formData.price}
//               onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="stock">Số lượng</Label>
//             <Input
//               id="stock"
//               type="number"
//               value={formData.stock}
//               onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="category">Danh mục</Label>
//             <Input
//               id="category"
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Mô tả</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             />
//           </div>
//           <Button onClick={handleSubmit} className="w-full">
//             Tạo sản phẩm
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
