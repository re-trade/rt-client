'use client';

import { useToast } from '@/context/ToastContext';
import { usePaymentMethod } from '@/hooks/use-payment-method';
import BankAccountCard from '@components/bank/BankAccountCard';
import BankAccountModal from '@components/bank/BankAccountModal';
import Toast from '@components/toast/Toast';
import { BankAccountResponse } from '@services/payment-method.api';
import { Building2, Lock, Plus, Shield, Wallet } from 'lucide-react';

export default function BankAccountsPage() {
  const {
    banks,
    bankAccounts,
    editingAccount,
    isBankAccountLoading,
    setEditingAccount,
    createBankAccount,
    form,
    setForm,
    isModalOpen,
    setIsModalOpen,
    updateUserBankAccount,
  } = usePaymentMethod();
  const { messages } = useToast();

  const openAddModal = () => {
    setForm({ selectedBankBin: '', accountNumber: '', userBankName: '' });
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account: BankAccountResponse) => {
    setForm({
      id: account.id,
      selectedBankBin: account.bankBin,
      accountNumber: account.accountNumber,
      userBankName: account.userBankName,
    });
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ selectedBankBin: '', accountNumber: '', userBankName: '', id: '' });
    setEditingAccount(null);
  };

  const handleDelete = async (id: string) => {};

  const handleSave = async () => {
    if (!form.id) {
      await createBankAccount({
        userBankName: form.userBankName,
        accountNumber: form.accountNumber,
        selectedBankBin: form.selectedBankBin,
      });
    } else {
      await updateUserBankAccount(
        {
          userBankName: form.userBankName,
          accountNumber: form.accountNumber,
          selectedBankBin: form.selectedBankBin,
        },
        form.id,
      );
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <Toast messages={messages} />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Tài khoản ngân hàng</h1>
                  <p className="text-[#121212] mt-1">Quản lý tài khoản ngân hàng cho thanh toán</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#121212]">Tổng số tài khoản</p>
                <p className="text-2xl font-bold">{bankAccounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bảo mật</p>
                <p className="text-lg font-bold text-gray-800">256-bit SSL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã lưu</p>
                <p className="text-lg font-bold text-gray-800">{bankAccounts.length} tài khoản</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Danh sách tài khoản ngân hàng</h2>
            <button
              onClick={openAddModal}
              className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tài khoản mới</span>
            </button>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có tài khoản ngân hàng</h3>
              <p className="text-gray-600 mb-6">
                Thêm tài khoản ngân hàng để nhận thanh toán dễ dàng và nhanh chóng
              </p>
              <button
                onClick={openAddModal}
                className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm tài khoản đầu tiên</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bankAccounts.map((account) => {
                return (
                  <BankAccountCard
                    key={account.id}
                    account={account}
                    banks={banks}
                    openEditModal={openEditModal}
                    handleDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl shadow-md p-6 border border-amber-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-500 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">🔒 Bảo mật thông tin</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Thông tin tài khoản ngân hàng của bạn được mã hóa và bảo vệ bằng công nghệ SSL
                256-bit. Chúng tôi tuân thủ các tiêu chuẩn bảo mật ngân hàng và không lưu trữ thông
                tin nhạy cảm.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BankAccountModal
        open={isModalOpen}
        editingAccount={editingAccount}
        form={form}
        banks={banks}
        loading={isBankAccountLoading}
        onChange={(k, v) => setForm({ ...form, [k]: v })}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
