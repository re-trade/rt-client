import { BankResponse, getBanks } from '@services/payment-method.api';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  bankModalOpen: boolean;
  setBankModalOpen: (open: boolean) => void;
  bankSearch: string;
  setBankSearch: (search: string) => void;
  selectedBank: BankResponse | null;
  setSelectedBank: (bank: BankResponse) => void;
}

const BankSelectionModal = ({
  bankModalOpen,
  setBankModalOpen,
  bankSearch,
  setBankSearch,
  setSelectedBank,
}: Props) => {
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search banks when search term changes or modal opens
  useEffect(() => {
    if (!bankModalOpen) {
      return;
    }

    const searchBanks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBanks(0, 100, bankSearch);
        if (response?.success) {
          setBanks(response.content || []);
        } else {
          setBanks([]);
          setError('Failed to load banks');
        }
      } catch (err) {
        console.error('Error fetching banks:', err);
        setBanks([]);
        setError('Error loading banks');
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      searchBanks();
    }, 300); // Debounce search to avoid too many API calls

    return () => clearTimeout(handler);
  }, [bankSearch, bankModalOpen]);

  // Reset search when modal closes
  useEffect(() => {
    if (!bankModalOpen) {
      setBankSearch('');
      setBanks([]);
      setError(null);
    }
  }, [bankModalOpen, setBankSearch]);
  return (
    <dialog id="bank_modal" className={`modal ${bankModalOpen ? 'modal-open' : ''}`}>
      <div className="bg-white text-[#121212] rounded-xl shadow-xl w-11/12 max-w-3xl p-0 overflow-hidden">
        <div className="bg-[#FFD2B2] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#121212]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
              />
            </svg>
            <h3 className="text-xl font-bold text-[#121212]">Chọn ngân hàng</h3>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[#121212] hover:bg-white/40 transition-colors"
            onClick={() => setBankModalOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#121212] mb-1 block">
              Tìm kiếm ngân hàng
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên ngân hàng..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="input w-full px-4 py-2.5 border border-[#525252]/20 text-[#121212] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD2B2] focus:border-[#FFD2B2] transition-all pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[#525252]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto border border-[#525252]/20 rounded-lg">
            {loading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD2B2]"></div>
                <p className="mt-3 text-[#525252] font-medium">Đang tải danh sách ngân hàng...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <div className="text-red-500 font-medium">{error}</div>
                <p className="text-[#525252] text-sm mt-1">Vui lòng thử lại sau</p>
              </div>
            ) : (
              banks.map((bank) => (
                <div
                  key={bank.bin}
                  className="p-4 cursor-pointer hover:bg-[#FFD2B2]/10 transition-all duration-200 border-b border-[#525252]/10 last:border-b-0"
                  onClick={() => {
                    setSelectedBank(bank);
                    setBankModalOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    {bank.url ? (
                      <Image
                        width={40}
                        height={40}
                        src={bank.url}
                        alt={bank.name}
                        className="w-10 h-10 mr-4 object-contain rounded-lg border border-[#525252]/20"
                      />
                    ) : (
                      <div className="w-10 h-10 mr-4 bg-[#FFD2B2] rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-[#121212]">
                          {bank.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-[#121212]">{bank.name}</span>
                      <p className="text-sm text-[#525252]">Nhấn để chọn</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!loading && !error && banks.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto bg-[#FFD2B2] rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-[#121212]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                    />
                  </svg>
                </div>
                <p className="text-[#121212] font-medium">Không tìm thấy ngân hàng phù hợp</p>
                <p className="text-[#525252] text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setBankModalOpen(false)}
            className="px-6 py-2.5 bg-[#525252]/10 text-[#121212] rounded-lg hover:bg-[#525252]/20 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={() => setBankModalOpen(false)}></div>
    </dialog>
  );
};
export default BankSelectionModal;
