'use client';
import AchievementsWidget from '@/components/dashboard/AchievementsWidget';
import ProfileViewSwitcher from '@/components/dashboard/ProfileViewSwitcher';
import StatisticsWidget from '@/components/dashboard/StatisticsWidget';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAddressData } from '@/hooks/use-address-data';
import { useCustomerProfile } from '@/hooks/use-customer-profile';
import { useSellerStatistics } from '@/hooks/use-seller-statistics';
import { sellerApi, SellerProfileResponse, SellerProfileUpdateRequest } from '@/service/seller.api';
import { storageApi } from '@/service/storage.api';
import {
  Calendar,
  Check,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  ShieldX,
  Star,
  Upload,
  User,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
export default function ShopInfoManagement() {
  const [sellerInfo, setSellerInfo] = useState<SellerProfileResponse>();
  const [formData, setFormData] = useState<SellerProfileResponse>();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [profileView, setProfileView] = useState<'seller' | 'customer'>('seller');

  const {
    provinces,
    districts,
    wards,
    loading: addressLoading,
    error: addressError,
    fetchDistricts,
    fetchWards,
    getProvinceByName,
    getDistrictByName,
    getWardByName,
  } = useAddressData();

  const {
    profile: customerProfile,
    isLoading: customerLoading,
    error: customerError,
  } = useCustomerProfile();

  const {
    statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useSellerStatistics(formData);

  useEffect(() => {
    (async () => {
      const response = await sellerApi.sellerInformation();
      setSellerInfo(response);
      setFormData(response);
    })();
  }, []);

  useEffect(() => {
    if (formData?.state && provinces.length > 0) {
      const province = getProvinceByName(formData.state);
      if (province) {
        fetchDistricts(province.code.toString());
      }
    }
  }, [formData?.state, provinces, getProvinceByName, fetchDistricts]);

  useEffect(() => {
    if (profileView === 'customer' && isEditing) {
      handleCancel();
    }
  }, [profileView]);

  useEffect(() => {
    if (formData?.district && districts.length > 0) {
      const district = getDistrictByName(formData.district);
      if (district) {
        fetchWards(district.code.toString());
      }
    }
  }, [formData?.district, districts, getDistrictByName, fetchWards]);

  const hasChanges = useMemo(() => {
    if (!sellerInfo || !formData) return false;

    return (
      sellerInfo.shopName !== formData.shopName ||
      sellerInfo.description !== formData.description ||
      sellerInfo.addressLine !== formData.addressLine ||
      sellerInfo.district !== formData.district ||
      sellerInfo.ward !== formData.ward ||
      sellerInfo.state !== formData.state ||
      sellerInfo.email !== formData.email ||
      sellerInfo.phoneNumber !== formData.phoneNumber ||
      avatarFile !== null ||
      backgroundFile !== null
    );
  }, [sellerInfo, formData, avatarFile, backgroundFile]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setFormData(sellerInfo);
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
  };

  const handleAddressChange = (field: 'state' | 'district' | 'ward', value: string) => {
    if (!formData) return;

    if (field === 'state') {
      const province = provinces.find((p) => p.code.toString() === value);
      if (province) {
        setFormData({
          ...formData,
          state: province.name,
          district: '',
          ward: '',
        });
        fetchDistricts(value);
      }
    } else if (field === 'district') {
      const district = districts.find((d) => d.code.toString() === value);
      if (district) {
        setFormData({
          ...formData,
          district: district.name,
          ward: '',
        });
        fetchWards(value);
      }
    } else if (field === 'ward') {
      const ward = wards.find((w) => w.code.toString() === value);
      if (ward) {
        setFormData({
          ...formData,
          ward: ward.name,
        });
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setBackgroundFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!formData || !hasChanges) return;

    let avatarUrl = formData.avatarUrl;
    let background = formData.background;

    if (avatarFile) avatarUrl = await storageApi.fileUpload(avatarFile);
    if (backgroundFile) background = await storageApi.fileUpload(backgroundFile);

    const payload: SellerProfileUpdateRequest = {
      shopName: formData.shopName || '',
      avatarUrl,
      background,
      description: formData.description || '',
      addressLine: formData.addressLine || '',
      district: formData.district || '',
      ward: formData.ward || '',
      state: formData.state || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
    };

    const response = await sellerApi.updateSellerProfile(payload);
    if (!response.success) {
      toast.error(response.messages || 'Cập nhật thông tin không thành công');
      return;
    }
    toast.success('Cập nhật thông tin thành công');
    const updated = { ...formData, avatarUrl, background };
    setSellerInfo(updated);
    setFormData(updated);
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
  };

  const handleEmailSave = async () => {
    if (!formData) return;
    const email = formData.email || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    const payload: SellerProfileUpdateRequest = {
      shopName: formData.shopName || '',
      avatarUrl: formData.avatarUrl,
      background: formData.background,
      description: formData.description || '',
      addressLine: formData.addressLine || '',
      district: formData.district || '',
      ward: formData.ward || '',
      state: formData.state || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
    };

    const response = await sellerApi.updateSellerProfile(payload);
    if (!response.success) {
      toast.error(response.messages || 'Cập nhật email không thành công');
      return;
    }
    toast.success('Cập nhật email thành công');
    setSellerInfo(formData);
    setIsEditingEmail(false);
  };

  const handlePhoneSave = async () => {
    if (!formData) return;
    const phone = formData.phoneNumber || '';
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0!');
      return;
    }
    const payload: SellerProfileUpdateRequest = {
      shopName: formData.shopName || '',
      avatarUrl: formData.avatarUrl,
      background: formData.background,
      description: formData.description || '',
      addressLine: formData.addressLine || '',
      district: formData.district || '',
      ward: formData.ward || '',
      state: formData.state || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
    };

    const response = await sellerApi.updateSellerProfile(payload);
    if (!response.success) {
      toast.error(response.messages || 'Cập nhật số điện thoại không thành công');
      return;
    }
    toast.success('Cập nhật số điện thoại thành công');
    setSellerInfo(formData);
    setSellerInfo(formData);
    setIsEditingPhone(false);
  };

  const handleEmailCancel = () => {
    setFormData((prev) => (prev ? { ...prev, email: sellerInfo?.email || '' } : prev));
    setIsEditingEmail(false);
  };

  const handlePhoneCancel = () => {
    setFormData((prev) => (prev ? { ...prev, phoneNumber: sellerInfo?.phoneNumber || '' } : prev));
    setIsEditingPhone(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'pending':
        return 'Chờ duyệt';
      case 'suspended':
        return 'Tạm ngưng';
      default:
        return 'Chưa rõ';
    }
  };

  const getVerificationStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Đã xác minh';
      case 'WAITING':
        return 'Chờ xác minh';
      case 'FAILED':
        return 'Xác minh thất bại';
      case 'INIT':
        return 'Chưa bắt đầu';
      case 'PENDING':
        return 'Chờ xác minh';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'UNVERIFIED':
        return 'Chưa xác minh';
      default:
        return 'Chưa xác minh';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return ShieldCheck;
      case 'WAITING':
        return Shield;
      case 'FAILED':
        return ShieldX;
      case 'INIT':
        return Shield;
      case 'PENDING':
        return Shield;
      case 'REJECTED':
        return ShieldX;
      case 'UNVERIFIED':
        return Shield;
      default:
        return Shield;
    }
  };

  if (!formData || !sellerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 font-medium">Đang tải thông tin của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b-2 border-orange-400 pb-2 inline-block">
              Thông tin của bạn
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Quản lý thông tin và thiết lập trang bán của bạn
            </p>
          </div>

          {/* Profile View Switcher - Moved to top-right */}
          <ProfileViewSwitcher profileView={profileView} onProfileViewChange={setProfileView} />
        </div>

        {/* Profile Content */}
        {profileView === 'seller' ? (
          /* Seller Profile View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Statistics Sidebar */}
            <div className="lg:order-2 space-y-4 sm:space-y-6">
              <StatisticsWidget
                statistics={statistics}
                isLoading={statisticsLoading}
                error={statisticsError}
                identityVerifiedStatus={formData.identityVerifiedStatus}
                getVerificationIcon={getVerificationIcon}
                getVerificationStatusText={getVerificationStatusText}
              />

              {/* Achievements Section */}
              <AchievementsWidget />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 lg:order-1">
              <Card className="overflow-hidden shadow border bg-white">
                <CardContent className="p-8 space-y-10">
                  {/* Cover Image */}
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img
                        src={
                          backgroundFile ? URL.createObjectURL(backgroundFile) : formData.background
                        }
                        alt="Cover"
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Removed gradient overlays */}
                      {isEditing && (
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Input
                            id="background-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundChange}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            className="bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 hover:border-orange-300 px-6 py-3 font-semibold"
                            onClick={() => document.getElementById('background-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Thay đổi ảnh bìa
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Section */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
                    <div className="relative group mx-auto sm:mx-0">
                      <div className="relative">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-2 sm:border-4 border-white shadow-xl lg:shadow-2xl ring-4 sm:ring-6 lg:ring-8 ring-blue-100">
                          <AvatarImage
                            src={avatarFile ? URL.createObjectURL(avatarFile) : formData.avatarUrl}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-lg sm:text-xl lg:text-2xl font-bold">
                            {formData.shopName?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                            <Button
                              size="sm"
                              className="h-8 w-8 sm:h-10 sm:w-10 p-0 bg-orange-500 hover:bg-orange-600 text-white shadow-md rounded-full"
                              onClick={() => document.getElementById('avatar-upload')?.click()}
                            >
                              <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 sm:space-y-6 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-h-[40px] sm:min-h-[60px] flex items-center justify-center sm:justify-start">
                          {isEditing ? (
                            <Input
                              value={formData.shopName || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, shopName: e.target.value })
                              }
                              className="text-xl sm:text-2xl lg:text-3xl font-bold border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 h-[40px] sm:h-[50px] lg:h-[60px] text-center sm:text-left"
                              placeholder="Tên người bán"
                            />
                          ) : (
                            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800">
                              {formData.shopName || 'Chưa thiết lập'}
                            </h2>
                          )}
                        </div>

                        {/* Edit Buttons - Moved inside profile */}
                        <div className="flex justify-center sm:justify-end">
                          {!isEditing ? (
                            <Button
                              onClick={handleEdit}
                              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 py-2 px-4 text-sm font-semibold"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Thay đổi thông tin</span>
                              <span className="sm:hidden">Thay đổi</span>
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className={`${
                                  hasChanges
                                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                } transition-all duration-300 py-2 px-4 text-sm font-semibold`}
                              >
                                <Save className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Lưu thay đổi</span>
                                <span className="sm:hidden">Lưu</span>
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 py-2 px-4 text-sm font-semibold"
                              >
                                <X className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Hủy bỏ</span>
                                <span className="sm:hidden">Hủy</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 lg:gap-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-amber-200 shadow-sm">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                          <span className="text-xs sm:text-sm font-semibold text-amber-700">
                            {formData.avgVote ? formData.avgVote.toFixed(1) : '0.0'}/5.0
                          </span>
                        </div>

                        {/* Join Date */}
                        <div className="flex items-center gap-1 sm:gap-2 bg-sky-50 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-sky-200 shadow-sm">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                          <span className="text-xs sm:text-sm font-medium text-sky-800">
                            <span className="hidden sm:inline">Tham gia </span>
                            {new Date(formData.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        {/* Shop Status */}
                        <div
                          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm border-2 ${getStatusColor(
                            formData?.verified ? 'active' : 'pending',
                          )}`}
                        >
                          <p
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold ${getStatusColor(
                              formData?.verified ? 'active' : 'pending',
                            )}`}
                          >
                            {getStatusText(formData?.verified ? 'active' : 'pending')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-orange-400 rounded-full"></div>
                      Mô tả cửa hàng
                    </Label>
                    {isEditing ? (
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] max-h-[200px] border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-sm sm:text-base lg:text-lg p-3 sm:p-4 resize-none"
                        placeholder="Mô tả về bạn..."
                      />
                    ) : (
                      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] flex items-start">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                          {formData.description || 'Chưa có mô tả'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-3 bg-orange-500 rounded-lg sm:rounded-xl">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      Thông tin liên hệ
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      {/* Email */}
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="flex items-center gap-1 sm:gap-2 text-gray-700 font-semibold text-base sm:text-lg">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          Email
                        </Label>
                        <div className="relative">
                          {isEditingEmail ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Input
                                value={formData.email || ''}
                                onChange={(e) =>
                                  setFormData({ ...formData, email: e.target.value })
                                }
                                className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-sm sm:text-base lg:text-lg h-[44px] sm:h-[48px] lg:h-[56px] flex-1"
                                placeholder="email@example.com"
                              />
                              <Button
                                size="sm"
                                onClick={handleEmailSave}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 h-[56px]"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEmailCancel}
                                className="border-2 px-4 h-[56px]"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                                <p className="text-gray-800 text-lg font-medium">
                                  {formData.email || 'Chưa thiết lập'}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setIsEditingEmail(true)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-[56px]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                          <Phone className="h-5 w-5 text-green-600" />
                          Số điện thoại
                        </Label>
                        <div className="relative">
                          {isEditingPhone ? (
                            <div className="flex gap-2">
                              <Input
                                value={formData.phoneNumber || ''}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, ''); // chỉ giữ số
                                  setFormData({ ...formData, phoneNumber: value });
                                }}
                                maxLength={10} // giới hạn 10 ký tự
                                className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                                placeholder="0123456789"
                              />
                              <Button
                                size="sm"
                                onClick={handlePhoneSave}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 h-[56px]"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePhoneCancel}
                                className="border-2 px-4 h-[56px]"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                                <p className="text-gray-800 text-lg font-medium">
                                  {formData.phoneNumber || 'Chưa thiết lập'}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setIsEditingPhone(true)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-[56px]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="p-3 bg-orange-500 rounded-xl">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      Địa chỉ cửa hàng
                    </h3>
                    {addressError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm">{addressError}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tỉnh/Thành phố */}
                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-lg">
                          Tỉnh/Thành phố
                        </Label>
                        {isEditing ? (
                          <Select
                            value={
                              formData.state
                                ? getProvinceByName(formData.state)?.code.toString() || ''
                                : ''
                            }
                            onValueChange={(value) => handleAddressChange('state', value)}
                            disabled={addressLoading || provinces.length === 0}
                          >
                            <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]">
                              <SelectValue placeholder="Chọn tỉnh/thành phố">
                                {formData.state || 'Chọn tỉnh/thành phố'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={province.code.toString()}
                                  className="hover:bg-blue-50"
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                            <p className="text-gray-800 text-lg font-medium">
                              {formData.state || 'Chưa thiết lập'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-lg">Quận/Huyện</Label>
                        {isEditing ? (
                          <Select
                            value={
                              formData.district
                                ? getDistrictByName(formData.district)?.code.toString() || ''
                                : ''
                            }
                            onValueChange={(value) => handleAddressChange('district', value)}
                            disabled={addressLoading || districts.length === 0 || !formData.state}
                          >
                            <SelectTrigger
                              className={`border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px] ${!formData.state ? 'bg-gray-50 text-gray-400' : ''}`}
                            >
                              <SelectValue placeholder="Chọn quận/huyện">
                                {formData.district || 'Chọn quận/huyện'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {districts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.code.toString()}
                                  className="hover:bg-blue-50"
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                            <p className="text-gray-800 text-lg font-medium">
                              {formData.district || 'Chưa thiết lập'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-lg">Phường/Xã</Label>
                        {isEditing ? (
                          <Select
                            value={
                              formData.ward
                                ? getWardByName(formData.ward)?.code.toString() || ''
                                : ''
                            }
                            onValueChange={(value) => handleAddressChange('ward', value)}
                            disabled={addressLoading || wards.length === 0 || !formData.district}
                          >
                            <SelectTrigger
                              className={`border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px] ${!formData.district ? 'bg-gray-50 text-gray-400' : ''}`}
                            >
                              <SelectValue placeholder="Chọn phường/xã">
                                {formData.ward || 'Chọn phường/xã'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {wards.map((ward) => (
                                <SelectItem
                                  key={ward.code}
                                  value={ward.code.toString()}
                                  className="hover:bg-blue-50"
                                >
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                            <p className="text-gray-800 text-lg font-medium">
                              {formData.ward || 'Chưa thiết lập'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Địa chỉ cụ thể */}
                      <div className="space-y-3">
                        <Label className="text-gray-700 font-semibold text-lg">
                          Địa chỉ cụ thể
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.addressLine || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, addressLine: e.target.value })
                            }
                            className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                          />
                        ) : (
                          <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                            <p className="text-gray-800 text-lg font-medium">
                              {formData.addressLine || 'Chưa thiết lập'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Customer Profile View */
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Customer Profile Information */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <Card className="overflow-hidden shadow border bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
                      Hồ sơ khách hàng
                    </CardTitle>
                    <p className="text-sm sm:text-base text-blue-100">
                      Thông tin tài khoản khách hàng của bạn
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  {customerLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : customerError ? (
                    <div className="text-center py-12">
                      <div className="text-red-500 mb-4">
                        <X className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">Không thể tải thông tin khách hàng</p>
                        <p className="text-sm text-gray-500 mt-1">Vui lòng thử lại sau</p>
                      </div>
                    </div>
                  ) : customerProfile ? (
                    <div className="space-y-8">
                      {/* Profile Section */}
                      <div className="flex gap-8 items-start">
                        <div className="relative group">
                          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-8 ring-blue-100">
                            <AvatarImage src={customerProfile.avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-2xl font-bold">
                              {customerProfile.firstName?.charAt(0) ||
                                customerProfile.username?.charAt(0) ||
                                'C'}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1 space-y-4">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                              {customerProfile.firstName} {customerProfile.lastName}
                            </h2>
                            <p className="text-gray-600 text-lg">@{customerProfile.username}</p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                          <div className="p-3 bg-blue-500 rounded-xl">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          Thông tin cá nhân
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Email */}
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                              <Mail className="h-5 w-5 text-blue-600" />
                              Email
                            </Label>
                            <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                              <p className="text-gray-800 text-lg font-medium">
                                {customerProfile.email || 'Chưa thiết lập'}
                              </p>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                              <Phone className="h-5 w-5 text-green-600" />
                              Số điện thoại
                            </Label>
                            <div className="bg-white rounded-xl border border-gray-200 h-[56px] flex items-center px-4">
                              <p className="text-gray-800 text-lg font-medium">
                                {customerProfile.phone || 'Chưa thiết lập'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                          <div className="p-3 bg-green-500 rounded-xl">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          Địa chỉ
                        </h3>
                        <div className="space-y-3">
                          <Label className="text-gray-700 font-semibold text-lg">
                            Địa chỉ hiện tại
                          </Label>
                          <div className="bg-white rounded-xl border border-gray-200 min-h-[56px] flex items-center px-4 py-3">
                            <p className="text-gray-800 text-lg font-medium">
                              {customerProfile.address || 'Chưa thiết lập địa chỉ'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-500 mb-4">
                        <User className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">Chưa có thông tin khách hàng</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Thông tin sẽ hiển thị khi có dữ liệu
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
