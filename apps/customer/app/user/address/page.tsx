'use client';

import AddressCard from '@/components/common/AddressCard';
import AddressCreateDialog from '@/components/common/AddressCreateDialog';
import AddressUpdateDialog from '@/components/common/AddressUpdateDialog';
import { useAddressManager } from '@/hooks/use-address-manager';
import { Gift, Home, MapPin, Navigation, Plus, RefreshCw, Shield, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
            <div className="animate-pulse">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-3">
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64"></div>
                  <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
                <div className="flex space-x-3">
                  <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-['Reddit_Sans']">Quản lý địa chỉ</h1>
                  <p className="text-[#121212] mt-1 font-['Reddit_Sans']">
                    Thêm và quản lý địa chỉ giao hàng của bạn
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-[#121212] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 font-['Reddit_Sans']"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
                </button>
                <button
                  onClick={openCreateDialog}
                  className="bg-white text-[#121212] hover:bg-[#FDFEF9] px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium font-['Reddit_Sans']"
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
              <p className="text-red-800 font-medium font-['Reddit_Sans']">Có lỗi xảy ra</p>
              <p className="text-red-600 text-sm font-['Reddit_Sans']">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20">
          {loading && addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFD2B2] border-t-[#121212]"></div>
                <MapPin className="w-6 h-6 text-[#121212] absolute top-3 left-3" />
              </div>
              <p className="mt-4 text-[#121212] font-medium font-['Reddit_Sans']">
                Đang tải địa chỉ...
              </p>
              <p className="text-[#525252] text-sm font-['Reddit_Sans']">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-[#FFD2B2] rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-[#121212]" />
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2 font-['Reddit_Sans']">
                Chưa có địa chỉ nào
              </h3>
              <p className="text-[#525252] mb-6 max-w-md mx-auto font-['Reddit_Sans']">
                Thêm địa chỉ giao hàng để có trải nghiệm mua sắm thuận tiện và nhanh chóng hơn
              </p>
              <button
                onClick={openCreateDialog}
                className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-md hover:shadow-lg font-['Reddit_Sans']"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm địa chỉ đầu tiên</span>
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-[#525252]/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#FFD2B2] rounded-lg">
                      <Home className="w-5 h-5 text-[#121212]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#525252] font-medium font-['Reddit_Sans']">
                        Tổng địa chỉ
                      </p>
                      <p className="text-xl font-bold text-[#121212] font-['Reddit_Sans']">
                        {addresses.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#525252]/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#FFD2B2] rounded-lg">
                      <Star className="w-5 h-5 text-[#121212]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#525252] font-medium font-['Reddit_Sans']">
                        Địa chỉ mặc định
                      </p>
                      <p className="text-xl font-bold text-[#121212] font-['Reddit_Sans']">
                        {addresses.filter((addr) => addr.isDefault).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#525252]/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#FFD2B2] rounded-lg">
                      <Gift className="w-5 h-5 text-[#121212]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#525252] font-medium font-['Reddit_Sans']">
                        Giao hàng nhanh
                      </p>
                      <p className="text-xl font-bold text-[#121212] font-['Reddit_Sans']">
                        Có sẵn
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#121212] flex items-center font-['Reddit_Sans']">
                    <Navigation className="w-5 h-5 mr-2 text-[#121212]" />
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
        <div className="bg-[#FFD2B2] rounded-xl shadow-md p-6 border border-[#525252]/20">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-lg">
              <Gift className="w-6 h-6 text-[#121212]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#121212] mb-2 font-['Reddit_Sans']">
                💡 Mẹo giao hàng thông minh
              </h3>
              <p className="text-[#121212] text-sm leading-relaxed font-['Reddit_Sans']">
                Lưu nhiều địa chỉ để dễ dàng chọn lựa khi mua sắm. Bạn có thể đặt địa chỉ mặc định
                cho việc giao hàng nhanh chóng và thuận tiện hơn.
              </p>
            </div>
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
