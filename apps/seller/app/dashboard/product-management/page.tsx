'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreateProductDialog } from '@/components/ui/dialog/add/create-product-dialog';
import { EditProductDialog } from '@/components/ui/dialog/view-update/edit-product-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import Image from "next/image"
import { CreateProductDialog } from "@/components/dialog/add/create-product-dialog"
import { EditProductDialog } from "@/components/dialog/view-update/edit-product-dialog"

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Áo thun nam',
    price: 299000,
    stock: 50,
    category: 'Thời trang',
    description: 'Áo thun nam chất liệu cotton cao cấp',
    image: '/placeholder.svg?height=100&width=100',
    status: 'active',
  },
  {
    id: '2',
    name: 'Quần jeans nữ',
    price: 599000,
    stock: 30,
    category: 'Thời trang',
    description: 'Quần jeans nữ form slim fit',
    image: '/placeholder.svg?height=100&width=100',
    status: 'active',
  },
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCreateProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id'>) => {
    if (!selectedProduct) return;

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? { ...product, ...productData } : product,
    );
    setProducts(updatedProducts);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm của bạn</p>
        </div>
        <CreateProductDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onCreateProduct={handleCreateProduct}
        />
        <EditProductDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          product={selectedProduct}
          onUpdateProduct={handleUpdateProduct}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
