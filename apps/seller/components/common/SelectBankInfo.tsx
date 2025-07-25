'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BankInfor, BankResponse, walletApi } from '@/service/wallet.api';
import { Building2, CreditCard, Plus, Check, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SelectBankInfoProps {
  onCloseWithdrawDialog: () => void;
  onOpenAddBankForm: () => void;
  onSelectBank?: (bank: BankInfor) => void;
}

export function SelectBankInfo({ 
  onCloseWithdrawDialog, 
  onOpenAddBankForm,
  onSelectBank 
}: SelectBankInfoProps) {
  const [bankAccounts, setBankAccounts] = useState<BankInfor[]>([]);
  const [listBanks, setListBanks] = useState<BankResponse[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');

  // Fetch danh sách tài khoản ngân hàng và danh sách ngân hàng
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankInfo, banks] = await Promise.all([
          walletApi.getBankInfos(),
          walletApi.getTheBanks(),
        ]);
        setBankAccounts(bankInfo);
        setListBanks(banks);
        
        // Tự động chọn tài khoản đầu tiên nếu có
        // if (bankInfo.length > 0) {
        //   setSelectedBankId(bankInfo[0].id);
        //   onSelectBank?.(bankInfo[0]);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [onSelectBank]);

  // Lấy URL logo ngân hàng
  const getBankIconUrl = (bankName: string) => {
    const bank = listBanks.find((b) => b.name === bankName);
    return bank ? bank.url : '';
  };

  // Component hiển thị logo ngân hàng
  const BankIcon = ({ bankUrl, bankName }: { bankUrl?: string; bankName: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain p-2"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-8 h-8 text-gray-400" />
        )}
      </div>
    );
  };

  // Xử lý chọn ngân hàng
  const handleSelectBank = (bank: BankInfor) => {
    setSelectedBankId(bank.id);
    onSelectBank?.(bank);
  };

  // Xử lý khi nhấn nút "Thêm tài khoản ngân hàng"
  const handleAddBankClick = () => {
    onCloseWithdrawDialog();
    onOpenAddBankForm();
  };

  // Ẩn số tài khoản (chỉ hiện 4 số cuối)
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  return (
    <div className="space-y-4">
      {bankAccounts.length > 0 && (
        <div className="space-y-3">
          {bankAccounts.map((bank, index) => (
            <Card 
              key={bank.id} 
              className={`border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedBankId === bank.id 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectBank(bank)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-10">
                        <BankIcon 
                          bankUrl={getBankIconUrl(bank.bankName)} 
                          bankName={bank.bankName} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {bank.bankName}
                        </h4>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            <Star className="w-3 h-3 mr-1" />
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span className="font-mono tracking-wider">
                            {maskAccountNumber(bank.accountNumber)}
                          </span>
                        </div>
                        <div className="font-medium text-gray-900 text-sm">
                          {bank.userBankName}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkbox tùy chỉnh */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedBankId === bank.id 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedBankId === bank.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Thêm tài khoản ngân hàng */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">
                {bankAccounts.length === 0 ? 'Chưa có tài khoản ngân hàng' : 'Thêm tài khoản khác'}
              </h3>
              <p className="text-sm text-gray-500">
                {bankAccounts.length === 0 
                  ? 'Thêm tài khoản ngân hàng để có thể rút tiền dễ dàng hơn'
                  : 'Liên kết thêm tài khoản ngân hàng để có nhiều lựa chọn hơn'
                }
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-dashed hover:bg-gray-50" 
              onClick={handleAddBankClick}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài khoản ngân hàng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin bảo mật */}
      {bankAccounts.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Thông tin bảo mật:</p>
              <p>Tài khoản ngân hàng đã được xác thực và bảo mật. Mọi giao dịch đều được mã hóa.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}