'use client';
import { WithdrawDialog } from '@/components/common/WithdrawDialog';
import { RevenueDetailDialog } from '@/components/dialog-common/view-update/revenue-detail-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
  ArrowUpRight,
  Banknote,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  Filter,
  ShoppingCart,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface RevenueData {
  id: string;
  date: string;
  orderId: string;
  productName: string;
  buyer: string;
  amount: number;
  commission: number;
  netRevenue: number;
  status: 'completed' | 'pending' | 'cancelled';
  category: string;
}

interface WithdrawData {
  id: string;
  date: string;
  amount: number;
  method: 'bank' | 'momo' | 'zalopay';
  status: 'pending' | 'completed' | 'failed';
  bankInfo?: string;
}

const mockRevenueData: RevenueData[] = [
  {
    id: '1',
    date: '2024-07-21',
    orderId: 'ORD001',
    productName: 'iPhone 12 Pro Max đã qua sử dụng',
    buyer: 'Nguyễn Văn A',
    amount: 15900000,
    commission: 795000,
    netRevenue: 15105000,
    status: 'completed',
    category: 'Điện thoại',
  },
  {
    id: '2',
    date: '2024-07-20',
    orderId: 'ORD002',
    productName: 'Laptop Dell XPS 13 cũ',
    buyer: 'Trần Thị B',
    amount: 12500000,
    commission: 625000,
    netRevenue: 11875000,
    status: 'completed',
    category: 'Laptop',
  },
  {
    id: '3',
    date: '2024-07-19',
    orderId: 'ORD003',
    productName: 'Apple Watch Series 7',
    buyer: 'Lê Minh C',
    amount: 6800000,
    commission: 340000,
    netRevenue: 6460000,
    status: 'pending',
    category: 'Smartwatch',
  },
  {
    id: '4',
    date: '2024-07-18',
    orderId: 'ORD004',
    productName: 'Máy ảnh Canon EOS 5D Mark IV',
    buyer: 'Phạm Thị D',
    amount: 22000000,
    commission: 1100000,
    netRevenue: 20900000,
    status: 'completed',
    category: 'Máy ảnh',
  },
];

const mockWithdrawHistory: WithdrawData[] = [
  {
    id: 'WD001',
    date: '2024-07-15',
    amount: 10000000,
    method: 'bank',
    status: 'completed',
    bankInfo: 'VCB - **** 1234',
  },
  {
    id: 'WD002',
    date: '2024-07-10',
    amount: 5000000,
    method: 'momo',
    status: 'completed',
  },
  {
    id: 'WD003',
    date: '2024-07-08',
    amount: 3000000,
    method: 'bank',
    status: 'pending',
    bankInfo: 'VCB - **** 1234',
  },
];

export default function RevenueManagement() {
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('revenue');

  // Tính toán thống kê
  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.netRevenue, 0);
  const pendingAmount = mockRevenueData
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + item.netRevenue, 0);
  const completedAmount = mockRevenueData
    .filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + item.netRevenue, 0);
  const totalOrders = mockRevenueData.length;
  const avgOrderValue = totalRevenue / totalOrders;

  // Số dư có thể rút (chỉ từ các đơn hoàn thành)
  const availableBalance =
    completedAmount -
    mockWithdrawHistory
      .filter((w) => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);

  const openDetailDialog = (revenue: RevenueData) => {
    setSelectedRevenue(revenue);
    setIsDetailOpen(true);
  };

  const handleWithdraw = () => {
    console.log('Rút tiền:', { withdrawAmount, withdrawMethod, bankInfo });
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
    setWithdrawMethod('');
    setBankInfo('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRevenue =
    filterStatus === 'all'
      ? mockRevenueData
      : mockRevenueData.filter((item) => item.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Doanh thu</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý doanh thu từ việc bán đồ cũ</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Rút tiền
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Tổng doanh thu</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}₫</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm text-blue-100">+20.1% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Số dư khả dụng</CardTitle>
              <Banknote className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {availableBalance.toLocaleString('vi-VN')}₫
              </div>
              <p className="text-xs text-gray-500 mt-1">Có thể rút ngay</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+15% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Giá trị TB/đơn</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOrderValue.toLocaleString('vi-VN')}₫</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+5.2% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'revenue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chi tiết doanh thu
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'withdraw'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Lịch sử rút tiền
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'revenue' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="pending">Đang xử lý</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Hiển thị {filteredRevenue.length} trên {mockRevenueData.length} giao dịch
                  </div>
                </div>

                {/* Revenue Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Ngày</TableHead>
                        <TableHead className="font-semibold">Đơn hàng</TableHead>
                        <TableHead className="font-semibold">Sản phẩm</TableHead>
                        <TableHead className="font-semibold">Người mua</TableHead>
                        <TableHead className="font-semibold text-right">Tổng tiền</TableHead>
                        <TableHead className="font-semibold text-right">Phí (5%)</TableHead>
                        <TableHead className="font-semibold text-right">Thực nhận</TableHead>
                        <TableHead className="font-semibold text-center">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-center">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRevenue.map((revenue) => (
                        <TableRow key={revenue.id} className="hover:bg-gray-50">
                          <TableCell>
                            {new Date(revenue.date).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {revenue.orderId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{revenue.productName}</p>
                              <p className="text-xs text-gray-500">{revenue.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{revenue.buyer}</TableCell>
                          <TableCell className="text-right font-medium">
                            {revenue.amount.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -{revenue.commission.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {revenue.netRevenue.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(revenue.status)}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(revenue.status)}
                                  <span>
                                    {revenue.status === 'completed'
                                      ? 'Hoàn thành'
                                      : revenue.status === 'pending'
                                        ? 'Đang xử lý'
                                        : 'Đã hủy'}
                                  </span>
                                </span>
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailDialog(revenue)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lịch sử rút tiền</h3>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Mã GD</TableHead>
                        <TableHead className="font-semibold">Ngày</TableHead>
                        <TableHead className="font-semibold text-right">Số tiền</TableHead>
                        <TableHead className="font-semibold">Phương thức</TableHead>
                        <TableHead className="font-semibold">Thông tin TK</TableHead>
                        <TableHead className="font-semibold text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWithdrawHistory.map((withdraw) => (
                        <TableRow key={withdraw.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-blue-600">{withdraw.id}</TableCell>
                          <TableCell>
                            {new Date(withdraw.date).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {withdraw.amount.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              {withdraw.method === 'bank'
                                ? 'Ngân hàng'
                                : withdraw.method === 'momo'
                                  ? 'MoMo'
                                  : 'ZaloPay'}
                            </div>
                          </TableCell>
                          <TableCell>{withdraw.bankInfo || 'N/A'}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdraw.status)}`}
                            >
                              {getStatusIcon(withdraw.status)}
                              <span className="ml-1">
                                {withdraw.status === 'completed'
                                  ? 'Hoàn thành'
                                  : withdraw.status === 'pending'
                                    ? 'Đang xử lý'
                                    : 'Thất bại'}
                              </span>
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>

        <RevenueDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          revenue={selectedRevenue}
        />

        <WithdrawDialog
          open={isWithdrawOpen}
          onOpenChange={setIsWithdrawOpen}
          availableBalance={availableBalance}
          onWithdraw={(amount, method, bankInfo) => {
            console.log('Rút tiền:', { amount, method, bankInfo });
          }}
        />
      </div>
    </div>
  );
}
