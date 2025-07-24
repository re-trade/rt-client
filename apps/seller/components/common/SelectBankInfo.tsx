'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, Plus } from 'lucide-react';
import { walletApi, BankInfor, BankResponse } from '@/service/wallet.api';
import { useEffect, useState } from 'react';

interface SelectBankInfoProps {
  onCloseWithdrawDialog: () => void; // Hàm để đóng WithdrawDialog
  onOpenAddBankForm: () => void; // Hàm để mở form thêm tài khoản ngân hàng
}

export function SelectBankInfo({ onCloseWithdrawDialog, onOpenAddBankForm }: SelectBankInfoProps) {
  const [bankAccounts, setBankAccounts] = useState<BankInfor[]>([]);
  const [listBanks, setListBanks] = useState<BankResponse[]>([]);

  // Fetch danh sách tài khoản ngân hàng và danh sách ngân hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankInfo, banks] = await Promise.all([
          walletApi.getBankInfos(),
          walletApi.getTheBanks(),
        ]);
        console.log('BankInfo:', bankInfo);
        console.log('ListBanks:', banks);
        setBankAccounts(bankInfo);
        setListBanks(banks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Lấy URL logo ngân hàng
  const getBankIconUrl = (bankName: string) => {
    const bank = listBanks.find((b) => b.name === bankName);
    return bank ? bank.url : '';
  };

  // Component hiển thị logo ngân hàng
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

  // Xử lý khi nhấn nút "Thêm tài khoản ngân hàng"
  const handleAddBankClick = () => {
    onCloseWithdrawDialog(); // Đóng WithdrawDialog
    onOpenAddBankForm(); // Mở form thêm tài khoản ngân hàng
  };

  return (
    <div className="grid gap-4">
      {bankAccounts.map((bank) => (
        <Card key={bank.id} className="border transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-[140px] h-[84px]">
                    <BankIcon bankUrl={getBankIconUrl(bank.bankName)} bankName={bank.bankName} />
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
            </div>
          </CardContent>
        </Card>
      ))}

      {bankAccounts.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có tài khoản ngân hàng
            </h3>
            <p className="text-gray-500 mb-4">
              Thêm tài khoản ngân hàng để có thể rút tiền dễ dàng hơn
            </p>
            <Button variant="outline" className="w-full" onClick={handleAddBankClick}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài khoản ngân hàng
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}