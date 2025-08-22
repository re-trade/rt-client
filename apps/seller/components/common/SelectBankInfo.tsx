'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BankInfor, BankResponse, walletApi } from '@/service/wallet.api';
import { Building2, ChevronDown, CreditCard, Plus, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SelectBankInfoProps {
  selectedBank: BankInfor | null;
  onCloseWithdrawDialog: () => void;
  onOpenAddBankForm: () => void;
  onSelectBank?: (bank: BankInfor) => void;
}

export function SelectBankInfo({
  selectedBank,
  onCloseWithdrawDialog,
  onOpenAddBankForm,
  onSelectBank,
}: SelectBankInfoProps) {
  const [bankAccounts, setBankAccounts] = useState<BankInfor[]>([]);
  const [listBanks, setListBanks] = useState<BankResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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
  const BankIcon = ({
    bankUrl,
    bankName,
    size = 'default',
  }: {
    bankUrl?: string;
    bankName: string;
    size?: 'default' | 'small';
  }) => {
    const [imageError, setImageError] = useState(false);
    const sizeClass = size === 'small' ? 'w-6 h-4' : 'w-12 h-8';
    const iconSize = size === 'small' ? 'w-4 h-4' : 'w-6 h-6';

    return (
      <div
        className={`${sizeClass} rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border`}
      >
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain p-1"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className={`${iconSize} text-gray-400`} />
        )}
      </div>
    );
  };

  // Xử lý chọn ngân hàng
  const handleSelectBank = (bank: BankInfor) => {
    onSelectBank?.(bank);
    setIsOpen(false);
  };

  // Xử lý khi nhấn nút "Thêm tài khoản ngân hàng"
  const handleAddBankClick = () => {
    setIsOpen(false);
    onCloseWithdrawDialog();
    onOpenAddBankForm();
  };

  // Ẩn số tài khoản (chỉ hiện 4 số cuối)
  // const maskAccountNumber = (accountNumber: string) => {
  //   if (accountNumber.length <= 4) return accountNumber;
  //   return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  // };

  return (
    <div className="relative">
      {/* Select Button */}
      <Button
        variant="outline"
        className="w-full h-auto p-4 justify-between hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1">
          {selectedBank ? (
            <>
              <BankIcon
                bankUrl={getBankIconUrl(selectedBank.bankName)}
                bankName={selectedBank.bankName}
                size="small"
              />
              <div className="text-left flex-1">
                <div className="font-medium text-gray-900">{selectedBank.bankName}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <CreditCard className="h-3 w-3" />
                  <span className="font-mono">{selectedBank.accountNumber}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-left">Chọn tài khoản ngân hàng</div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Danh sách tài khoản ngân hàng */}
          {bankAccounts.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-2 py-1 mb-2 font-medium">
                Tài khoản đã liên kết
              </div>
              {bankAccounts.map((bank, index) => (
                <div
                  key={bank.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedBank?.id === bank.id ? 'bg-green-50 border border-green-200' : ''
                  }`}
                  onClick={() => handleSelectBank(bank)}
                >
                  <div className="flex items-center gap-3">
                    <BankIcon
                      bankUrl={getBankIconUrl(bank.bankName)}
                      bankName={bank.bankName}
                      size="small"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{bank.bankName}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            <Star className="w-2.5 h-2.5 mr-1" />
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CreditCard className="h-3 w-3" />
                        <span className="font-mono">{bank.accountNumber}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{bank.userBankName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          {bankAccounts.length > 0 && <div className="border-t border-gray-200"></div>}

          {/* Thêm tài khoản ngân hàng */}
          <div className="p-2">
            <div
              className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 border-2 border-dashed border-gray-200"
              onClick={handleAddBankClick}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-gray-100 rounded flex items-center justify-center">
                  <Plus className="h-3 w-3 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Thêm tài khoản ngân hàng</div>
                  <div className="text-xs text-gray-500">
                    Liên kết thêm tài khoản để có nhiều lựa chọn
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin bảo mật */}
          {bankAccounts.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium">Bảo mật cao</p>
                    <p>Tài khoản đã xác thực và mã hóa</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
