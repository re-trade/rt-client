'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
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

// Sample data - replace with actual API call
const financialData = {
  daily: [
    { date: '01/03', revenue: 15000000, cost: 5000000, profit: 10000000 },
    { date: '02/03', revenue: 18000000, cost: 6000000, profit: 12000000 },
    { date: '03/03', revenue: 22000000, cost: 7000000, profit: 15000000 },
    { date: '04/03', revenue: 25000000, cost: 8000000, profit: 17000000 },
    { date: '05/03', revenue: 28000000, cost: 9000000, profit: 19000000 },
    { date: '06/03', revenue: 30000000, cost: 10000000, profit: 20000000 },
    { date: '07/03', revenue: 32000000, cost: 11000000, profit: 21000000 },
  ],
  weekly: [
    { week: 'Tuần 1', revenue: 100000000, cost: 35000000, profit: 65000000 },
    { week: 'Tuần 2', revenue: 120000000, cost: 40000000, profit: 80000000 },
    { week: 'Tuần 3', revenue: 150000000, cost: 50000000, profit: 100000000 },
    { week: 'Tuần 4', revenue: 180000000, cost: 60000000, profit: 120000000 },
  ],
  monthly: [
    { month: 'T1', revenue: 400000000, cost: 140000000, profit: 260000000 },
    { month: 'T2', revenue: 450000000, cost: 150000000, profit: 300000000 },
    { month: 'T3', revenue: 500000000, cost: 160000000, profit: 340000000 },
  ],
};

const revenueBySource = [
  { name: 'Đơn hàng', value: 60 },
  { name: 'Phí vận chuyển', value: 15 },
  { name: 'Phí hoa hồng', value: 10 },
  { name: 'Quảng cáo', value: 10 },
  { name: 'Dịch vụ khác', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const timeRanges = ['Hôm nay', 'Tuần này', 'Tháng này', 'Quý này', 'Năm nay'];
const viewTypes = ['Ngày', 'Tuần', 'Tháng'];
const transactionTypes = ['Tất cả', 'Thu', 'Chi'];
const transactionStatuses = ['Tất cả', 'Thành công', 'Đang xử lý', 'Thất bại'];

// Sample transactions
const transactions = [
  {
    id: 'TX001',
    date: '2024-03-01',
    relatedParty: 'Shop A',
    type: 'Thu',
    amount: 15000000,
    status: 'Thành công',
    description: 'Thanh toán đơn hàng #12345',
  },
  {
    id: 'TX002',
    date: '2024-03-01',
    relatedParty: 'Shop B',
    type: 'Chi',
    amount: 5000000,
    status: 'Thành công',
    description: 'Hoàn tiền đơn hàng #12346',
  },
  // Add more sample transactions
];

export default function FinancialReportPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Hôm nay');
  const [selectedViewType, setSelectedViewType] = useState('Ngày');
  const [selectedTransactionType, setSelectedTransactionType] = useState('Tất cả');
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics with error handling
  const currentData =
    financialData[selectedViewType.toLowerCase() as keyof typeof financialData] || [];
  const totalRevenue = currentData?.reduce((sum, item) => sum + (item?.revenue || 0), 0) || 0;
  const totalCost = currentData?.reduce((sum, item) => sum + (item?.cost || 0), 0) || 0;
  const totalProfit = currentData?.reduce((sum, item) => sum + (item?.profit || 0), 0) || 0;
  const systemBalance = 500000000; // Example balance

  // Calculate growth rates with error handling
  const previousData = currentData?.slice(-2) || [];
  const revenueGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1] && previousData[0].revenue !== 0
      ? ((previousData[1].revenue - previousData[0].revenue) / previousData[0].revenue) * 100
      : 0;
  const costGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1] && previousData[0].cost !== 0
      ? ((previousData[1].cost - previousData[0].cost) / previousData[0].cost) * 100
      : 0;
  const profitGrowth =
    previousData.length >= 2 && previousData[0] && previousData[1] && previousData[0].profit !== 0
      ? ((previousData[1].profit - previousData[0].profit) / previousData[0].profit) * 100
      : 0;

  // Filter transactions with error handling
  const filteredTransactions =
    transactions?.filter((transaction) => {
      if (!transaction) return false;
      const matchesType =
        selectedTransactionType === 'Tất cả' || transaction.type === selectedTransactionType;
      const matchesStatus =
        selectedTransactionStatus === 'Tất cả' || transaction.status === selectedTransactionStatus;
      const matchesSearch =
        transaction.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.relatedParty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    }) || [];

  // Handle view type change
  const handleViewTypeChange = (value: string) => {
    setSelectedViewType(value);
    // Reset time range if needed
    if (value === 'Ngày') {
      setSelectedTimeRange('Hôm nay');
    } else if (value === 'Tuần') {
      setSelectedTimeRange('Tuần này');
    } else if (value === 'Tháng') {
      setSelectedTimeRange('Tháng này');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Báo cáo tài chính</h1>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedViewType} onValueChange={handleViewTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kiểu xem" />
            </SelectTrigger>
            <SelectContent>
              {viewTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
              <h2 className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</h2>
              <div className="mt-2 flex items-center text-sm">
                {revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng chi phí</p>
              <h2 className="text-2xl font-bold">{totalCost.toLocaleString('vi-VN')}đ</h2>
              <div className="mt-2 flex items-center text-sm">
                {costGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                )}
                <span className={costGrowth >= 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(costGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng lợi nhuận</p>
              <h2 className="text-2xl font-bold">{totalProfit.toLocaleString('vi-VN')}đ</h2>
              <div className="mt-2 flex items-center text-sm">
                {profitGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={profitGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(profitGrowth).toFixed(1)}%
                </span>
                <span className="ml-2 text-muted-foreground">so với kỳ trước</span>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Số dư hệ thống</p>
              <h2 className="text-2xl font-bold">{systemBalance.toLocaleString('vi-VN')}đ</h2>
            </div>
            <Wallet className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Xu hướng tài chính</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    selectedViewType === 'Ngày'
                      ? 'date'
                      : selectedViewType === 'Tuần'
                        ? 'week'
                        : 'month'
                  }
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')}đ`, 'Số tiền']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Doanh thu" />
                <Line type="monotone" dataKey="cost" stroke="#ff7300" name="Chi phí" />
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Lợi nhuận" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Cơ cấu doanh thu</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Giao dịch tài chính</h3>
          <div className="flex items-center space-x-2">
            <div className="flex w-[300px] items-center space-x-2">
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTransactionStatus} onValueChange={setSelectedTransactionStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {transactionStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Người liên quan</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Mô tả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.relatedParty}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.type === 'Thu'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.amount.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.status === 'Thành công'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'Đang xử lý'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Export History */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nhật ký đối soát</h3>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Xem tất cả
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Loại báo cáo</TableHead>
                <TableHead>Phạm vi dữ liệu</TableHead>
                <TableHead>Định dạng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-03-01 10:00</TableCell>
                <TableCell>Admin A</TableCell>
                <TableCell>Báo cáo tài chính</TableCell>
                <TableCell>Tháng 3/2024</TableCell>
                <TableCell>Excel</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-01 09:30</TableCell>
                <TableCell>Admin B</TableCell>
                <TableCell>Báo cáo doanh thu</TableCell>
                <TableCell>Tuần 1/2024</TableCell>
                <TableCell>PDF</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
