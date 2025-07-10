'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  User,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Sample data
const alerts = [
  {
    id: 1,
    level: 'high',
    type: 'security',
    title: 'Đăng nhập đáng ngờ',
    description: 'Nhiều lần đăng nhập thất bại từ IP 192.168.1.1',
    status: 'new',
    timestamp: '2024-03-15 14:30:00',
    ip: '192.168.1.1',
    user: 'user123',
    assignedTo: null,
    notes: '',
  },
  {
    id: 2,
    level: 'medium',
    type: 'order',
    title: 'Đơn hàng bất thường',
    description: 'Đơn hàng #12345 có giá trị cao bất thường',
    status: 'processing',
    timestamp: '2024-03-15 13:15:00',
    ip: '192.168.1.2',
    user: 'shop456',
    assignedTo: 'admin1',
    notes: 'Đang kiểm tra tính hợp lệ',
  },
  {
    id: 3,
    level: 'low',
    type: 'system',
    title: 'API lỗi',
    description: 'Lỗi kết nối API thanh toán',
    status: 'resolved',
    timestamp: '2024-03-15 12:00:00',
    ip: '192.168.1.3',
    user: 'system',
    assignedTo: 'admin2',
    notes: 'Đã khắc phục',
  },
];

const alertTypes = [
  { value: 'security', label: 'Bảo mật', icon: Shield },
  { value: 'system', label: 'Hệ thống', icon: Settings },
  { value: 'order', label: 'Đơn hàng', icon: ShoppingCart },
  { value: 'user', label: 'Người dùng', icon: User },
];

const alertLevels = [
  { value: 'low', label: 'Thấp', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Cao', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Khẩn cấp', color: 'bg-red-100 text-red-800' },
];

const alertStatuses = [
  { value: 'new', label: 'Mới', color: 'bg-gray-100 text-gray-800' },
  { value: 'processing', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  { value: 'resolved', label: 'Đã xử lý', color: 'bg-green-100 text-green-800' },
  { value: 'ignored', label: 'Bỏ qua', color: 'bg-gray-100 text-gray-800' },
];

// Sample statistics data
const alertStats = {
  byTime: [
    { date: '01/03', count: 5 },
    { date: '02/03', count: 8 },
    { date: '03/03', count: 12 },
    { date: '04/03', count: 7 },
    { date: '05/03', count: 10 },
  ],
  byType: [
    { name: 'Bảo mật', value: 30 },
    { name: 'Hệ thống', value: 25 },
    { name: 'Đơn hàng', value: 20 },
    { name: 'Người dùng', value: 15 },
    { name: 'Khác', value: 10 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || alert.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchesSearch && matchesType && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý cảnh báo</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Cấu hình
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số cảnh báo</p>
              <h2 className="text-2xl font-bold">150</h2>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cảnh báo mới</p>
              <h2 className="text-2xl font-bold">12</h2>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đang xử lý</p>
              <h2 className="text-2xl font-bold">8</h2>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã xử lý</p>
              <h2 className="text-2xl font-bold">130</h2>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Cảnh báo theo thời gian</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertStats.byTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số lượng cảnh báo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Phân bố theo loại</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertStats.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {alertStats.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm cảnh báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại cảnh báo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {alertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                {alertLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {alertStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Alerts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mức độ</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Người xử lý</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      alertLevels.find((l) => l.value === alert.level)?.color
                    }`}
                  >
                    {alertLevels.find((l) => l.value === alert.level)?.label}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    {(() => {
                      const Icon = alertTypes.find((t) => t.value === alert.type)?.icon;
                      return Icon ? <Icon className="h-4 w-4" /> : null;
                    })()}
                    {alertTypes.find((t) => t.value === alert.type)?.label}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      alertStatuses.find((s) => s.value === alert.status)?.color
                    }`}
                  >
                    {alertStatuses.find((s) => s.value === alert.status)?.label}
                  </span>
                </TableCell>
                <TableCell>{alert.timestamp}</TableCell>
                <TableCell>{alert.ip}</TableCell>
                <TableCell>{alert.user}</TableCell>
                <TableCell>{alert.assignedTo || '-'}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chi tiết cảnh báo</DialogTitle>
                        <DialogDescription>
                          Xem và xử lý thông tin chi tiết về cảnh báo
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <div className="font-medium">Tiêu đề</div>
                          <div className="col-span-3">{alert.title}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <div className="font-medium">Mô tả</div>
                          <div className="col-span-3">{alert.description}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <div className="font-medium">Ghi chú</div>
                          <div className="col-span-3">
                            <Input
                              placeholder="Thêm ghi chú..."
                              value={alert.notes}
                              onChange={(e) => {
                                // Handle note change
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Handle mark as processing
                            }}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Đang xử lý
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Handle mark as resolved
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Đã xử lý
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Handle ignore
                            }}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Bỏ qua
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
