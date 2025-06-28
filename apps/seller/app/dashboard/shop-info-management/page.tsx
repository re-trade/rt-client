'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sellerApi, SellerProfileResponse, SellerProfileUpdateRequest } from '@/service/seller.api';
import { storageApi } from '@/service/storage.api';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
} from '@tabler/icons-react';
import { Edit, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [statisticals, setStatisticals] = useState<Statisticals>({
    totalProducts: 160,
    totalOrders: 10,
    rating: 4.8,
    status: 'active',
  });
  const fetchShopInfo = async () => {
    const response = await sellerApi.sellerInformation();
    setSellerInfo(response);
    setFormData(response);
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(sellerInfo);
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    let avatarUrl = formData.avatarUrl;
    let background = formData.background;

    // Upload new avatar if selected
    if (avatarFile) {
      avatarUrl = await storageApi.fileUpload(avatarFile);
    }

    // Upload new background if selected
    if (backgroundFile) {
      background = await storageApi.fileUpload(backgroundFile);
    }

    const updatePayload: SellerProfileUpdateRequest = {
      shopName: formData.shopName || '',
      avatarUrl: avatarUrl || '',
      background: background || '',
      description: formData.description || '',
      addressLine: formData.addressLine || '',
      district: formData.district || '',
      ward: formData.ward || '',
      state: formData.state || '',
      email: formData.email || '',
      phoneNumber: formData.phoneNumber || '',
    };

    await sellerApi.updateSellerProfile(updatePayload);
    console.log('Cập nhật thông tin shop thành công:', updatePayload);
    setSellerInfo({ ...formData, avatarUrl, background });
    setAvatarFile(null);
    setBackgroundFile(null);
    setIsEditing(false);
    await fetchShopInfo();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (!formData || !sellerInfo) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Thông tin shop</h2>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin cơ bản */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ảnh bìa */}
            <div>
              <div className="mt-2 relative">
                <Image
                  src={
                    backgroundFile
                      ? URL.createObjectURL(backgroundFile)
                      : formData.background || '/placeholder.svg'
                  }
                  alt="Cover"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {isEditing && (
                  <div className="absolute top-2 right-2">
                    <Input
                      id="background-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundChange}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => document.getElementById('background-upload')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Logo và thông tin chính */}
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : formData.avatarUrl || '/placeholder.svg'
                    }
                  />
                  <AvatarFallback>Shop</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      className="h-6 w-6 p-0"
                      variant="secondary"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <Input
                    value={formData.shopName || ''}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="text-lg font-semibold"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{formData.shopName || 'Chưa thiết lập'}</h3>
                )}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(statisticals.status)}>
                    {getStatusText(statisticals.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ⭐ {statisticals.rating}/5.0
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <Label>Mô tả shop</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  {formData.description || 'Chưa thiết lập'}
                </p>
              )}
            </div>

            {/* Liên hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.email || 'Chưa thiết lập'}</p>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.phoneNumber || 'Chưa thiết lập'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <CardTitle>Thông tin địa chỉ</CardTitle>
              </div>
              <div>
                <Label>Quận</Label>
                {isEditing ? (
                  <Input
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.district || 'Chưa thiết lập'}</p>
                )}
              </div>
              <div>
                <Label>Phường</Label>
                {isEditing ? (
                  <Input
                    value={formData.ward || ''}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.ward || 'Chưa thiết lập'}</p>
                )}
              </div>
              <div>
                <Label>Tỉnh/Thành phố</Label>
                {isEditing ? (
                  <Input
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.state || 'Chưa thiết lập'}</p>
                )}
              </div>
              <div>
                <Label>Địa chỉ cụ thể</Label>
                {isEditing ? (
                  <Input
                    value={formData.addressLine || ''}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{formData.addressLine || 'Chưa thiết lập'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê & Thông tin kinh doanh */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng sản phẩm</span>
                <span className="font-medium">{statisticals.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng đơn hàng</span>
                <span className="font-medium">{statisticals.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Đánh giá</span>
                <span className="font-medium">⭐ {statisticals.rating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngày tham gia</span>
                <span className="font-medium">
                  {new Date(formData.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mạng xã hội</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: 'facebook',
                  icon: IconBrandFacebook,
                  color: 'bg-blue-600',
                  name: 'Facebook',
                },
                {
                  key: 'instagram',
                  icon: IconBrandInstagram,
                  color: 'bg-pink-600',
                  name: 'Instagram',
                },
                { key: 'youtube', icon: IconBrandYoutube, color: 'bg-red-600', name: 'YouTube' },
                { key: 'tiktok', icon: IconBrandTiktok, color: 'bg-black', name: 'TikTok' },
                {
                  key: 'zalo',
                  iconPath: '/icon_zalo.png',
                  color: 'bg-blue-500',
                  name: 'Zalo',
                  isImage: true,
                },
              ].map(({ key, icon: Icon, iconPath, color, name, isImage }) => (
                <div key={key} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center border-2 border-orange-200 rounded-lg ${isImage ? '' : 'text-white'} ${color}`}
                  >
                    {isImage ? (
                      <Image src={iconPath!} alt={name} width={20} height={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label className="block mb-1">{name}</Label>
                    {isEditing ? (
                      <Input
                        value={(formData as any)[key] ?? ''}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {(formData as any)[key]?.trim() || 'Chưa thiết lập'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
