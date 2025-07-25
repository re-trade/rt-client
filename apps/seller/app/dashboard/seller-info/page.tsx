'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sellerApi, SellerProfileResponse, SellerProfileUpdateRequest } from '@/service/seller.api';
import { storageApi } from '@/service/storage.api';
import {
  Calendar,
  Check,
  Edit,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingCart,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Statisticals = {
  totalProducts: number;
  totalOrders: number;
  rating: number;
  status?: string;
};

export default function ShopInfoManagement() {
  const [sellerInfo, setSellerInfo] = useState<SellerProfileResponse>();
  const [formData, setFormData] = useState<SellerProfileResponse>();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [statisticals] = useState<Statisticals>({
    totalProducts: 160,
    totalOrders: 10,
    rating: 4.8,
    status: 'active',
  });

  useEffect(() => {
    (async () => {
      const response = await sellerApi.sellerInformation();
      setSellerInfo(response);
      setFormData(response);
    })();
  }, []);

  // Check if there are any changes
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

  const handleInputChange = (field: keyof SellerProfileResponse, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
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

    await sellerApi.updateSellerProfile(payload);
    const updated = { ...formData, avatarUrl, background };
    setSellerInfo(updated);
    setFormData(updated);
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
  };

  const handleEmailSave = async () => {
    if (!formData) return;

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

    await sellerApi.updateSellerProfile(payload);
    setSellerInfo(formData);
    setIsEditingEmail(false);
  };

  const handlePhoneSave = async () => {
    if (!formData) return;

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

    await sellerApi.updateSellerProfile(payload);
    setSellerInfo(formData);
    setIsEditingPhone(false);
  };

  const handleEmailCancel = () => {
    setFormData((prev) => (prev ? { ...prev, email: sellerInfo?.email } : prev));
    setIsEditingEmail(false);
  };

  const handlePhoneCancel = () => {
    setFormData((prev) => (prev ? { ...prev, phoneNumber: sellerInfo?.phoneNumber } : prev));
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
        return 'Không xác định';
    }
  };

  if (!formData || !sellerInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto" />
          <p className="text-gray-600 font-medium">Đang tải thông tin của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thông tin của bạn
            </h1>
            <p className="text-gray-600">Quản lý thông tin và thiết lập trang bán của bạn</p>
          </div>

          {/* Action Button */}
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 px-6 text-base font-semibold"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`${
                  hasChanges
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } transition-all duration-300 py-3 px-6 text-base font-semibold`}
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 py-3 px-6 text-base font-semibold"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy bỏ
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Statistics Sidebar */}
          <div className="xl:order-2 space-y-6">
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Star className="h-6 w-6" />
                  </div>
                  Thống kê tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-blue-700">Tổng sản phẩm</span>
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-900">
                            {statisticals.totalProducts}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-purple-700">Tổng đơn hàng</span>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-purple-600" />
                          <span className="text-2xl font-bold text-purple-900">
                            {statisticals.totalOrders}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border-l-4 border-amber-500 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-amber-700">Đánh giá</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                          <span className="text-2xl font-bold text-amber-900">
                            {statisticals.rating}/5.0
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 xl:order-1">
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
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
                          className="bg-white/95 hover:bg-white text-gray-800 shadow-xl backdrop-blur-sm border-0 px-6 py-3 font-semibold"
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
                <div className="flex gap-8 items-start">
                  <div className="relative group">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-8 ring-blue-100">
                        <AvatarImage
                          src={avatarFile ? URL.createObjectURL(avatarFile) : formData.avatarUrl}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                          {formData.shopName?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl rounded-full"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
                            <Upload className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="min-h-[60px] flex items-center">
                      {isEditing ? (
                        <Input
                          value={formData.shopName || ''}
                          onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                          className="text-3xl font-bold border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 h-[60px] text-3xl"
                          placeholder="Tên cửa hàng"
                        />
                      ) : (
                        <h2 className="text-4xl font-bold text-gray-800">
                          {formData.shopName || 'Chưa thiết lập'}
                        </h2>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {/* Rating */}
                      <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-amber-700">
                          {statisticals.rating}/5.0
                        </span>
                      </div>

                      {/* Join Date */}
                      <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-200 shadow-sm">
                        <Calendar className="h-5 w-5 text-sky-600" />
                        <span className="text-sm font-medium text-sky-800">
                          Tham gia {new Date(formData.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {/* Shop Status */}
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border-2 ${getStatusColor(
                          statisticals.status || '',
                        )}`}
                      >
                        <p
                          className={`px-3 py-1 text-sm font-semibold ${getStatusColor(
                            statisticals.status || '',
                          )}`}
                        >
                          {getStatusText(statisticals.status || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Mô tả cửa hàng
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[140px] max-h-[140px] h-[140px] border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg p-4 resize-none"
                      placeholder="Mô tả về cửa hàng của bạn..."
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-l-4 border-blue-500 shadow-inner min-h-[140px] flex items-start">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {formData.description || 'Chưa có mô tả'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    Thông tin liên hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Email */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Email
                      </Label>
                      <div className="relative">
                        {isEditingEmail ? (
                          <div className="flex gap-2">
                            <Input
                              value={formData.email || ''}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
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
                            <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
                              <p className="text-gray-800 text-lg font-medium">
                                {formData.email || 'Chưa thiết lập'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setIsEditingEmail(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[56px]"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Sửa
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
                              onChange={(e) =>
                                setFormData({ ...formData, phoneNumber: e.target.value })
                              }
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
                            <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
                              <p className="text-gray-800 text-lg font-medium">
                                {formData.phoneNumber || 'Chưa thiết lập'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setIsEditingPhone(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[56px]"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Sửa
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
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    Địa chỉ cửa hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-lg">Quận/Huyện</Label>
                      {isEditing ? (
                        <Input
                          value={formData.district || ''}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
                          <p className="text-gray-800 text-lg font-medium">
                            {formData.district || 'Chưa thiết lập'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-lg">Phường/Xã</Label>
                      {isEditing ? (
                        <Input
                          value={formData.ward || ''}
                          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                          className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
                          <p className="text-gray-800 text-lg font-medium">
                            {formData.ward || 'Chưa thiết lập'}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Tỉnh/Thành phố */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-lg">Tỉnh/Thành phố</Label>
                      {isEditing ? (
                        <Input
                          value={formData.state || ''}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
                          <p className="text-gray-800 text-lg font-medium">
                            {formData.state || 'Chưa thiết lập'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Địa chỉ cụ thể */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-lg">Địa chỉ cụ thể</Label>
                      {isEditing ? (
                        <Input
                          value={formData.addressLine || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, addressLine: e.target.value })
                          }
                          className="border-2 border-gray-300 focus:border-blue-500 transition-colors duration-300 text-lg h-[56px]"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 h-[56px] flex items-center px-4">
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
      </div>
    </div>
  );
}
