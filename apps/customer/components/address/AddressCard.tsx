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
    <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center bg-orange-100 w-6 h-6 rounded-full text-sm mr-2 text-orange-600">
              {index + 1}
            </span>
            {address.name}
          </h2>
          {address.isDefault && (
            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded">
              Mặc định
            </span>
          )}
        </div>

        <div className="space-y-2 pl-2 border-l-2 border-orange-500">
          <div className="flex items-start space-x-2">
            <User className="w-4 h-4 text-orange-500 mt-0.5" />
            <p className="text-sm font-medium text-gray-800">{address.customerName}</p>
          </div>

          <div className="flex items-start space-x-2">
            <Phone className="w-4 h-4 text-orange-500 mt-0.5" />
            <p className="text-sm text-gray-600">{address.phoneNumber}</p>
          </div>

          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{address.addressLine}</p>
              <p className="text-sm text-gray-600">
                {address.ward}, {address.district}, {address.state}, {address.country}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-2 mt-2 border-t border-orange-200">
          <button
            onClick={() => onEdit(address)}
            className="flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg text-sm hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-sm hover:shadow-md"
          >
            <Edit className="w-4 h-4 mr-1" />
            Cập nhật
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="flex items-center bg-white border border-orange-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition font-medium"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
