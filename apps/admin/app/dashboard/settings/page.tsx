'use client';

import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Bell,
  CreditCard,
  Database,
  FileText,
  Globe,
  Mail,
  Shield,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Sample data
const languages = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

const timezones = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (GMT+7)' },
  { value: 'UTC', label: 'UTC (GMT+0)' },
];

const currencies = [
  { value: 'VND', label: 'Việt Nam Đồng (₫)' },
  { value: 'USD', label: 'US Dollar ($)' },
];

const paymentGateways = [
  { id: 1, name: 'Momo', status: 'active', config: { apiKey: '***', secret: '***' } },
  { id: 2, name: 'VNPay', status: 'active', config: { apiKey: '***', secret: '***' } },
  { id: 3, name: 'PayOS', status: 'inactive', config: { apiKey: '***', secret: '***' } },
  { id: 4, name: 'Stripe', status: 'inactive', config: { apiKey: '***', secret: '***' } },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [systemName, setSystemName] = useState('ReTrade');
  const [language, setLanguage] = useState('vi');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [currency, setCurrency] = useState('VND');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    username: 'system@retrade.com',
    password: '********',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 30,
    ipVerification: true,
    newDeviceLogin: false,
  });
  const [sales, setSales] = useState({
    defaultShippingFee: 30000,
    allowOrderCancellation: true,
    autoConfirmTime: 24,
  });
  const [users, setUsers] = useState({
    defaultRole: 'customer',
    requireEmailVerification: true,
    requirePhoneVerification: true,
    allowEmailChange: false,
    allowPhoneChange: false,
  });
  const [backup, setBackup] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupPath: '/backups',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <Button>
          <Database className="mr-2 h-4 w-4" />
          Sao lưu cấu hình
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            Cài đặt chung
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán
          </TabsTrigger>
          <TabsTrigger value="sales">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Bán hàng
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Người dùng
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="mr-2 h-4 w-4" />
            Sao lưu
          </TabsTrigger>
          <TabsTrigger value="policies">
            <FileText className="mr-2 h-4 w-4" />
            Chính sách
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label>Tên hệ thống</label>
                <Input
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder="Nhập tên hệ thống"
                />
              </div>
              <div className="grid gap-2">
                <label>Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 border rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Logo</span>
                  </div>
                  <Button variant="outline">Thay đổi</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <label>Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border rounded flex items-center justify-center">
                    <span className="text-muted-foreground">F</span>
                  </div>
                  <Button variant="outline">Thay đổi</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cài đặt hiển thị</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label>Ngôn ngữ mặc định</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Múi giờ</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Đơn vị tiền tệ</label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trạng thái hệ thống</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chế độ bảo trì</p>
                <p className="text-sm text-muted-foreground">
                  Khi bật, hệ thống sẽ hiển thị thông báo bảo trì cho người dùng
                </p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cấu hình SMTP</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label>SMTP Host</label>
                <Input
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="grid gap-2">
                <label>SMTP Port</label>
                <Input
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                  placeholder="587"
                />
              </div>
              <div className="grid gap-2">
                <label>Username</label>
                <Input
                  value={smtpConfig.username}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div className="grid gap-2">
                <label>Password</label>
                <Input
                  type="password"
                  value={smtpConfig.password}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                  placeholder="********"
                />
              </div>
              <Button>Kiểm tra kết nối</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Mẫu email</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xác nhận đăng ký</p>
                  <p className="text-sm text-muted-foreground">
                    Email gửi cho người dùng khi đăng ký tài khoản
                  </p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xác nhận đơn hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Email gửi cho khách hàng khi đặt hàng thành công
                  </p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Khôi phục mật khẩu</p>
                  <p className="text-sm text-muted-foreground">
                    Email gửi cho người dùng khi yêu cầu đặt lại mật khẩu
                  </p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Kênh thông báo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">Gửi thông báo qua email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-muted-foreground">Gửi thông báo qua tin nhắn SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notification</p>
                  <p className="text-sm text-muted-foreground">Gửi thông báo đẩy đến thiết bị</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cấu hình kênh</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label>OneSignal App ID</label>
                <Input placeholder="Nhập App ID" />
              </div>
              <div className="grid gap-2">
                <label>Firebase Server Key</label>
                <Input placeholder="Nhập Server Key" />
              </div>
              <div className="grid gap-2">
                <label>Zalo OA ID</label>
                <Input placeholder="Nhập OA ID" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bảo mật đăng nhập</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xác thực hai lớp (2FA)</p>
                  <p className="text-sm text-muted-foreground">Yêu cầu mã xác thực khi đăng nhập</p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                />
              </div>
              <div className="grid gap-2">
                <label>Số lần đăng nhập sai tối đa</label>
                <Input
                  type="number"
                  value={security.maxLoginAttempts}
                  onChange={(e) =>
                    setSecurity({ ...security, maxLoginAttempts: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label>Thời gian khóa tài khoản (phút)</label>
                <Input
                  type="number"
                  value={security.lockoutDuration}
                  onChange={(e) =>
                    setSecurity({ ...security, lockoutDuration: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label>Thời gian tự động đăng xuất (phút)</label>
                <Input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) =>
                    setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xác minh IP truy cập admin</p>
                  <p className="text-sm text-muted-foreground">
                    Chỉ cho phép đăng nhập từ IP đã đăng ký
                  </p>
                </div>
                <Switch
                  checked={security.ipVerification}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, ipVerification: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Đăng nhập từ thiết bị mới</p>
                  <p className="text-sm text-muted-foreground">
                    Cho phép đăng nhập từ thiết bị chưa được xác thực
                  </p>
                </div>
                <Switch
                  checked={security.newDeviceLogin}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, newDeviceLogin: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cổng thanh toán</h3>
            <div className="space-y-4">
              {paymentGateways.map((gateway) => (
                <div key={gateway.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{gateway.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Trạng thái: {gateway.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
                      </p>
                    </div>
                    <Switch
                      checked={gateway.status === 'active'}
                      onCheckedChange={() => {
                        // Handle gateway status change
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label>API Key</label>
                    <Input value={gateway.config.apiKey} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <label>Secret Key</label>
                    <Input value={gateway.config.secret} readOnly />
                  </div>
                  <Button variant="outline" className="mt-2">
                    Cập nhật cấu hình
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Sales Settings */}
        <TabsContent value="sales" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cài đặt đơn hàng</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label>Phí vận chuyển mặc định (VNĐ)</label>
                <Input
                  type="number"
                  value={sales.defaultShippingFee}
                  onChange={(e) =>
                    setSales({ ...sales, defaultShippingFee: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cho phép hủy đơn sau khi xác nhận</p>
                  <p className="text-sm text-muted-foreground">
                    Cho phép khách hàng hủy đơn hàng sau khi đã được xác nhận
                  </p>
                </div>
                <Switch
                  checked={sales.allowOrderCancellation}
                  onCheckedChange={(checked) =>
                    setSales({ ...sales, allowOrderCancellation: checked })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label>Thời gian tự động xác nhận (giờ)</label>
                <Input
                  type="number"
                  value={sales.autoConfirmTime}
                  onChange={(e) =>
                    setSales({ ...sales, autoConfirmTime: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cài đặt người dùng</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label>Vai trò mặc định khi đăng ký</label>
                <Select
                  value={users.defaultRole}
                  onValueChange={(value) => setUsers({ ...users, defaultRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="seller">Người bán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu xác minh email</p>
                  <p className="text-sm text-muted-foreground">
                    Người dùng phải xác minh email sau khi đăng ký
                  </p>
                </div>
                <Switch
                  checked={users.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setUsers({ ...users, requireEmailVerification: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Yêu cầu xác minh số điện thoại</p>
                  <p className="text-sm text-muted-foreground">
                    Người dùng phải xác minh số điện thoại sau khi đăng ký
                  </p>
                </div>
                <Switch
                  checked={users.requirePhoneVerification}
                  onCheckedChange={(checked) =>
                    setUsers({ ...users, requirePhoneVerification: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cho phép đổi email</p>
                  <p className="text-sm text-muted-foreground">
                    Người dùng có thể thay đổi email sau khi đăng ký
                  </p>
                </div>
                <Switch
                  checked={users.allowEmailChange}
                  onCheckedChange={(checked) => setUsers({ ...users, allowEmailChange: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cho phép đổi số điện thoại</p>
                  <p className="text-sm text-muted-foreground">
                    Người dùng có thể thay đổi số điện thoại sau khi đăng ký
                  </p>
                </div>
                <Switch
                  checked={users.allowPhoneChange}
                  onCheckedChange={(checked) => setUsers({ ...users, allowPhoneChange: checked })}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sao lưu dữ liệu</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tự động sao lưu</p>
                  <p className="text-sm text-muted-foreground">Tự động tạo bản sao lưu định kỳ</p>
                </div>
                <Switch
                  checked={backup.autoBackup}
                  onCheckedChange={(checked) => setBackup({ ...backup, autoBackup: checked })}
                />
              </div>
              <div className="grid gap-2">
                <label>Tần suất sao lưu</label>
                <Select
                  value={backup.backupFrequency}
                  onValueChange={(value) => setBackup({ ...backup, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tần suất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hàng giờ</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Đường dẫn lưu trữ</label>
                <Input
                  value={backup.backupPath}
                  onChange={(e) => setBackup({ ...backup, backupPath: e.target.value })}
                  placeholder="/path/to/backup"
                />
              </div>
              <div className="flex gap-2">
                <Button>
                  <Database className="mr-2 h-4 w-4" />
                  Tạo bản sao lưu ngay
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Khôi phục từ bản sao lưu
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Policies Settings */}
        <TabsContent value="policies" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Chính sách & Điều khoản</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chính sách bảo mật</p>
                  <p className="text-sm text-muted-foreground">
                    Quy định về bảo mật thông tin người dùng
                  </p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Điều khoản sử dụng</p>
                  <p className="text-sm text-muted-foreground">
                    Quy định chung về việc sử dụng dịch vụ
                  </p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chính sách đổi/trả hàng</p>
                  <p className="text-sm text-muted-foreground">Quy định về việc đổi trả sản phẩm</p>
                </div>
                <Button variant="outline">Chỉnh sửa</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Thống kê cấu hình</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Cổng thanh toán</p>
            <p className="text-2xl font-bold">
              {paymentGateways.filter((g) => g.status === 'active').length} /{' '}
              {paymentGateways.length}
            </p>
            <p className="text-sm text-muted-foreground">đang hoạt động</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Trạng thái SMTP</p>
            <p className="text-2xl font-bold text-green-500">Hoạt động</p>
            <p className="text-sm text-muted-foreground">Kết nối bình thường</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Mẫu email</p>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">đang sử dụng</p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground">Bảo mật</p>
            <p className="text-2xl font-bold text-green-500">Đã bật</p>
            <p className="text-sm text-muted-foreground">
              2FA, đăng xuất sau {security.sessionTimeout} phút
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
