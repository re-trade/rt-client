// ProductManagement.tsx
'use client';

import { CreateProductDialog } from '@/components/dialog-common/add/create-product-dialog';
import { EditProductDialog } from '@/components/dialog-common/view-update/edit-product-dialog';
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
import { CreateProductDto, productApi, TProduct } from '@/service/product.api';
import { Edit, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { Select } from '@radix-ui/react-select';
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
        toast.error('Lỗi khi tải danh sách sản phẩm');
      }
    };
    fetchProduct();
  }, []);

  const handleCreateProduct = () => {
    setIsCreateOpen(false);
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
        : product,
    );
    setProductList(updatedProducts);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: TProduct) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleDeleteProduct = (product: TProduct) => {
    const updatedProducts = productList.filter((p) => p.id !== product.id);
    setProductList(updatedProducts);
    toast.success('Đã xoá sản phẩm');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý tất cả sản phẩm của bạn</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Tạo sản phẩm mới</Button>
        <CreateProductDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        <EditProductDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          product={selectedProduct}
          onUpdateProduct={handleUpdateProduct}
        />
      </div>
      {productList.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đã xác minh</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productList.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-muted/50"
                    onClick={() => handleEditProduct(product)}
                  >
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
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((c) => (
                          <span
                            key={c.id}
                            className="border border-blue-500 px-2 py-1 rounded text-sm text-blue-700"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </TableCell>


                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {product.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${product.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {product.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
