'use client';
import { Address } from '@/hooks/use-address-manager';
import { Edit, MapPin, Phone, Trash2, User } from 'lucide-react';

interface Props {
  address: Address;
  index: number;
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, index, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#525252]/20 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#121212] flex items-center">
            <span className="inline-flex items-center justify-center bg-[#FFD2B2] w-6 h-6 rounded-full text-sm mr-2 text-[#121212]">
              {index + 1}
            </span>
            {address.name}
          </h2>
          {address.isDefault && (
            <span className="bg-[#FFD2B2] text-[#121212] text-xs font-medium px-2.5 py-1 rounded">
              Mặc định
            </span>
          )}
        </div>

        <div className="space-y-2 pl-2 border-l-2 border-[#FFD2B2]">
          <div className="flex items-start space-x-2">
            <User className="w-4 h-4 text-[#121212] mt-0.5" />
            <p className="text-sm font-medium text-[#121212]">{address.customerName}</p>
          </div>

          <div className="flex items-start space-x-2">
            <Phone className="w-4 h-4 text-[#121212] mt-0.5" />
            <p className="text-sm text-[#525252]">{address.phoneNumber}</p>
          </div>

          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-[#121212] mt-0.5" />
            <div>
              <p className="text-sm text-[#525252]">{address.addressLine}</p>
              <p className="text-sm text-[#525252]">
                {address.ward}, {address.district}, {address.state}, {address.country}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-2 mt-2 border-t border-[#525252]/20">
          <button
            onClick={() => onEdit(address)}
            className="flex items-center bg-[#FFD2B2] text-[#121212] px-3 py-1.5 rounded-lg text-sm hover:bg-[#FFBB99] transition font-medium"
          >
            <Edit className="w-4 h-4 mr-1" />
            Cập nhật
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="flex items-center bg-white border border-[#525252]/20 text-[#121212] px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition font-medium"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
