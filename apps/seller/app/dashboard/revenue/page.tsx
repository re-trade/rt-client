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
  WithdrawHistoryResponse,
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
import { RevenueTableActiveTab } from '@/components/common/RevenueTableActiveTab';
import { BankInfoActiveTab } from '@/components/common/BankInfoActiveTab';
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Chi tiết doanh thu
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bank'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Thông tin ngân hàng
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'withdraw'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Lịch sử rút tiền
              </button>
            </nav>
          </div>

          <div className="p-6">
            <RevenueTableActiveTab />

            {activeTab === 'bank' && (
              <div className="space-y-6">
                <BankInfoActiveTab />
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