'use client';

import {
  Bell,
  Check,
  Gift,
  Mail,
  MessageCircle,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  category: 'order' | 'promotional' | 'account' | 'social';
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  icon: React.ReactNode;
  enabled: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'order-updates',
    title: 'Cập nhật đơn hàng',
    description: 'Thông báo về trạng thái đơn hàng, giao hàng và xác nhận',
    category: 'order',
    channels: { email: true, push: true, sms: false },
    icon: <ShoppingBag className="w-5 h-5" />,
    enabled: true,
  },
  {
    id: 'delivery-notifications',
    title: 'Thông báo giao hàng',
    description: 'Cập nhật về thời gian giao hàng và trạng thái vận chuyển',
    category: 'order',
    channels: { email: true, push: true, sms: true },
    icon: <Package className="w-5 h-5" />,
    enabled: true,
  },
  {
    id: 'promotional-offers',
    title: 'Ưu đãi và khuyến mãi',
    description: 'Thông tin về giảm giá, voucher và chương trình đặc biệt',
    category: 'promotional',
    channels: { email: true, push: false, sms: false },
    icon: <Gift className="w-5 h-5" />,
    enabled: true,
  },
  {
    id: 'new-products',
    title: 'Sản phẩm mới',
    description: 'Thông báo về các sản phẩm mới được đăng bán',
    category: 'promotional',
    channels: { email: false, push: true, sms: false },
    icon: <Star className="w-5 h-5" />,
    enabled: false,
  },
  {
    id: 'account-security',
    title: 'Bảo mật tài khoản',
    description: 'Cảnh báo đăng nhập, thay đổi mật khẩu và hoạt động bảo mật',
    category: 'account',
    channels: { email: true, push: true, sms: true },
    icon: <Shield className="w-5 h-5" />,
    enabled: true,
  },
  {
    id: 'social-interactions',
    title: 'Tương tác xã hội',
    description: 'Tin nhắn, đánh giá và phản hồi từ người dùng khác',
    category: 'social',
    channels: { email: false, push: true, sms: false },
    icon: <MessageCircle className="w-5 h-5" />,
    enabled: true,
  },
];

const categories = {
  order: {
    name: 'Đơn hàng',
    color: 'bg-blue-100 text-blue-700',
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  promotional: {
    name: 'Khuyến mãi',
    color: 'bg-amber-100 text-amber-700',
    icon: <Gift className="w-4 h-4" />,
  },
  account: {
    name: 'Tài khoản',
    color: 'bg-green-100 text-green-700',
    icon: <Shield className="w-4 h-4" />,
  },
  social: {
    name: 'Xã hội',
    color: 'bg-purple-100 text-purple-700',
    icon: <MessageCircle className="w-4 h-4" />,
  },
};

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const toggleChannel = (id: string, channel: keyof NotificationSetting['channels']) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, channels: { ...setting.channels, [channel]: !setting.channels[channel] } }
          : setting,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const enabledCount = settings.filter((s) => s.enabled).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Cài đặt thông báo</h1>
                  <p className="text-orange-100 mt-1">
                    Quản lý cách bạn nhận thông báo từ chúng tôi
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">Đã bật</p>
                <p className="text-2xl font-bold">
                  {enabledCount}/{settings.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-2xl font-bold text-gray-800">
                  {settings.filter((s) => s.enabled && s.channels.email).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Push</p>
                <p className="text-2xl font-bold text-gray-800">
                  {settings.filter((s) => s.enabled && s.channels.push).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">SMS</p>
                <p className="text-2xl font-bold text-gray-800">
                  {settings.filter((s) => s.enabled && s.channels.sms).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {Object.entries(categories).map(([categoryKey, categoryInfo]) => {
            const categorySettings = settings.filter((s) => s.category === categoryKey);

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
                        {categorySettings.filter((s) => s.enabled).length} trên{' '}
                        {categorySettings.length} đã bật
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {categorySettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-all duration-200"
                    >
                      {/* Setting Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${setting.enabled ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {setting.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{setting.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSetting(setting.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                            setting.enabled ? 'bg-amber-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              setting.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Channel Options */}
                      {setting.enabled && (
                        <div className="pl-11 space-y-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Nhận thông báo qua:
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            {/* Email */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleChannel(setting.id, 'email')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                                  setting.channels.email
                                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-500'
                                }`}
                              >
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">Email</span>
                                {setting.channels.email ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            {/* Push */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleChannel(setting.id, 'push')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                                  setting.channels.push
                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-500'
                                }`}
                              >
                                <Smartphone className="w-4 h-4" />
                                <span className="text-sm">Push</span>
                                {setting.channels.push ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            {/* SMS */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleChannel(setting.id, 'sms')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                                  setting.channels.sms
                                    ? 'bg-green-50 border-green-300 text-green-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-500'
                                }`}
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">SMS</span>
                                {setting.channels.sms ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Settings className="w-5 h-5" />
                <span>Lưu cài đặt</span>
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 text-amber-800 px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Cài đặt đã được lưu thành công!</span>
          </div>
        )}
      </div>
    </div>
  );
}
