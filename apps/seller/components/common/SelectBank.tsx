'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BankResponse, walletApi } from '@/service/wallet.api';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';

interface SelectBankProps {
  value: string;
  currentBankId?: string;
  onChange: (bank: { id: string; name: string; code: string; bin: string } | null) => void;
}

export function SelectBank({ value, currentBankId, onChange }: SelectBankProps) {
  const [banks, setBanks] = useState<BankResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredBanks, setFilteredBanks] = useState<BankResponse[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const data = await walletApi.getTheBanks();
        setBanks(data);
        setFilteredBanks(data);
        if (currentBankId) {
          const current = data.find((b) => b.id === currentBankId);
          if (current) {
            setInputValue(current.name);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ngân hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, [currentBankId]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredBanks(banks);
    } else {
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          bank.code.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredBanks(filtered);
    }
  }, [inputValue, banks]);

  const selectedBank = banks.find((b) => b.id === value);

  useEffect(() => {
    if (selectedBank && !open) {
      setInputValue(selectedBank.name);
    }
  }, [selectedBank, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        if (!selectedBank) {
          setInputValue('');
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, selectedBank]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (selectedBank && newValue !== selectedBank.name) {
      onChange(null);
    }

    if (!open) {
      setOpen(true);
    }
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputClick = () => {
    setOpen(true);
    if (selectedBank && inputValue === selectedBank.name) {
      setInputValue('');
    }
  };

  const handleSelectBank = (bank: BankResponse) => {
    onChange({
      id: bank.id,
      name: bank.name,
      code: bank.code,
      bin: bank.bin,
    });
    setInputValue(bank.name);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  // Component để hiển thị icon ngân hàng
  const BankIcon = ({ bank }: { bank: BankResponse }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="flex-shrink-0 w-6 h-6 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && bank.url ? (
          <img
            src={bank.url}
            alt={bank.name}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-4 h-4 text-gray-500" />
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="flex items-center">
          {selectedBank && (
            <div className="absolute left-3 z-10">
              <BankIcon bank={selectedBank} />
            </div>
          )}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            placeholder={loading ? 'Đang tải...' : 'Chọn hoặc tìm ngân hàng...'}
            disabled={loading}
            className={cn('pr-8', selectedBank ? 'pl-12' : 'pl-3')}
            autoComplete="off"
          />
        </div>
        <ChevronsUpDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 w-full mt-1">
          <div className="rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none">
            <Command>
              <CommandList>
                <CommandEmpty>Không tìm thấy ngân hàng.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {filteredBanks.map((bank) => (
                    <CommandItem
                      key={bank.id}
                      value={bank.name}
                      onSelect={() => handleSelectBank(bank)}
                      className="cursor-pointer flex items-center gap-3 py-2"
                    >
                      <Check
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          bank.id === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <BankIcon bank={bank} />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">{bank.name}</span>
                        <span className="text-xs text-gray-500 truncate">{bank.code}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}
