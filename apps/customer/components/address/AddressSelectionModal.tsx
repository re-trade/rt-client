'use client';

import { TAddress } from '@/services/contact.api';
import { Check, MapPin, Phone, Plus, Search, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface AddressSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectAddress: (address: TAddress) => void;
  onCreateNewAddress: () => void;
  addresses: TAddress[];
  selectedAddressId?: string | null;
  loading?: boolean;
}

export default function AddressSelectionModal({
  open,
  onClose,
  onSelectAddress,
  onCreateNewAddress,
  addresses,
  selectedAddressId,
  loading = false,
}: AddressSelectionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const filteredAddresses = addresses.filter((address) => {
    const query = searchQuery.toLowerCase();
    return (
      address.name.toLowerCase().includes(query) ||
      address.customerName.toLowerCase().includes(query) ||
      address.addressLine.toLowerCase().includes(query) ||
      address.district.toLowerCase().includes(query) ||
      address.state.toLowerCase().includes(query) ||
      address.ward.toLowerCase().includes(query) ||
      address.phone.includes(query)
    );
  });

  const handleAddressSelect = (address: TAddress) => {
    onSelectAddress(address);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNewAddress();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[99999] p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-selection-title"
      onClick={handleBackdropClick}
      style={{ zIndex: 99999 }}
    >
      <div
        ref={modalRef}
        className="bg-white text-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-0 overflow-hidden max-h-[90vh] flex flex-col"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h3 id="address-selection-title" className="text-xl font-bold text-white">
              Chọn địa chỉ giao hàng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Đang tải danh sách địa chỉ...</span>
              </div>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Chưa có địa chỉ nào</h4>
              <p className="text-gray-600 mb-6">
                Thêm địa chỉ giao hàng để có trải nghiệm mua sắm thuận tiện hơn
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy địa chỉ</h4>
              <p className="text-gray-600 mb-6">
                Không có địa chỉ nào khớp với từ khóa "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {filteredAddresses.map((address) => {
                  const isSelected = selectedAddressId === address.id;
                  return (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200 shadow-md'
                          : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="pr-8">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-gray-800">{address.name}</h4>
                          {address.defaulted && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded">
                              Mặc định
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>{address.customerName}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>{address.phone}</span>
                          </div>

                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div>{address.addressLine}</div>
                              <div className="text-xs text-gray-500">
                                {address.ward}, {address.district}, {address.state}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleCreateNew}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Thêm địa chỉ mới
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
