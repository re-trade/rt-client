'use client';

import AddressCard from '@/components/common/AddressCard';
import AddressCreateDialog from '@/components/common/AddressCreateDialog';
import AddressUpdateDialog from '@/components/common/AddressUpdateDialog';
import { useAddressManager } from '@/hooks/use-address-manager';
import { useEffect, useState } from 'react';

export default function AddressPage() {
  const {
    addresses,
    isCreateOpen,
    isUpdateOpen,
    selectedAddress,
    openCreateDialog,
    openUpdateDialog,
    closeDialogs,
    deleteAddress,
    createAddress,
    updateAddress,
    formData,
    errors,
    touched,
    provinces,
    districts,
    wards,
    loading,
    submitting,
    handleFieldChange,
    handleFieldBlur,
    refreshAddresses,
  } = useAddressManager();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    refreshAddresses();
  };

  if (isInitialLoading) {
    return (
      <div className="w-full h-full bg-white p-10">
        <div className="w-full rounded-lg shadow-lg p-6">
          <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
            <div className="animate-pulse">
              <div className="flex justify-between items-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-10">
      <div className="w-full rounded-lg shadow-lg p-6">
        <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-black">Quản lý địa chỉ</h1>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
              <button
                onClick={openCreateDialog}
                className="bg-[#FFD2B2] text-black px-4 py-2 rounded-lg hover:bg-[#FFBB99] transition"
              >
                Thêm Địa Chỉ
              </button>
            </div>
          </div>
          {errors.general && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && addresses.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD2B2]"></div>
                <span className="ml-2 text-gray-600">Đang tải địa chỉ...</span>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">Chưa có địa chỉ nào</div>
                <div className="text-gray-400 text-sm">
                  Nhấn "Thêm Địa Chỉ" để tạo địa chỉ đầu tiên
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {addresses.map((addr, idx) => (
                  <AddressCard
                    key={addr.id}
                    index={idx}
                    address={addr}
                    onEdit={openUpdateDialog}
                    onDelete={deleteAddress}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <AddressCreateDialog
          open={isCreateOpen}
          onClose={closeDialogs}
          onCreate={createAddress}
          formData={formData}
          errors={errors}
          touched={touched}
          provinces={provinces}
          districts={districts}
          wards={wards}
          loading={loading}
          submitting={submitting}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
        />

        <AddressUpdateDialog
          open={isUpdateOpen}
          onClose={closeDialogs}
          onUpdate={updateAddress}
          formData={formData}
          errors={errors}
          touched={touched}
          provinces={provinces}
          districts={districts}
          wards={wards}
          loading={loading}
          submitting={submitting}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
        />
      </div>
    </div>
  );
}
