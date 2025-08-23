'use client';
import { SelectBank } from '@/components/common/SelectBank';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { useBankInfoPagination } from '@/hooks/use-bank-info-pagination';
import {
  BankInfor,
  BankResponse,
  CreateBankInfor,
  walletApi,
  WalletResponse,
} from '@/service/wallet.api';
import { Building2, CheckCircle, CreditCard, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
interface BankInfoActiveTabProps {
  isAddingBank: boolean;
  setIsAddingBank: (value: boolean) => void;
}

export function BankInfoActiveTab({ isAddingBank, setIsAddingBank }: BankInfoActiveTabProps) {
  const {
    bankInfos,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
    setBankInfos,
    refreshBankInfos,
    handleKeyPress,
  } = useBankInfoPagination();

  const [listBanks, setListBanks] = useState<BankResponse[]>([]);
  const [wallet, setWallet] = useState<WalletResponse>();
  const [editingBank, setEditingBank] = useState<BankInfor | null>(null);
  const [newBankInfo, setNewBankInfo] = useState<CreateBankInfor>({
    bankName: '',
    accountNumber: '',
    bankBin: '',
    userBankName: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wallet, listBanks] = await Promise.all([
          walletApi.getWalletBySeller(),
          walletApi.getTheBanks(),
        ]);
        setListBanks(listBanks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const formatDate = (createdDate: string) => {
    return new Date(createdDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // ...existing code...

  const handleAddBank = async () => {
    if (newBankInfo.bankName && newBankInfo.accountNumber && newBankInfo.userBankName) {
      try {
        const data = await walletApi.createBankInfor(newBankInfo);
        if (!data.success) {
          toast.error(data.messages || 'Không thể thêm tài khoản ngân hàng');
          return;
        }
        toast.success('Thêm tài khoản ngân hàng thành công');
        const addedBank = data.content;
        if (addedBank) {
          setBankInfos((prev) => [
            ...prev,
            {
              id: addedBank.id,
              bankName: addedBank.bankName,
              accountNumber: addedBank.accountNumber,
              userBankName: addedBank.userBankName,
              bankBin: addedBank.bankBin,
              addedDate: new Date().toISOString(),
            },
          ]);
          setNewBankInfo({
            bankName: '',
            accountNumber: '',
            userBankName: '',
            bankBin: '',
          });

          setIsAddingBank(false);
          refreshBankInfos();
        }
      } catch (error) {
        console.error('Error adding bank:', error);
        toast.error('Có lỗi xảy ra khi thêm tài khoản ngân hàng');
      }
    }
  };

  // ...existing code...
  const handleEditBank = (bank: BankInfor) => {
    setEditingBank(bank);
    setNewBankInfo({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      userBankName: bank.userBankName,
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
        const response = await walletApi.updateBankInfor(editingBank.id, newBankInfo);
        if (!response.success) {
          toast.error(response.messages || 'Không thể cập nhật tài khoản ngân hàng');
          return;
        }
        toast.success('Cập nhật tài khoản ngân hàng thành công');
        setBankInfos(
          bankInfos.map((bank) =>
            bank.id === editingBank.id ? { ...bank, ...newBankInfo } : bank,
          ),
        );
        setEditingBank(null);
        setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '' });
        setIsAddingBank(false);
        refreshBankInfos();
      } catch (error) {
        console.error('Error updating bank:', error);
        toast.error('Có lỗi xảy ra khi cập nhật tài khoản ngân hàng');
      }
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    // Thêm confirmation
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?')) {
      return;
    }

    try {
      const response = await walletApi.deleteBankInfor(bankId);
      if (!response || !response.success) {
        toast.error('Không thể xóa tài khoản ngân hàng');
        return;
      }

      setBankInfos(bankInfos.filter((bank) => bank.id !== bankId));
      toast.success('Xóa tài khoản ngân hàng thành công');
      refreshBankInfos();
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Có lỗi xảy ra khi xóa tài khoản ngân hàng');
    }
  };
  const handleSetDefault = async (bankId: string) => {
    try {
      setBankInfos(
        bankInfos.map((bank) => ({
          ...bank,
        })),
      );
    } catch (error) {
      console.error('Error setting default bank:', error);
    }
  };

  const cancelBankForm = () => {
    setIsAddingBank(false);
    setEditingBank(null);
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
  const getBankIconUrl = (bankName: string) => {
    const bank = listBanks.find((b) => b.name === bankName);
    return bank ? bank.url : '';
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

  const BankIcon = ({ bankUrl, bankName }: { bankUrl?: string; bankName: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-full h-full rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-8 h-8 text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Thông tin ngân hàng</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản ngân hàng để rút tiền</p>
        </div>
        <Button
          onClick={() => setIsAddingBank(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên ngân hàng, số tài khoản..."
            className="pl-10 border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleKeyPress}
          />
        </div>
        <div className="text-sm text-gray-500 ml-4">
          <strong>{total}</strong> tài khoản
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isAddingBank && (
        <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editingBank ? 'Chỉnh sửa tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng mới'}
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
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
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

      <div className="grid gap-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: pageSize }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-[140px] h-[84px] bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : bankInfos.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-12 text-center">
              <Building2 className="h-35 w-21 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Không tìm thấy tài khoản nào' : 'Chưa có tài khoản ngân hàng'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Thử tìm kiếm với từ khóa khác'
                  : 'Thêm tài khoản ngân hàng để có thể rút tiền dễ dàng hơn'}
              </p>
            </CardContent>
          </Card>
        ) : (
          bankInfos
            .filter((bank) => !editingBank || bank.id !== editingBank.id)
            .map((bank) => (
              <Card key={bank.id} className="border transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-[140px] h-[84px]">
                          <BankIcon
                            bankUrl={getBankIconUrl(bank.bankName)}
                            bankName={bank.bankName}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-gray-900">{bank.bankName}</h4>
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
                      <Button variant="outline" size="sm" onClick={() => handleEditBank(bank)}>
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
            ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && bankInfos.length > 0 && (
        <div className="border rounded-lg bg-white">
          <div className="p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPage}
              totalItems={total}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              pageSizeOptions={[6, 12, 24]}
              className="text-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
