'use client';

import { useAddressManagement } from '@/hooks/use-address-management';
import AddressCard from '@components/address/AddressCard';
import AddressCreateDialog from '@components/address/AddressCreateDialog';
import AddressSkeleton from '@components/address/AddressSkeleton';
import AddressUpdateDialog from '@components/address/AddressUpdateDialog';
import { Gift, Home, MapPin, Navigation, Plus, RefreshCw, Shield, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddressPage() {
  const {
    addresses,
    isCreateOpen,
    isUpdateOpen,
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
  } = useAddressManagement();

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
    return <AddressSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Quản lý địa chỉ</h1>
                  <p className="text-gray-600 mt-1">Thêm và quản lý địa chỉ giao hàng của bạn</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
                </button>
                <button
                  onClick={openCreateDialog}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm địa chỉ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8 border border-orange-200">
          {loading && addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div>
                <MapPin className="w-6 h-6 text-orange-500 absolute top-3 left-3" />
              </div>
              <p className="mt-4 text-gray-800 font-medium">Đang tải địa chỉ...</p>
              <p className="text-gray-600 text-sm">Vui lòng chờ trong giây lát</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thêm địa chỉ giao hàng để có trải nghiệm mua sắm thuận tiện và nhanh chóng hơn
              </p>
              <button
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm địa chỉ đầu tiên</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Home className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium ">Tổng địa chỉ</p>
                      <p className="text-xl font-bold text-gray-800 ">{addresses.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Star className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium ">Địa chỉ mặc định</p>
                      <p className="text-xl font-bold text-gray-800 ">
                        {addresses.filter((addr) => addr.isDefault).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Gift className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium ">Giao hàng nhanh</p>
                      <p className="text-xl font-bold text-gray-800 ">Có sẵn</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center ">
                    <Navigation className="w-5 h-5 mr-2 text-orange-500" />
                    Danh sách địa chỉ ({addresses.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
                  {addresses.map((addr, idx) => (
                    <div key={addr.id} className="group">
                      <AddressCard
                        index={idx}
                        address={addr}
                        onEdit={openUpdateDialog}
                        onDelete={deleteAddress}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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
