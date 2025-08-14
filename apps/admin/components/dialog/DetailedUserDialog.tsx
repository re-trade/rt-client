'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Ban,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Shield,
  Store,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';

import type { DetailedAccountResponse } from '@/services/account.api';
import { getRoleDisplayName, hasRole } from '@/services/account.api';

interface DetailedUserDialogProps {
  user: DetailedAccountResponse;
  onToggleBan: (userId: string, currentStatus: string, banType?: 'account' | 'seller') => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailedUserDialog({
  user,
  onToggleBan,
  open,
  onOpenChange,
}: DetailedUserDialogProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${timeStr} ${dateStr}`;
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return 'Nam';
      case 1:
        return 'Nữ';
      case 2:
        return 'Khác';
      default:
        return 'Không xác định';
    }
  };

  const getVerificationStatus = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return { text: 'Đã xác minh', color: 'bg-green-100 text-green-800' };
      case 'PENDING':
        return { text: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' };
      case 'REJECTED':
        return { text: 'Bị từ chối', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Chưa xác minh', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[98vw] w-[98vw] max-h-[85vh] overflow-hidden p-0 bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl flex flex-col"
        style={{ minWidth: '1200px' }}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-4 pb-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="h-5 w-5" />
              </div>
              Chi tiết người dùng
            </DialogTitle>
            <DialogDescription className="text-orange-100 mt-1 text-sm">
              Thông tin chi tiết về tài khoản và hồ sơ người dùng trong hệ thống
            </DialogDescription>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full"></div>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto px-6 py-3"
          style={{ maxHeight: 'calc(85vh - 180px)' }}
        >
          <div className="space-y-3">
            {/* Account Information Section */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
              <div className="px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  Thông tin tài khoản
                </h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Username Column */}
                  <div className="group">
                    <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-600">Tên đăng nhập</p>
                      </div>
                      <p className="text-base font-semibold text-slate-900">{user.username}</p>
                    </div>
                  </div>

                  {/* Email Column */}
                  <div className="group">
                    <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
                          <Mail className="h-3 w-3 text-blue-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-600">Email</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 break-all">{user.email}</p>
                    </div>
                  </div>

                  {/* Join Date Column */}
                  <div className="group">
                    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-600">Ngày tham gia</p>
                      </div>
                      <p className="text-base font-semibold text-slate-900">
                        {formatDate(user.joinInDate)}
                      </p>
                    </div>
                  </div>

                  {/* Last Login Column */}
                  <div className="group">
                    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-600">Đăng nhập cuối</p>
                      </div>
                      <p className="text-base font-semibold text-slate-900">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                      </p>
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="group">
                    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                          {user.enabled ? (
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-600">Trạng thái</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.enabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-semibold">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">
                            Bị cấm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Security & Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {/* Security Info */}
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                    <p className="text-sm font-medium text-slate-600 mb-3">Bảo mật tài khoản</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Khóa TK</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {user.locked ? 'Có' : 'Không'}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">2FA</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.using2FA
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.using2FA ? 'Bật' : 'Tắt'}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Đổi tên</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            user.changedUsername
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.changedUsername ? 'Có' : 'Không'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <p className="text-sm font-medium text-orange-800 mb-3">Vai trò hệ thống</p>
                    <div className="flex flex-wrap gap-2">
                      {user.locked ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-semibold shadow-sm border border-red-200">
                          <Ban className="h-3 w-3" />
                          <span>Vai trò tạm thời không khả dụng (Tài khoản bị cấm)</span>
                        </div>
                      ) : (
                        <>
                          {(user.roles || []).map((role, index) => (
                            <div
                              key={typeof role === 'string' ? role : `role-${index}`}
                              className="flex items-center gap-1 px-3 py-1 bg-white/80 text-orange-800 rounded-lg text-sm font-semibold shadow-sm border border-orange-200"
                            >
                              {hasRole([role], 'ROLE_ADMIN') && <Shield className="h-3 w-3" />}
                              <span>{getRoleDisplayName(role)}</span>
                            </div>
                          ))}
                          {(!user.roles || user.roles.length === 0) && (
                            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                              Chưa được phân quyền
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Account ID */}
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-800 mb-2">ID Tài khoản</p>
                    <p className="text-xs font-mono text-indigo-700 bg-white/60 px-2 py-1 rounded break-all">
                      {user.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Profile Section */}
            {user.customerProfile && (
              <div className="bg-white rounded-xl shadow-md border-2 border-blue-300 overflow-hidden">
                <div className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-b-2 border-blue-300">
                  <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    Hồ sơ khách hàng
                  </h3>
                </div>
                <div className="p-3">
                  {/* First Row - Main Information (without address) */}
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {/* Name Column */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-xs font-medium text-blue-700">Họ và tên</p>
                        </div>
                        <p className="text-base font-semibold text-blue-900">
                          {user.customerProfile.firstName} {user.customerProfile.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Phone Column */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Phone className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-xs font-medium text-blue-700">Số điện thoại</p>
                        </div>
                        <p className="text-base font-semibold text-blue-900">
                          {user.customerProfile.phone || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>

                    {/* Gender Column */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 h-full">
                        <p className="text-xs font-medium text-blue-700 mb-2">Giới tính</p>
                        <p className="text-base font-semibold text-blue-900">
                          {getGenderText(user.customerProfile.gender)}
                        </p>
                      </div>
                    </div>

                    {/* Last Update Column */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 h-full">
                        <p className="text-xs font-medium text-orange-700 mb-2">Cập nhật cuối</p>
                        <p className="text-sm font-semibold text-orange-800">
                          {formatDate(user.customerProfile.lastUpdate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second Row - Address (Full Width) */}
                  <div className="group">
                    <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-xs font-medium text-blue-700">Địa chỉ đầy đủ</p>
                      </div>
                      <p className="text-base font-semibold text-blue-900 leading-relaxed">
                        {user.customerProfile.address || 'Chưa cập nhật địa chỉ'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seller Profile Section */}
            {user.sellerProfile && (
              <div className="bg-white rounded-xl shadow-md border-2 border-emerald-300 overflow-hidden">
                <div className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-emerald-50 border-b-2 border-emerald-300">
                  <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Store className="h-5 w-5 text-emerald-600" />
                    </div>
                    Hồ sơ người bán
                  </h3>
                </div>
                <div className="p-3">
                  {/* First Row - Main Information */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
                    {/* Shop Name */}
                    <div className="group lg:col-span-2">
                      <div className="flex flex-col gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                            <Store className="h-4 w-4 text-emerald-600" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Tên cửa hàng</p>
                        </div>
                        <p className="text-base font-semibold text-emerald-900">
                          {user.sellerProfile.shopName}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Phone className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Điện thoại</p>
                        </div>
                        <p className="text-base font-semibold text-emerald-900">
                          {user.sellerProfile.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="group lg:col-span-2">
                      <div className="flex flex-col gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Địa chỉ</p>
                        </div>
                        <p className="text-base font-semibold text-emerald-900">
                          {user.sellerProfile.addressLine}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {user.sellerProfile.ward}, {user.sellerProfile.district},{' '}
                          {user.sellerProfile.state}
                        </p>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Ngày tạo</p>
                        </div>
                        <p className="text-base font-semibold text-emerald-900">
                          {formatDate(user.sellerProfile.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Updated Date */}
                    <div className="group">
                      <div className="flex flex-col gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <Calendar className="h-4 w-4 text-orange-600" />
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Cập nhật</p>
                        </div>
                        <p className="text-base font-semibold text-emerald-900">
                          {formatDate(user.sellerProfile.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second Row - Status */}
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Verification Status */}
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <p className="text-sm font-medium text-emerald-700 mb-3">
                        Trạng thái xác minh
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold shadow-sm text-sm ${getVerificationStatus(user.sellerProfile.identityVerifiedStatus).color}`}
                        >
                          {getVerificationStatus(user.sellerProfile.identityVerifiedStatus).text}
                        </span>
                      </div>
                    </div>

