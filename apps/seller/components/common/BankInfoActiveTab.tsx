'use client';
import { SelectBank } from '@/components/common/SelectBank';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BankInfor, BankResponse, CreateBankInfor, walletApi } from '@/service/wallet.api';
import { Building2, CheckCircle, CreditCard, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BankInfoActiveTabProps {
  isAddingBank: boolean;
  setIsAddingBank: (value: boolean) => void;
}

export function BankInfoActiveTab({ isAddingBank, setIsAddingBank }: BankInfoActiveTabProps) {
  const [listBanks, setListBanks] = useState<BankResponse[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<BankInfor | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankInfor[]>([]);
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
        const [wallet, listBanks, bankInfo] = await Promise.all([
          walletApi.getWalletBySeller(),
          walletApi.getTheBanks(),
          walletApi.getBankInfos(),
        ]);
        setListBanks(listBanks);
        setBankAccounts(bankInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
          setBankAccounts((prev) => [
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
        setBankAccounts(
          bankAccounts.map((bank) =>
            bank.id === editingBank.id ? { ...bank, ...newBankInfo } : bank,
          ),
        );
        setEditingBank(null);
        setNewBankInfo({ bankName: '', accountNumber: '', userBankName: '', bankBin: '' });
        setIsAddingBank(false);
      } catch (error) {
        console.error('Error updating bank:', error);
        toast.error('Có lỗi xảy ra khi cập nhật tài khoản ngân hàng');
      }
    }
  };

  const handleDeleteBank = async () => {
    if (!bankToDelete) return;

    try {
      const response = await walletApi.deleteBankInfor(bankToDelete.id);
      if (!response || !response.success) {
        toast.error(response.messages || 'Không thể xóa tài khoản ngân hàng');
        return;
      }
      setBankAccounts(bankAccounts.filter((bank) => bank.id !== bankToDelete.id));
      toast.success('Xóa tài khoản ngân hàng thành công');
      setIsDeleteDialogOpen(false);
      setBankToDelete(null);
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Có lỗi xảy ra khi xóa tài khoản ngân hàng');
    }
  };

  const confirmDeleteBank = (bank: BankInfor) => {
    setBankToDelete(bank);
    setIsDeleteDialogOpen(true);
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
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Thông tin ngân hàng</h3>
        <Button
          onClick={() => setIsAddingBank(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

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
        {bankAccounts
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
                      onClick={() => confirmDeleteBank(bank)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa tài khoản ngân hàng{' '}
                <strong>{bankToDelete?.bankName}</strong> với số tài khoản{' '}
                <strong>"{bankToDelete?.accountNumber}"</strong>?
                <br />
                <span className="text-red-600 font-medium">Hành động này không thể hoàn tác.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setBankToDelete(null);
                }}
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteBank} className="bg-red-600 hover:bg-red-700">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {bankAccounts.length === 0 && !isAddingBank && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-12 text-center">
              <Building2 className="h-35 w-21 text-gray-400 mx-auto mb-4" />
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
  );
}
