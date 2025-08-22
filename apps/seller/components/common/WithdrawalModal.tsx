'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BankInfor, walletApi, WithdrawCreate } from '@/service/wallet.api';
import { CreditCard, Wallet, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface WithdrawalModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  availableBalance: number;
  onWithdrawSuccess: () => void;
}

const WithdrawalModal = ({
  isModalOpen,
  setIsModalOpen,
  availableBalance,
  onWithdrawSuccess,
}: WithdrawalModalProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawContent, setWithdrawContent] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankInfor | null>(null);
  const [userBankAccounts, setUserBankAccounts] = useState<BankInfor[]>([]);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [listBanks, setListBanks] = useState<any[]>([]);

  const MIN_WITHDRAW = 3000;
  const MAX_WITHDRAW = availableBalance;

  useEffect(() => {
    if (isModalOpen) {
      fetchUserBankAccounts();
    }
  }, [isModalOpen]);

  const fetchUserBankAccounts = async () => {
    setLoadingBankAccounts(true);
    try {
      const [accounts, banks] = await Promise.all([
        walletApi.getBankInfos(),
        walletApi.getTheBanks(),
      ]);
      setUserBankAccounts(accounts);
      setListBanks(banks);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoadingBankAccounts(false);
    }
  };

  const handleWithdrawalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBankAccount || !withdrawAmount || !withdrawContent) {
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) {
      return;
    }

    setProcessingWithdrawal(true);
    try {
      const withdrawData: WithdrawCreate = {
        amount: amount,
        bankProfileId: selectedBankAccount.id,
        content: withdrawContent,
      };

      await walletApi.createWithdraw(withdrawData);
      setIsModalOpen(false);
      resetForm();
      onWithdrawSuccess();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const resetForm = () => {
    setWithdrawAmount('');
    setWithdrawContent('');
    setSelectedBankAccount(null);
  };

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (cleanValue === '') {
      setWithdrawAmount('');
      return;
    }

    const numericValue = parseInt(cleanValue, 10);
    if (numericValue <= MAX_WITHDRAW) {
      setWithdrawAmount(cleanValue);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  const getBankIconUrl = (bankName: string) => {
    const bank = listBanks.find((b) => b.name === bankName);
    return bank ? bank.url : '';
  };

  const BankIcon = ({ account }: { account: BankInfor }) => {
    const [imageError, setImageError] = useState(false);
    const bankUrl = getBankIconUrl(account.bankName);

    return (
      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={account.bankName}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-full h-full bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-600 text-xs font-medium">
              {account.bankName?.charAt(0) || 'B'}
            </span>
          </div>
        )}
      </div>
    );
  };

  const isAmountValid =
    withdrawAmount &&
    !isNaN(parseFloat(withdrawAmount)) &&
    parseFloat(withdrawAmount) >= MIN_WITHDRAW &&
    parseFloat(withdrawAmount) <= MAX_WITHDRAW;

  const isFormValid =
    availableBalance > 0 &&
    selectedBankAccount &&
    withdrawAmount &&
    withdrawContent.trim() &&
    isAmountValid &&
    !processingWithdrawal;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="pb-4 border-b border-orange-100">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Wallet className="w-5 h-5 text-orange-500" />
            Rút tiền từ ví
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Số dư khả dụng:{' '}
            <span className="font-medium text-orange-600">{formatCurrency(availableBalance)}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleWithdrawalSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Số tiền muốn rút</Label>
            <div className="relative">
              <Input
                type="text"
                value={withdrawAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Nhập số tiền"
                className="h-10 pr-12 border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                maxLength={10}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                VND
              </div>
            </div>
            {withdrawAmount && parseFloat(withdrawAmount) < MIN_WITHDRAW && (
              <p className="text-red-600 text-xs">
                Số tiền tối thiểu là {formatCurrency(MIN_WITHDRAW)}
              </p>
            )}
            {withdrawAmount && parseFloat(withdrawAmount) > MAX_WITHDRAW && (
              <p className="text-red-600 text-xs">Số tiền vượt quá số dư khả dụng</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Chọn tài khoản ngân hàng</Label>
            {loadingBankAccounts ? (
              <div className="flex items-center justify-center py-8 bg-gray-50 rounded border">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                <span className="ml-2 text-gray-600 text-sm">Đang tải...</span>
              </div>
            ) : userBankAccounts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded border border-dashed">
                <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">Chưa có tài khoản ngân hàng</p>
                <p className="text-gray-500 text-xs">
                  Vui lòng liên hệ quản trị viên để thêm tài khoản
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedBankAccount ? (
                  <div className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BankIcon account={selectedBankAccount} />
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {selectedBankAccount.bankName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedBankAccount.accountNumber} - {selectedBankAccount.userBankName}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedBankAccount(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userBankAccounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => setSelectedBankAccount(account)}
                        className="w-full border border-gray-200 hover:border-orange-300 rounded p-3 text-left hover:bg-orange-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BankIcon account={account} />
                          <div>
                            <p className="font-medium text-sm text-gray-800">{account.bankName}</p>
                            <p className="text-xs text-gray-600">
                              {account.accountNumber} - {account.userBankName}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Nội dung chuyển khoản</Label>
            <Textarea
              value={withdrawContent}
              onChange={(e) => setWithdrawContent(e.target.value)}
              placeholder="Nhập nội dung chuyển khoản..."
              className="min-h-[80px] border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500">{withdrawContent.length}/200</div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-400 disabled:opacity-70"
              disabled={!isFormValid}
            >
              {processingWithdrawal ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận rút tiền'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
