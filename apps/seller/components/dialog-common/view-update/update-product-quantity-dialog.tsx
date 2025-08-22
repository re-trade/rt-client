'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productApi, TProduct } from '@/service/product.api';
import { AlertCircle, Package, RefreshCw, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateProductQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProduct | null;
  onSuccess: () => void;
}

export function UpdateProductQuantityDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: UpdateProductQuantityDialogProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setQuantity(0);
      setError('Số lượng phải là số nguyên dương');
    } else {
      setQuantity(value);
      setError(null);
    }
  };

  const handleUpdateQuantity = async () => {
    if (!product) return;

    if (quantity < 0) {
      setError('Số lượng phải là số nguyên dương');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await productApi.updateProductQuantity({
        productId: product.id,
        quantity,
      });

      if (success) {
        toast.success('Đã cập nhật số lượng sản phẩm thành công');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Không thể cập nhật số lượng sản phẩm');
      }
    } catch (error) {
      toast.error('Không thể cập nhật số lượng sản phẩm');
      console.error('Error updating product quantity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only set the initial quantity when the product changes or dialog opens
  useEffect(() => {
    if (product) {
      setQuantity(product.quantity);
    }
  }, [product, open]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-orange-100">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-orange-500">
                Cập nhật số lượng sản phẩm
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Điều chỉnh số lượng tồn kho cho sản phẩm
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-4 flex items-center gap-3 border border-orange-100">
            <div className="flex-shrink-0 h-14 w-14 rounded-md overflow-hidden border border-orange-200">
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-medium text-orange-800">{product.name}</h3>
              <p className="text-xs text-orange-600">Mã sản phẩm: {product.id.substring(0, 8)}</p>
              <p className="text-xs text-orange-600 mt-1">Thương hiệu: {product.brand}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-orange-700">
              Số lượng sản phẩm
            </Label>
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={handleQuantityChange}
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
              />
              {error && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Số lượng hiện tại: {product.quantity}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-orange-200 hover:bg-orange-50 flex-1 text-orange-600"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleUpdateQuantity}
              disabled={isSubmitting || quantity === product.quantity || !!error}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật số lượng
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
