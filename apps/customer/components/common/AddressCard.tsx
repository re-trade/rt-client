'use client';

interface Address {
  id: string;
  customer_id: string;
  name: string;
  customerName: string;
  phoneNumber: string;
  state: string;
  country: string;
  district: string;
  ward: string;
  type: string;
}

interface Props {
  address: Address;
  index: number;
  onEdit: (addr: Address) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, index, onEdit, onDelete }: Props) {
  return (
    <div className="bg-[#FFF2E6] p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-medium text-black">Địa chỉ {index + 1}</h2>
        <div className="flex items-start space-x-2">
          <span className="mt-1">
            <svg
              className="w-5 h-5 text-[#FF9999]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium text-black">{address.name}</p>
            <p className="text-sm text-gray-600">
              {address.ward}, {address.district}, {address.state}, {address.country}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => onEdit(address)}
            className="bg-[#FFE4D6] text-black px-3 py-1 rounded-lg text-sm hover:bg-[#FFDAB9] transition"
          >
            Cập nhật địa chỉ
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="bg-[#FFE4D6] text-black px-3 py-1 rounded-lg text-sm hover:bg-[#FFDAB9] transition"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
