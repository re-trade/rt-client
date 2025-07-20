'use client';

import { useToast } from '@/context/ToastContext';
import { usePaymentMethod } from '@/hooks/use-payment-method';
import Toast from '@components/toast/Toast';
import { BankAccountResponse } from '@services/payment-method.api';
import {
  Building2,
  Calendar,
  CreditCard,
  Edit3,
  Lock,
  Plus,
  Shield,
  Star,
  Trash2,
  User,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

const getBankGradient = (bankCode: string) => {
  const gradients = {
    VTB: 'from-blue-500 to-blue-600',
    VCB: 'from-green-500 to-emerald-600',
    BIDV: 'from-red-500 to-red-600',
    MB: 'from-purple-500 to-violet-600',
    TCB: 'from-orange-500 to-orange-600',
    default: 'from-gray-500 to-gray-600',
  };
  return gradients[bankCode as keyof typeof gradients] || gradients.default;
};

export default function BankAccountsPage() {
  const {
    banks,
    bankAccounts,
    editingAccount,
    isBankAccountLoading,
    setEditingAccount,
    createBankAccount,
  } = usePaymentMethod();
  const { messages } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    selectedBank: '',
    accountNumber: '',
    userBankName: '',
  });

  const openAddModal = () => {
    setForm({ selectedBank: '', accountNumber: '', userBankName: '' });
    setEditingAccount(null);
    setModalOpen(true);
  };

  const openEditModal = (account: BankAccountResponse) => {
    const bank = banks.find((b) => b.bin === account.bankBin);
    setForm({
      selectedBank: bank?.bin || '',
      accountNumber: account.accountNumber,
      userBankName: account.userBankName,
    });
    setEditingAccount(account);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ selectedBank: '', accountNumber: '', userBankName: '' });
    setEditingAccount(null);
  };

  const handleDelete = async (id: string) => {};

  const handleSave = async () => {
    if (!form.selectedBank || !form.accountNumber || !form.userBankName) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    await createBankAccount({
      userBankName: form.userBankName,
      accountNumber: form.accountNumber,
      bankName: form.selectedBank,
    });
    closeModal();
  };

  const formatAccountNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 20);
  };

  const getSelectedBankInfo = () => {
    return banks.find((b) => b.bin === form.selectedBank);
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
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tài khoản mặc định</p>
                <p className="text-lg font-bold text-gray-800">
                  {bankAccounts.find((a) => a.isDefault)?.bankName || 'Chưa có'}
                </p>
              </div>
            </div>
          </div>

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
                const bank = banks.find((b) => b.bin === account.bankBin);
                return (
                  <div
                    key={account.id}
                    className="relative group border border-gray-200 rounded-2xl p-6 hover:border-[#FFD2B2] hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`relative bg-gradient-to-r ${getBankGradient(account.bankName)} rounded-xl p-4 text-white mb-4 shadow-lg`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-3">
                          {bank && (
                            <img
                              src={bank.url}
                              alt={bank.name}
                              className="w-8 h-8 rounded-md bg-white/20 p-1"
                            />
                          )}
                          <div className="text-lg font-bold">{account.bankName}</div>
                        </div>
                        {account.isDefault && (
                          <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                            Mặc định
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 opacity-75" />
                          <div className="text-lg font-mono tracking-wider">
                            {account.accountNumber.replace(/(.{4})/g, '$1 ').trim()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 opacity-75" />
                          <div>
                            <div className="text-sm font-medium">{account.userBankName}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Thêm ngày: {account.addedDate}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(account)}
                        className="flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                        aria-label={`Sửa tài khoản ${account.bankName}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        disabled={isBankAccountLoading}
                        className="flex items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Xóa tài khoản ${account.bankName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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

      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeModal} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingAccount ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}
              </h2>

              <div className="space-y-4">
                {/* Bank Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngân hàng</label>
                  <select
                    value={form.selectedBank}
                    onChange={(e) => setForm({ ...form, selectedBank: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all"
                  >
                    <option value="">Chọn ngân hàng</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.bin}>
                        {bank.code} - {bank.name}
                      </option>
                    ))}
                  </select>
                  {getSelectedBankInfo() && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      <img
                        src={getSelectedBankInfo()?.url}
                        alt={getSelectedBankInfo()?.name}
                        className="w-6 h-6 rounded"
                      />
                      <span>{getSelectedBankInfo()?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    placeholder="NGUYEN VAN A"
                    value={form.userBankName}
                    onChange={(e) =>
                      setForm({ ...form, userBankName: e.target.value.toUpperCase() })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={form.accountNumber}
                    onChange={(e) => {
                      const formatted = formatAccountNumber(e.target.value);
                      setForm({ ...form, accountNumber: formatted });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isBankAccountLoading}
                  className="px-6 py-3 rounded-xl bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {isBankAccountLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#121212] border-t-transparent"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>{editingAccount ? 'Cập nhật' : 'Thêm tài khoản'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
