'use client';

interface SelectedItem {
  productId: string;
  quantity: number;
}

interface CartSummaryBarProps {
  selectedItems: SelectedItem[];
  onContinue?: () => void;
}

export default function CartSummaryBar({ selectedItems, onContinue }: CartSummaryBarProps) {
  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 bg-white rounded-xl border-2 border-orange-200 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-gray-800">Đã chọn {selectedItems.length} sản phẩm</span>
            <p className="text-sm text-gray-600">Nhấp vào sản phẩm để chọn/bỏ chọn</p>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tiếp tục với {selectedItems.length} sản phẩm
          </button>
        )}
      </div>
    </div>
  );
}
