'use client';

import { CreateProductDialog } from '@/components/dialog/add/create-product-dialog';
import { EditProductDialog } from '@/components/dialog/view-update/edit-product-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { productApi, TProduct, CreateProductDto } from '@/service/product.api';
import { Edit,Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// ✅ Đảm bảo file tồn tại

export default function ProductManagement() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [productList, setProductList] = useState<TProduct[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productList = await productApi.getProducts();
        setProductList(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProduct();
  }, []);

  const handleCreateProduct = (productData: CreateProductDto) => {
    const newProduct: TProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sellerId: 'mock-seller-id', // hoặc lấy từ context/token
      sellerShopName: 'Gian hàng mẫu',
      verified: false,
      categories: [], // bạn có thể map từ categoryIds sang categories tên nếu cần
    };
    setProductList([...productList, newProduct]);
  };

  const handleUpdateProduct = (updatedData: Partial<CreateProductDto>) => {
    if (!selectedProduct) return;

    const updatedProducts = productList.map((product) =>
      product.id === selectedProduct.id
        ? {
          ...product,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        }
        : product
    );
    setProductList(updatedProducts);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: TProduct) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };
  const handleDeletetProduct = (product: TProduct) => {
    const updatedProducts = productList.filter((p) => p.id !== product.id);
    setProductList(updatedProducts);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm của bạn</p>

        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Tạo sản phẩm mới</Button>
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
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Image
                      src={product.thumbnail || '/placeholder.svg'}
                      alt={product.name}
                      width={70}
                      height={70}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.currentPrice.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>{product.categories.join(', ')}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${product.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {product.verified ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
           

                  <TableCell className='flex items-center gap-2'>
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletetProduct(product)}>
                      <Trash className="h-4 w-4" />
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
