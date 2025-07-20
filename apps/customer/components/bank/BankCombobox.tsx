'use client';

import { BankResponse } from '@services/payment-method.api';
import { useState } from 'react';

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

  const selected = banks.find((b) => b.bin === value);

  const filtered =
    query === ''
      ? banks
      : banks.filter((b) => `${b.bin} ${b.name}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="form-control w-full relative">
      <label className="label">
        <span className="label-text">Ngân hàng</span>
      </label>
      <input
        className="input input-bordered w-full text-gray-700"
        value={query || (selected ? `${selected.bin} – ${selected.name}` : '')}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Chọn ngân hàng..."
      />
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-base-100 border border-gray-200 rounded-box shadow-md max-h-60 overflow-auto text-gray-700">
          {filtered.length === 0 && <li className="px-4 py-2 text-gray-500">Không tìm thấy</li>}
          {filtered.map((bank) => (
            <li
              key={bank.id}
              onClick={() => {
                onChange(bank.bin);
                setQuery('');
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer"
            >
              {bank.bin} – {bank.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
