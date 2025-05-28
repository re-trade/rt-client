'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ShopInfo {
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  businessLicense: string;
  taxCode: string;
  bankAccount: string;
  bankName: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  joinDate: string;
  status: 'active' | 'pending' | 'suspended';
}

const mockShopInfo: ShopInfo = {
  name: 'Shop Thời Trang ABC',
  description:
    'Chuyên cung cấp các sản phẩm thời trang chất lượng cao với giá cả hợp lý. Cam kết mang đến cho khách hàng những trải nghiệm mua sắm tuyệt vời nhất.',
  logo: '/placeholder.svg?height=100&width=100',
  coverImage: '/placeholder.svg?height=200&width=400',
  email: 'shop@example.com',
  phone: '0123456789',
  address: '123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh',
  website: 'https://shop-abc.com',
  businessLicense: '0123456789',
  taxCode: '0123456789',
  bankAccount: '1234567890',
  bankName: 'Ngân hàng ABC',
  rating: 4.8,
  totalProducts: 150,
  totalOrders: 1250,
  joinDate: '2023-01-15',
  status: 'active',
};

export default function ShopInfoManagement() {
  const [shopInfo, setShopInfo] = useState<ShopInfo>(mockShopInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(shopInfo);

  const handleEdit = () => {
    setFormData(shopInfo);
    setIsEditing(true);
  };

  const handleSave = () => {
    setShopInfo(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(shopInfo);
    setIsEditing(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Thông tin shop</h2>
          <p className="text-muted-foreground">Quản lý thông tin cửa hàng của bạn</p>
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
        {/* Shop Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Image */}
            <div>
              <Label>Ảnh bìa shop</Label>
              <div className="mt-2 relative">
                <Image
                  src={isEditing ? formData.coverImage : shopInfo.coverImage}
                  alt="Cover"
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {isEditing && (
                  <Button size="sm" className="absolute top-2 right-2" variant="secondary">
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Logo and Basic Info */}
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={isEditing ? formData.logo : shopInfo.logo} />
                  <AvatarFallback>Shop</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-6 w-6 p-0"
                    variant="secondary"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-lg font-semibold"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{shopInfo.name}</h3>
                )}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(shopInfo.status)}>
                    {getStatusText(shopInfo.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">⭐ {shopInfo.rating}/5.0</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Mô tả shop</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">{shopInfo.description}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.email}</p>
                )}
              </div>
              <div>
                <Label>Số điện thoại</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Địa chỉ</Label>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.address}</p>
                )}
              </div>
              <div>
                <Label>Website</Label>
                {isEditing ? (
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.website}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Business Info */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng sản phẩm</span>
                <span className="font-medium">{shopInfo.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng đơn hàng</span>
                <span className="font-medium">{shopInfo.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Đánh giá</span>
                <span className="font-medium">⭐ {shopInfo.rating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngày tham gia</span>
                <span className="font-medium">
                  {new Date(shopInfo.joinDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin kinh doanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Giấy phép kinh doanh</Label>
                {isEditing ? (
                  <Input
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.businessLicense}</p>
                )}
              </div>
              <div>
                <Label>Mã số thuế</Label>
                {isEditing ? (
                  <Input
                    value={formData.taxCode}
                    onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.taxCode}</p>
                )}
              </div>
              <div>
                <Label>Số tài khoản</Label>
                {isEditing ? (
                  <Input
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.bankAccount}</p>
                )}
              </div>
              <div>
                <Label>Ngân hàng</Label>
                {isEditing ? (
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-sm">{shopInfo.bankName}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
