'use client';

import { BankResponse, getBanks } from '@services/payment-method.api';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const BankIcon = ({ bank }: { bank: BankResponse }) => {
  return (
    <div className="w-10 h-10 mr-3 bg-white rounded-lg border border-orange-200 flex items-center justify-center overflow-hidden shadow-sm">
      {bank.url ? (
        <img
          src={bank.url}
          alt={bank.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div
        className={`w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded flex items-center justify-center ${bank.url ? 'hidden' : ''}`}
      >
        <span className="text-white text-xs font-bold">
          {bank.code?.charAt(0) || 'B'}
        </span>
      </div>
    </div>
  );
};

export default function BankCombobox({
  banks,
  value,
  onChange,
}: {
  banks: BankResponse[];
  value: string;
  onChange: (bin: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [bankList, setBankList] = useState<BankResponse[]>([]);
  const selected = banks.find((b) => b.bin === value);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchBankList = async () => {
        const params = new URLSearchParams();
        if (query) params.append('name', query);
        const result = await getBanks(0, 10, params.toString());
        if (result && result.success) {
          setBankList(result.content);
        }
      };
      fetchBankList();
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="w-full relative">
      <label className="block text-sm font-semibold text-gray-800 mb-2">Ngân hàng</label>
      <div className="relative">
        <div className="flex items-center">
          {selected && (
            <div className="absolute left-3 z-10">
              <BankIcon bank={selected} />
            </div>
          )}
          <input
            className={`w-full py-3 border border-orange-200 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm hover:shadow-md ${
              selected ? 'pl-16 pr-12' : 'px-4 pr-12'
            }`}
            value={query || (selected ? `${selected.code} – ${selected.name}` : '')}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder="Tìm kiếm và chọn ngân hàng..."
          />
        </div>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown
            className={`h-5 w-5 text-orange-500 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      {open && (
        <ul className="absolute z-30 mt-2 w-full bg-white border border-orange-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {bankList.length === 0 && (
            <li className="px-4 py-4 text-gray-600 text-center">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5.657-2.343m0-11.314A7.962 7.962 0 0112 4a7.962 7.962 0 015.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Không tìm thấy ngân hàng
              </div>
            </li>
          )}
          {bankList.map((bank) => (
            <li
              key={bank.id}
              onClick={() => {
                onChange(bank.bin);
                setQuery('');
                setOpen(false);
              }}
              className="px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 cursor-pointer transition-all duration-200 border-b border-orange-100 last:border-b-0 group"
            >
              <div className="flex items-center">
                <BankIcon bank={bank} />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                    {bank.name}
                  </span>
                  <p className="text-sm text-gray-600 truncate">{bank.code}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-600 mt-2">Chọn ngân hàng mà bạn muốn thêm tài khoản</p>
    </div>
  );
}
