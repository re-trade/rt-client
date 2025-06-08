'use client';
import AddressCard from '@/components/common/AddressCard';
import AddressCreateDialog from '@/components/common/AddressCreateDialog';
import AddressUpdateDialog from '@/components/common/AddressUpdateDialog';
import { useState } from 'react';
export interface Address {
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
  isDefault: boolean;
}

const initialAddress: Address = {
  id: '',
  customer_id: '',
  name: '',
  customerName: '',
  phoneNumber: '',
  state: '',
  country: '',
  district: '',
  ward: '',
  type: '',
  isDefault: false,
};
const fakeAddress: Address[] = [
  {
    id: '1',
    customer_id: 'C001',
    name: 'John Doe',
    customerName: 'John Doe',
    phoneNumber: '+1234567890',
    state: 'California',
    country: 'USA',
    district: 'Downtown',
    ward: 'Ward 1放到',
    type: 'Home',
    isDefault: true,
  },
  {
    id: '2',
    customer_id: 'C002',
    name: 'Jane Smith',
    customerName: 'Jane Smith',
    phoneNumber: '+0987654321',
    state: 'New York',
    country: 'USA',
    district: 'Uptown',
    ward: 'Ward 2',
    type: 'Office',
    isDefault: false,
  },
  {
    id: '3',
    customer_id: 'C003',
    name: 'Bob Johnson',
    customerName: 'Bob Johnson',
    phoneNumber: '+1122334455',
    state: 'Texas',
    country: 'USA',
    district: 'Midtown',
    ward: 'Ward 3',
    type: 'Home',
    isDefault: false,
  },
  {
    id: '4',
    customer_id: 'C004',
    name: 'Alice Brown',
    customerName: 'Alice Brown',
    phoneNumber: '+5566778899',
    state: 'Florida',
    country: 'USA',
    district: 'Southside',
    ward: 'Ward 4',
    type: 'Office',
    isDefault: false,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(fakeAddress);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleCreate = (addr: Address) => {
    setAddresses((prev) => [...prev, addr]);
  };

  const handleUpdate = (updated: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full h-full bg-white p-10">
      <div className="w-full rounded-lg shadow-lg p-6">
        <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Quản lý địa chỉ</h1>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#FFD2B2] text-black px-4 py-2 rounded-lg hover:bg-[#FFBB99] transition"
            >
              Add Address
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto grid grid-cols-1 gap-4">
            {addresses.map((addr, idx) => (
              <AddressCard
                key={addr.id}
                index={idx}
                address={addr}
                onEdit={(a) => {
                  setSelectedAddress(addr);
                  setIsUpdateOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <AddressCreateDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />

        {selectedAddress && (
          <AddressUpdateDialog
            open={isUpdateOpen}
            onClose={() => setIsUpdateOpen(false)}
            onUpdate={handleUpdate}
            initialData={selectedAddress}
          />
        )}
      </div>
    </div>
  );
}
