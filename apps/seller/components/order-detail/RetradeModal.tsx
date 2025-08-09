import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface RetradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: any;
  retradeQuantity: number;
  setRetradeQuantity: (quantity: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  formatPrice: (price: number) => string;
}

export function RetradeModal({
  isOpen,
  onOpenChange,
  selectedItem,
  retradeQuantity,
  setRetradeQuantity,
  onSubmit,
  isSubmitting,
  formatPrice,
}: RetradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Retrade Sản phẩm</DialogTitle>
          <DialogDescription>
            {selectedItem && (
              <div className="mt-2">
                <p className="font-medium text-gray-800">{selectedItem.itemName}</p>
                <p className="text-sm text-gray-600">Giá: {formatPrice(selectedItem.basePrice)}</p>
                <p className="text-sm text-gray-600">Số lượng đã mua: {selectedItem.quantity}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="quantity" className="text-right">
              Số lượng
            </label>
            <div className="col-span-3">
              <Input
                id="quantity"
                type="number"
                value={retradeQuantity}
                onChange={(e) =>
                  setRetradeQuantity(
                    Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      selectedItem?.quantity || 1,
                    ),
                  )
                }
                min="1"
                max={selectedItem?.quantity}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận Retrade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
