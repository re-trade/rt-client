'use client';

import ChangeEmailForm from '@/components/auth/ChangeEmailForm';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import ChangePhoneForm from '@/components/auth/ChangePhoneForm';
import ChangeUsernameForm from '@/components/auth/ChangeUsernameForm';
import TwoFactorSetup from '@/components/auth/TwoFactorSetup';
import { useAuth } from '@/hooks/use-auth';
import {
  changeEmailInternal,
  changePasswordInternal,
  changePhoneInternal,
  changeUsernameInternal,
} from '@/services/security.api';
import SecurityModal from '@components/common/SecurityModal';

import { checkUsernameAvailability } from '@services/auth.api';
import {
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Key,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Settings,
  Shield,
  Smartphone,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SecurityAction {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'dynamic';
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
    status: 'dynamic',
    action: 'Kích hoạt',
    icon: <Smartphone className="w-5 h-5" />,
    category: 'auth',
  },
  {
    id: 'username',
    title: 'Đổi tên đăng nhập',
    description: 'Đổi tên đăng nhập 1 lần duy nhất, đảm bảo an toàn cho tài khoản của bạn.',
    status: 'dynamic',
    action: 'Cập nhập',
    icon: <User className="w-5 h-5" />,
    category: 'account',
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
  const [modalState, setModalState] = useState({
    password: false,
    email: false,
    phone: false,
    username: false,
  });
  const { isAuth, account } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionStatus, setActionStatus] = useState<{
    success: boolean;
    message: string | null;
    type: 'password' | 'email' | 'phone' | 'username' | null;
  }>({
    success: false,
    message: null,
    type: null,
  });

  useEffect(() => {
    isAuth();
  }, [isAuth, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleActionClick = (action: SecurityAction) => {
    if (action.id === 'password') {
      setModalState((prev) => ({ ...prev, password: true }));
    } else if (action.id === 'email') {
      setModalState((prev) => ({ ...prev, email: true }));
    } else if (action.id === 'phone') {
      setModalState((prev) => ({ ...prev, phone: true }));
    } else if (action.id === '2fa') {
    } else if (action.id === 'username') {
      setModalState((prev) => ({ ...prev, username: true }));
    }
  };

  const handleTwoFactorSuccess = () => {
    handleRefresh();
  };

  const handlePasswordSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const success = await changePasswordInternal({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (success) {
        setActionStatus({
          success: true,
          message: 'Đã thay đổi mật khẩu thành công!',
          type: 'password',
        });

        setTimeout(() => {
          setModalState((prev) => ({ ...prev, password: false }));
          setActionStatus({ success: false, message: null, type: null });
          handleRefresh();
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        setActionStatus({
          success: false,
          message: error.message,
          type: 'password',
        });
      }
      return false;
    }
  };

  const handleEmailSubmit = async (values: {
    currentEmail: string;
    newEmail: string;
    password: string;
  }) => {
    try {
      const success = await changeEmailInternal({
        newEmail: values.newEmail,
        passwordConfirm: values.password,
      });

      if (success) {
        setActionStatus({
          success: true,
          message: 'Đã thay đổi email thành công!',
          type: 'email',
        });

        setTimeout(() => {
          setModalState((prev) => ({ ...prev, email: false }));
          setActionStatus({ success: false, message: null, type: null });
          handleRefresh();
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        setActionStatus({
          success: false,
          message: error.message,
          type: 'email',
        });
      }
      return false;
    }
  };

  const handlePhoneSubmit = async (values: {
    currentPhone: string;
    newPhone: string;
    password: string;
  }) => {
    try {
      const success = await changePhoneInternal({
        newPhone: values.newPhone,
        passwordConfirm: values.password,
      });

      if (success) {
        setActionStatus({
          success: true,
          message: 'Đã thay đổi số điện thoại thành công!',
          type: 'phone',
        });

        setTimeout(() => {
          setModalState((prev) => ({ ...prev, phone: false }));
          setActionStatus({ success: false, message: null, type: null });
          handleRefresh();
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        setActionStatus({
          success: false,
          message: error.message,
          type: 'phone',
        });
      }
      return false;
    }
  };

  const handleUsernameSubmit = async (values: {
    currentUsername: string;
    newUsername: string;
    password: string;
  }) => {
    try {
      const success = await changeUsernameInternal({
        username: values.newUsername,
        passwordConfirm: values.password,
      });

      if (success) {
        setActionStatus({
          success: true,
          message: 'Đã thay đổi số điện thoại thành công!',
          type: 'phone',
        });

        setTimeout(() => {
          setModalState((prev) => ({ ...prev, phone: false }));
          setActionStatus({ success: false, message: null, type: null });
          handleRefresh();
        }, 2000);

        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        setActionStatus({
          success: false,
          message: error.message,
          type: 'phone',
        });
      }
      return false;
    }
  };

  const getStatusBadge = (status: SecurityAction['status'], actionId?: string) => {
    let effectiveStatus = status;
    if (actionId === '2fa' && account) {
      effectiveStatus = account.using2FA ? 'active' : 'inactive';
    }

    switch (effectiveStatus) {
      case 'active':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Đã kích hoạt</span>
            <span className="sm:hidden">Hoạt động</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Chưa kích hoạt</span>
            <span className="sm:hidden">Tắt</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Đang xử lý</span>
            <span className="sm:hidden">Xử lý</span>
          </div>
        );
      default:
        return null;
    }
  };

  const activeSecurityCount = securityActions.filter((action) => action.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
        <SecurityModal
          isOpen={modalState.password}
          onClose={() => setModalState((prev) => ({ ...prev, password: false }))}
          title="Đổi mật khẩu"
          isLoading={actionStatus.type === 'password' && actionStatus.success}
          status={
            actionStatus.type === 'password' ? (actionStatus.success ? 'success' : 'error') : null
          }
          statusMessage={
            actionStatus.type === 'password' && actionStatus.message
              ? actionStatus.message
              : undefined
          }
        >
          <ChangePasswordForm
            onSubmit={handlePasswordSubmit}
            onCancel={() => setModalState((prev) => ({ ...prev, password: false }))}
          />
        </SecurityModal>

        <SecurityModal
          isOpen={modalState.email}
          onClose={() => setModalState((prev) => ({ ...prev, email: false }))}
          title="Đổi email"
          isLoading={actionStatus.type === 'email' && actionStatus.success}
          status={
            actionStatus.type === 'email' ? (actionStatus.success ? 'success' : 'error') : null
          }
          statusMessage={
            actionStatus.type === 'email' && actionStatus.message ? actionStatus.message : undefined
          }
        >
          <ChangeEmailForm
            currentEmail={account?.email || ''}
            onSubmit={handleEmailSubmit}
            onCancel={() => setModalState((prev) => ({ ...prev, email: false }))}
          />
        </SecurityModal>

        <SecurityModal
          isOpen={modalState.phone}
          onClose={() => setModalState((prev) => ({ ...prev, phone: false }))}
          title="Đổi số điện thoại"
          isLoading={actionStatus.type === 'phone' && actionStatus.success}
          status={
            actionStatus.type === 'phone' ? (actionStatus.success ? 'success' : 'error') : null
          }
          statusMessage={
            actionStatus.type === 'phone' && actionStatus.message ? actionStatus.message : undefined
          }
        >
          <ChangePhoneForm
            currentPhone={account?.phone || ''}
            onSubmit={handlePhoneSubmit}
            onCancel={() => setModalState((prev) => ({ ...prev, phone: false }))}
          />
        </SecurityModal>

        <SecurityModal
          isOpen={modalState.username}
          onClose={() => setModalState((prev) => ({ ...prev, username: false }))}
          title="Đổi tên đăng nhập"
          isLoading={actionStatus.type === 'username' && actionStatus.success}
          status={
            actionStatus.type === 'username' ? (actionStatus.success ? 'success' : 'error') : null
          }
          statusMessage={
            actionStatus.type === 'username' && actionStatus.message
              ? actionStatus.message
              : undefined
          }
        >
          <ChangeUsernameForm
            currentUsername={account?.username || ''}
            onSubmit={handleUsernameSubmit}
            hasChangedUsername={account?.changedUsername}
            checkUsernameAvailability={checkUsernameAvailability}
            onCancel={() => setModalState((prev) => ({ ...prev, username: false }))}
          />
        </SecurityModal>

        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-4 sm:p-6 text-[#121212]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg shadow-sm">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Bảo mật tài khoản</h1>
                  <p className="text-[#121212] mt-1 opacity-80 text-sm sm:text-base">
                    Quản lý bảo mật và quyền riêng tư của tài khoản
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right bg-white/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm">
                <p className="text-xs sm:text-sm text-[#8B4513] font-medium">Bảo mật</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {activeSecurityCount}/{securityActions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20 hover:border-[#FFD2B2] transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Mức bảo mật</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">Cao</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-amber-100 rounded-xl">
                <Key className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Đã kích hoạt</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {activeSecurityCount} tính năng
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Thiết bị</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">3 hoạt động</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Cảnh báo</p>
                <p className="text-base sm:text-lg font-bold text-gray-800">0 vấn đề</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
              const categoryActions = securityActions.filter(
                (action) => action.category === categoryKey,
              );

              return (
                <div
                  key={categoryKey}
                  className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                        {categoryInfo.icon}
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                          {categoryInfo.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {categoryActions.filter((a) => a.status === 'active').length} trên{' '}
                          {categoryActions.length} đã kích hoạt
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {categoryActions.map((action) => (
                      <div
                        key={action.id}
                        className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-[#FFD2B2] hover:shadow-md transition-all duration-200 bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                            <div
                              className={`p-2 sm:p-3 rounded-xl shadow-sm ${
                                action.status === 'active'
                                  ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600'
                                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400'
                              }`}
                            >
                              {action.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-1">
                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  {action.title}
                                </h3>
                                {getStatusBadge(action.status, action.id)}
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                {action.description}
                              </p>
                              {action.lastUpdated && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Cập nhật cuối: {action.lastUpdated}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-start sm:justify-end">
                            {action.id === '2fa' ? (
                              <TwoFactorSetup onSuccess={handleTwoFactorSuccess} />
                            ) : (
                              <button
                                onClick={() => handleActionClick(action)}
                                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shadow-sm ${
                                  action.status === 'active'
                                    ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                                }`}
                              >
                                {action.action}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
                  Hoạt động gần đây
                </h2>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-l-4 border-amber-200 pl-3 sm:pl-4 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-800">
                            {activity.action}
                          </p>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{activity.location}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Monitor className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{activity.device}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 ${
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

                <button className="w-full mt-4 sm:mt-6 text-xs sm:text-sm text-amber-600 hover:text-amber-700 font-medium py-2 px-4 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                  Xem tất cả hoạt động
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
