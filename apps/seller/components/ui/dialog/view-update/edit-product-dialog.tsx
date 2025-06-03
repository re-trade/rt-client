'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onUpdateProduct: (product: Omit<Product, 'id'>) => void;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  onUpdateProduct,
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        description: product.description,
        image: product.image,
      });
    }
  }, [product]);

  const handleSubmit = () => {
    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      description: formData.description,
      image: formData.image || '/placeholder.svg?height=100&width=100',
      status: 'active',
    };

    onUpdateProduct(productData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Tên sản phẩm</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-price">Giá</Label>
            <Input
              id="edit-price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-stock">Số lượng</Label>
            <Input
              id="edit-stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-category">Danh mục</Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Cập nhật sản phẩm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
