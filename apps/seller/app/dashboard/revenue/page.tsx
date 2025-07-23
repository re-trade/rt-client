'use client';
import { SelectBank } from '@/components/common/SelectBank';
import { WithdrawDialog } from '@/components/common/WithdrawDialog';
import { RevenueDetailDialog } from '@/components/dialog-common/view-update/revenue-detail-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { revenueApi, RevenueResponse, RevenueStatsResponse } from '@/service/revenue.api';
import { snipppetCode } from '@/service/snippetCode';
import {
  BankInfor,
  BankResponse,
  CreateBankInfor,
  walletApi,
  WalletResponse,
} from '@/service/wallet.api';
import {
  ArrowUpRight,
  Banknote,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WithdrawData {
  id: string;
  date: string;
  amount: number;
  method: 'bank' | 'momo' | 'zalopay';
  status: 'pending' | 'completed' | 'failed';
  bankInfo?: string;
}

export default function RevenueManagement() {
  const [revenueData, setRevenueData] = useState<RevenueResponse[]>([]);
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawData[]>([]);
  const [listBanks, setListBanks] = useState<BankResponse[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse>({
    totalRevenue: 0,
    totalOrder: 0,
    totalItemsSold: 0,
    averageOrderValue: 0,
  });
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('revenue');
  const [wallet, setWallet] = useState<WalletResponse>();

  const [bankAccounts, setBankAccounts] = useState<BankInfor[]>([]);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [editingBank, setEditingBank] = useState<BankInfor | null>(null);
  const [newBankInfo, setNewBankInfo] = useState<CreateBankInfor>({
    bankName: '',
    accountNumber: '',
    bankBin: '',
    userBankName: '',
    // isDefault: false,
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenue, stats, withdraws, wallet, listBanks, bankInfo] = await Promise.all([
          revenueApi.getRevenueBySeller(),
          revenueApi.getRevenuStatsBySeller(),
          walletApi.getWithdrawHistory?.() || Promise.resolve([]),
          walletApi.getWalletBySeller(),
          walletApi.getTheBanks(),
          walletApi.getBankInfos(),
        ]);
        setWallet(wallet);
        setRevenueData(revenue);
        setRevenueStats(stats);
        setListBanks(listBanks);
        setBankAccounts(bankInfo);
        //setWithdrawHistory(withdraws);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate available balance
  const availableBalance =
    revenueData
      .filter((item) => item.status.code === 'completed')
      .reduce((sum, item) => sum + item.netAmount, 0) -
    withdrawHistory.filter((w) => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0);

  const openDetailDialog = (revenue: RevenueResponse) => {
    setSelectedRevenue(revenue);
    setIsDetailOpen(true);
  };

  const handleWithdraw = (amount: number, method: string, bankInfo?: string) => {
    console.log('Rút tiền:', { amount, method, bankInfo });
    setIsWithdrawOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
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

  const formatDate = (createdDate: string) => {
    return new Date(createdDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredRevenue =
    filterStatus === 'all'
      ? revenueData
      : revenueData.filter((item) => item.status.code === filterStatus);

  // Bank info functions
  const handleAddBank = async () => {
    if (newBankInfo.bankName && newBankInfo.accountNumber && newBankInfo.userBankName) {
      try {
        const addedBank = await walletApi.createBankInfor(newBankInfo);
        if (addedBank) {
          setBankAccounts((prev) => [
            ...prev,
            {
              id: addedBank.id,
              bankName: addedBank.bankName,
              accountNumber: addedBank.accountNumber,
              userBankName: addedBank.userBankName,
              bankBin: addedBank.bankBin,
              // isDefault: addedBank.isDefault || false,
              addedDate: new Date().toISOString(),
            },
          ]);
          setNewBankInfo({
            bankName: '',
            accountNumber: '',
            userBankName: '',
            bankBin: '',
            // isDefault: false,
          });
          setIsAddingBank(false);
        } else {
          console.error('Failed to add bank information');
        }
        const newBank: BankInfor = {
          id: Date.now().toString(),
          ...newBankInfo,
          // isDefault: bankAccounts.length === 0,
          addedDate: new Date().toISOString(),
        };

        setBankAccounts([...bankAccounts, newBank]);
        // setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '', isDefault: false });
        setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '' });
        setIsAddingBank(false);
      } catch (error) {
        console.error('Error adding bank:', error);
      }
    }
  };

  const handleEditBank = (bank: BankInfor) => {
    setEditingBank(bank);
    setNewBankInfo({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      userBankName: bank.userBankName,
      // isDefault: bank.isDefault,
      bankBin: bank.bankBin,
    });
    setIsAddingBank(true);
  };

  const handleUpdateBank = async () => {
    if (
      editingBank &&
      newBankInfo.bankName &&
      newBankInfo.accountNumber &&
      newBankInfo.userBankName
    ) {
      try {
        // Call API to update bank
        // await walletApi.updateBankInfo(editingBank.id, newBankInfo);

        setBankAccounts(
          bankAccounts.map((bank) =>
            bank.id === editingBank.id ? { ...bank, ...newBankInfo } : bank,
          ),
        );
        setEditingBank(null);
        // setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', isDefault: false, bankBin: '' });
        setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '' });
        setIsAddingBank(false);
      } catch (error) {
        console.error('Error updating bank:', error);
      }
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      // Call API to delete bank
      // await walletApi.deleteBankInfo(bankId);

      setBankAccounts(bankAccounts.filter((bank) => bank.id !== bankId));
    } catch (error) {
      console.error('Error deleting bank:', error);
    }
  };

  const handleSetDefault = async (bankId: string) => {
    try {
      // Call API to set default bank
      // await walletApi.setDefaultBank(bankId);

      setBankAccounts(
        bankAccounts.map((bank) => ({
          ...bank,
          // isDefault: bank.id === bankId,
        })),
      );
    } catch (error) {
      console.error('Error setting default bank:', error);
    }
  };

  const cancelBankForm = () => {
    setIsAddingBank(false);
    setEditingBank(null);
    // setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', isDefault: false, bankBin: '' });
    setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '' });
  };

  const handleBankSelect = (
    selectedBank: { id: string; name: string; code: string; bin: string } | null,
  ) => {
    if (selectedBank) {
      setNewBankInfo((prev) => ({
        ...prev,
        bankName: selectedBank.name,
        bankBin: selectedBank.bin,
      }));
    } else {
      setNewBankInfo((prev) => ({
        ...prev,
        bankName: '',
        bankBin: '',
      }));
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  // Bank icon component with proper error handling for URL
  const BankIcon = ({ bankUrl, bankName }: { bankUrl?: string; bankName: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-5 h-5 text-gray-500" />
        )}
      </div>
    );
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Tổng doanh thu</CardTitle>
              <DollarSign className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {revenueStats.totalRevenue.toLocaleString('vi-VN')}₫
              </div>
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
                {wallet?.balance.toLocaleString('vi-VN')}₫
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
              <div className="text-2xl font-bold">{revenueStats.totalOrder}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-gray-500">+15% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng sản phẩm đã bán
              </CardTitle>
              <Package className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.totalItemsSold}</div>
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
              <div className="text-2xl font-bold">
                {revenueStats.averageOrderValue.toLocaleString('vi-VN')}₫
              </div>
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
                onClick={() => setActiveTab('bank')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bank'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thông tin ngân hàng
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
                    Hiển thị {filteredRevenue.length} trên {revenueData.length} giao dịch
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
                        <TableHead className="font-semibold text-right">Phí(%)</TableHead>
                        <TableHead className="font-semibold text-right">Tiền phí</TableHead>
                        <TableHead className="font-semibold text-right">Thực nhận</TableHead>
                        <TableHead className="font-semibold text-center">Trạng thái</TableHead>
                        <TableHead className="font-semibold text-center">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRevenue.map((revenue) => (
                        <TableRow key={revenue.orderComboId} className="hover:bg-gray-50">
                          <TableCell>{formatDate(revenue.createdDate)}</TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {snipppetCode.cutCode(revenue.orderComboId)}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">
                                  {revenue.items.length} sản phẩm
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 max-w-[190px] line-clamp-2">
                                {revenue.items[0]?.itemName || 'Không có tên sản phẩm'}
                                {revenue.items.length > 1 && (
                                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                                    +{revenue.items.length - 1} khác
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {getCustomerInitials(revenue.destination.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {revenue.destination.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {revenue.destination.phone}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {revenue.totalPrice.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {revenue.feePercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            -{revenue.feeAmount.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {revenue.netAmount.toLocaleString('vi-VN')}₫
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(revenue.status.code)}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(revenue.status.code)}
                                  <span>{revenue.status.name}</span>
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

            {activeTab === 'bank' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Thông tin ngân hàng</h3>
                  <Button onClick={() => setIsAddingBank(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm tài khoản
                  </Button>
                </div>

                {/* Add/Edit Bank Form */}
                {isAddingBank && (
                  <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {editingBank
                          ? 'Chỉnh sửa tài khoản ngân hàng'
                          : 'Thêm tài khoản ngân hàng mới'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Tên ngân hàng *</Label>
                          <SelectBank value={newBankInfo.bankBin} onChange={handleBankSelect} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Số tài khoản *</Label>
                          <Input
                            id="accountNumber"
                            placeholder="Ví dụ: 1234567890"
                            value={newBankInfo.accountNumber}
                            onChange={(e) =>
                              setNewBankInfo({ ...newBankInfo, accountNumber: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userBankName">Tên chủ tài khoản *</Label>
                          <Input
                            id="userBankName"
                            placeholder="Ví dụ: NGUYEN VAN A"
                            value={newBankInfo.userBankName}
                            onChange={(e) =>
                              setNewBankInfo({
                                ...newBankInfo,
                                userBankName: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={editingBank ? handleUpdateBank : handleAddBank}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {editingBank ? 'Cập nhật' : 'Thêm tài khoản'}
                        </Button>
                        <Button variant="outline" onClick={cancelBankForm}>
                          Hủy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Bank Accounts List */}
                <div className="grid gap-4">
                  {bankAccounts.map((bank) => (
                    // <Card key={bank.id} className={`border transition-all hover:shadow-md ${bank.isDefault ? 'border-blue-500 bg-blue-50/30' : ''}`}>
                    <Card key={bank.id} className={`border transition-all hover:shadow-md`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {bank.bankName}
                                </h4>
                                {/* {bank.isDefault && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                    Mặc định
                                  </span>
                                )} */}
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span className="font-mono">{bank.accountNumber}</span>
                                </div>
                                <div className="font-medium text-gray-900">{bank.userBankName}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* {!bank.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(bank.id)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                Đặt mặc định
                              </Button>
                            )} */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBank(bank)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBank(bank.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {bankAccounts.length === 0 && !isAddingBank && (
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-12 text-center">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Chưa có tài khoản ngân hàng
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Thêm tài khoản ngân hàng để có thể rút tiền dễ dàng hơn
                        </p>
                      </CardContent>
                    </Card>
                  )}
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
                      {withdrawHistory.map((withdraw) => (
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

                {withdrawHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có lịch sử rút tiền
                    </h3>
                    <p className="text-gray-500">
                      Các giao dịch rút tiền của bạn sẽ hiển thị ở đây
                    </p>
                  </div>
                )}
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
          onWithdraw={handleWithdraw}
        />
      </div>
    </div>
  );
}
