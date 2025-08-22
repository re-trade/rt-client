import { ChevronDown, Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
};

const OrderStatusDropdown = ({ statusFilter, setStatusFilter }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PREPARING':
        return { label: 'Đang chuẩn bị', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'DELIVERING':
        return { label: 'Đang giao hàng', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'DELIVERED':
        return {
          label: 'Đã giao hàng',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'RETRIEVED':
        return {
          label: 'Đã lấy hàng',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'COMPLETED':
        return { label: 'Đã hoàn tất', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'CANCELLED':
        return { label: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' };
      case 'RETURNING':
        return { label: 'Đang hoàn trả', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'RETURNED':
        return { label: 'Đã trả hàng', color: 'bg-slate-50 text-slate-700 border-slate-200' };
     default:
        return { label: 'tất cả trạng thái', color: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

const validStatuses = ['PREPARING', 'DELIVERING', 'DELIVERED', 'RETRIEVED', 'COMPLETED', 'CANCELLED', 'RETURNING', 'RETURNED'];

const selectedStatus = statusFilter !== 'all' && validStatuses.includes(statusFilter) 
  ? getStatusConfig(statusFilter) 
  : null;

  return (
    <div className="relative w-full sm:w-48" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all bg-white hover:bg-gray-50"
      >
        <span className="flex items-center space-x-2 flex-1 min-w-0">
          {selectedStatus ? (
            <span
              className={`px-2 py-1 rounded-md border text-xs font-medium ${selectedStatus.color} truncate`}
            >
              {selectedStatus.label}
            </span>
          ) : (
            <>
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
              <span className="text-gray-500 truncate">Tất cả trạng thái</span>
            </>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ml-2 flex-shrink-0 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setIsDropdownOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
              statusFilter === 'all' ? 'bg-orange-50 border-l-4 border-orange-500' : ''
            }`}
          >
            <span className="text-gray-700 flex-1">Tất cả trạng thái</span>
          </button>

          {[
            'PREPARING',
            'DELIVERING',
            'DELIVERED',
            'RETRIEVED',
            'COMPLETED',
            'CANCELLED',
            'RETURNING',
            'RETURNED',
          ].map((status) => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  statusFilter === status ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                }`}
              >
                <span className={`px-2 py-1 rounded-md border text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderStatusDropdown;
