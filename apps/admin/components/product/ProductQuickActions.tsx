'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TProduct } from '@/services/product.api';
import { Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ProductApprovalDialog } from './ProductApprovalDialog';

interface ProductQuickActionsProps {
  product: TProduct;
  actionLoading: boolean;
  onApprove: () => void;
  onDeny: (reason: string) => void;
}

export function ProductQuickActions({
  product,
  actionLoading,
  onApprove,
  onDeny,
}: ProductQuickActionsProps) {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const handleApprove = () => {
    onApprove();
    setShowApprovalDialog(false);
  };

  const handleDeny = (reason: string) => {
    onDeny(reason);
    setShowApprovalDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-500" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!product.verified && (
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => setShowApprovalDialog(true)}
              disabled={actionLoading}
            >
              <Check className="w-4 h-4 mr-2" />
              Duyệt sản phẩm
            </Button>
          )}

          {product.verified && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-green-700 font-medium">Sản phẩm đã được xác minh</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductApprovalDialog
        product={product}
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        onApprove={handleApprove}
        onDeny={handleDeny}
        loading={actionLoading}
      />
    </>
  );
}
