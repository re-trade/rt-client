'use client';

interface Address {
  id: string;
  name: string;
  customerName: string;
  phone: string;
  addressLine: string;
  ward: string;
  district: string;
  state: string;
  country: string;
  type: number;
  defaulted: boolean;
}

interface AddressSelectionProps {
  selectedAddress: Address | null;
  onOpenSelectionDialog: () => void;
}

export default function AddressSelection({
  selectedAddress,
  onOpenSelectionDialog,
}: AddressSelectionProps) {
  return (
    <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-800">Địa chỉ giao hàng</h3>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {selectedAddress ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-base truncate">
                      {selectedAddress.customerName}
                    </span>
                    {selectedAddress.defaulted && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded flex-shrink-0">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm">{selectedAddress.phone}</div>
                </div>
              </div>
              <button
                onClick={onOpenSelectionDialog}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors flex-shrink-0"
              >
                Thay đổi
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-sm leading-relaxed">
                <div className="text-gray-800 font-medium break-words">
                  {selectedAddress.addressLine}
                </div>
                <div className="text-gray-600 mt-1 break-words">
                  {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.state}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-sm mb-4">Chưa chọn địa chỉ giao hàng</p>
            <button
              onClick={onOpenSelectionDialog}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
            >
              Chọn địa chỉ giao hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