                    {/* Overall Verification Status */}
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">Xác minh tổng thể</p>
                      <p className="text-sm font-semibold text-slate-600">
                        {user.sellerProfile.verified ? '✅ Đã xác minh' : '⏳ Chưa xác minh'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 px-8 py-3 bg-gradient-to-r from-slate-50 to-white border-t-2 border-slate-300">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="h-3 w-3" />
                <span>ID: {user.id.slice(0, 8)}...</span>
              </div>
              {user.customerProfile && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <User className="h-3 w-3" />
                  <span>Khách hàng</span>
                </div>
              )}
              {user.sellerProfile && (
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <Store className="h-3 w-3" />
                  <span>Người bán</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Đóng
              </Button>

              {/* Enhanced Ban/Unban Options */}
              <div className="flex items-center gap-3">
                {/* Account Ban/Unban Button */}
                <Button
                  variant={user.locked ? 'default' : 'destructive'}
                  onClick={() => {
                    onToggleBan(user.id, user.locked ? 'banned' : 'active', 'account');
                    onOpenChange(false);
                  }}
                  className={`flex items-center gap-2 px-6 py-2 font-semibold transition-all duration-200 ${
                    user.locked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Ban className="h-4 w-4" />
                  {user.locked ? 'Bỏ cấm tài khoản' : 'Cấm tài khoản'}
                </Button>

                {/* Seller Ban/Unban Button - Only show if user has ROLE_SELLER */}
                {hasRole(user.roles || [], 'ROLE_SELLER') && (
                  <Button
                    variant={user.sellerProfile?.verified === false ? 'default' : 'destructive'}
                    onClick={() => {
                      const isSellerBanned = user.sellerProfile?.verified === false;
                      onToggleBan(user.id, isSellerBanned ? 'banned' : 'active', 'seller');
                      onOpenChange(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-2 font-semibold transition-all duration-200 ${
                      user.sellerProfile?.verified === false
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    {user.sellerProfile?.verified === false ? 'Bỏ cấm người bán' : 'Cấm người bán'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
