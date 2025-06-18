'use client';

import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Settings,
  Shield,
  Smartphone,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface SecurityAction {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated?: string;
  action: string;
  icon: React.ReactNode;
  category: 'auth' | 'account' | 'social';
}

const securityActions: SecurityAction[] = [
  {
    id: 'password',
    title: 'Đổi mật khẩu',
    description: 'Thay đổi mật khẩu tài khoản của bạn để bảo mật hơn.',
    status: 'active',
    lastUpdated: '2 tháng trước',
    action: 'Thay đổi',
    icon: <Lock className="w-5 h-5" />,
    category: 'auth',
  },
  {
    id: 'email',
    title: 'Đổi email',
    description: 'Cập nhật địa chỉ email chính của bạn.',
    status: 'active',
    lastUpdated: '6 tháng trước',
    action: 'Cập nhật',
    icon: <Mail className="w-5 h-5" />,
    category: 'account',
  },
  {
    id: 'phone',
    title: 'Đổi số điện thoại',
    description: 'Cập nhật số điện thoại dùng để xác thực và liên hệ.',
    status: 'active',
    lastUpdated: '1 tháng trước',
    action: 'Cập nhật',
    icon: <Phone className="w-5 h-5" />,
    category: 'account',
  },
  {
    id: '2fa',
    title: 'Xác thực hai yếu tố (2FA)',
    description: 'Bật xác thực hai yếu tố để bảo vệ tài khoản của bạn.',
    status: 'inactive',
    action: 'Kích hoạt',
    icon: <Smartphone className="w-5 h-5" />,
    category: 'auth',
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'Đăng nhập thành công',
    location: 'Hồ Chí Minh, Việt Nam',
    device: 'Chrome on Windows',
    time: '2 giờ trước',
    ip: '192.168.1.1',
    status: 'success',
  },
  {
    id: 2,
    action: 'Đăng nhập thành công',
    location: 'Hà Nội, Việt Nam',
    device: 'Safari on iPhone',
    time: '1 ngày trước',
    ip: '192.168.1.2',
    status: 'success',
  },
  {
    id: 3,
    action: 'Thay đổi mật khẩu',
    location: 'Hồ Chí Minh, Việt Nam',
    device: 'Chrome on Windows',
    time: '2 tuần trước',
    ip: '192.168.1.1',
    status: 'warning',
  },
];

const categories = {
  auth: {
    name: 'Xác thực',
    color: 'bg-red-100 text-red-700',
    icon: <Shield className="w-4 h-4" />,
  },
  account: {
    name: 'Tài khoản',
    color: 'bg-blue-100 text-blue-700',
    icon: <Settings className="w-4 h-4" />,
  },
};

export default function SecurityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<SecurityAction | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleActionClick = (action: SecurityAction) => {
    if (action.id === 'password') {
      setSelectedAction(action);
      setIsModalOpen(true);
    } else {
      alert(`${action.action}: ${action.title}`);
    }
  };

  const handlePasswordChange = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    // Handle password change logic
    alert('Đã thay đổi mật khẩu thành công');
    setIsModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const getStatusBadge = (status: SecurityAction['status']) => {
    switch (status) {
      case 'active':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Đã kích hoạt
          </div>
        );
      case 'inactive':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            Chưa kích hoạt
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </div>
        );
      default:
        return null;
    }
  };

  const activeSecurityCount = securityActions.filter((action) => action.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Bảo mật tài khoản</h1>
                  <p className="text-[#121212] mt-1">
                    Quản lý bảo mật và quyền riêng tư của tài khoản
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">Bảo mật</p>
                <p className="text-2xl font-bold">
                  {activeSecurityCount}/{securityActions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mức bảo mật</p>
                <p className="text-lg font-bold text-gray-800">Cao</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Key className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã kích hoạt</p>
                <p className="text-lg font-bold text-gray-800">{activeSecurityCount} tính năng</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thiết bị</p>
                <p className="text-lg font-bold text-gray-800">3 hoạt động</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cảnh báo</p>
                <p className="text-lg font-bold text-gray-800">0 vấn đề</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
              const categoryActions = securityActions.filter(
                (action) => action.category === categoryKey,
              );

              return (
                <div
                  key={categoryKey}
                  className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                        {categoryInfo.icon}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{categoryInfo.name}</h2>
                        <p className="text-sm text-gray-600">
                          {categoryActions.filter((a) => a.status === 'active').length} trên{' '}
                          {categoryActions.length} đã kích hoạt
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {categoryActions.map((action) => (
                      <div
                        key={action.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-3 rounded-xl ${action.status === 'active' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}
                            >
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <h3 className="font-semibold text-gray-800">{action.title}</h3>
                                {getStatusBadge(action.status)}
                              </div>
                              <p className="text-sm text-gray-600">{action.description}</p>
                              {action.lastUpdated && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Cập nhật cuối: {action.lastUpdated}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleActionClick(action)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              action.status === 'active'
                                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {action.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-amber-600" />
                  Hoạt động gần đây
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-l-4 border-amber-200 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Monitor className="w-3 h-3 mr-1" />
                              <span>{activity.device}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.status === 'success'
                              ? 'bg-green-400'
                              : activity.status === 'warning'
                                ? 'bg-yellow-400'
                                : 'bg-red-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Xem tất cả hoạt động
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {isModalOpen && selectedAction?.id === 'password' && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Thay đổi mật khẩu</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all pr-10"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition-all"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
