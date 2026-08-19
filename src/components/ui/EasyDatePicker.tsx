'use client';

import React, { useState, useRef, useEffect } from 'react';

interface EasyDatePickerProps {
  label: string;
  value: string; // ISO format 'YYYY-MM-DD' or 'YYYY-MM' or 'YYYY' or ''
  onChange: (value: string) => void;
}

const MONTHS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

interface CustomDropdownProps {
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (val: string) => void;
  isHighlight?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  placeholder,
  value,
  options,
  onSelect,
  isHighlight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={dropdownRef} className="relative flex-1">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-2.5 py-1.5 bg-white border rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
          isOpen ? 'border-[#8e1616] ring-1 ring-[#8e1616]' : 'border-[#e8dfd5] hover:border-[#8e1616]/50'
        } ${isHighlight ? 'font-bold text-[#8e1616]' : 'text-[#1f1d1d]'}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className={`material-symbols-outlined text-[16px] text-[#59413e] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#8e1616]' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Downward Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#8e1616] rounded-md shadow-2xl max-h-48 overflow-y-auto z-50 p-1 divide-y divide-[#f2ebe4] animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            type="button"
            onClick={() => {
              onSelect('');
              setIsOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-[#8e1616]/10 hover:text-[#8e1616] transition-colors ${
              !value ? 'font-bold text-[#8e1616] bg-[#8e1616]/5' : 'text-[#59413e]'
            }`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded hover:bg-[#8e1616] hover:text-white transition-colors cursor-pointer ${
                value === opt.value
                  ? 'font-bold text-white bg-[#8e1616]'
                  : 'text-[#1f1d1d]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const EasyDatePicker: React.FC<EasyDatePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  // Parse existing ISO string YYYY-MM-DD
  const parts = (value || '').split('-');
  const selectedYear = parts[0] || '';
  const selectedMonth = parts[1] || '';
  const selectedDay = parts[2] || '';

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 130 }, (_, i) => {
    const y = String(currentYear - i);
    return { value: y, label: y };
  });

  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return { value: d, label: `${i + 1}` };
  });

  const updateDate = (newYear: string, newMonth: string, newDay: string) => {
    if (!newYear) {
      onChange('');
      return;
    }
    if (!newMonth) {
      onChange(newYear);
      return;
    }
    if (!newDay) {
      onChange(`${newYear}-${newMonth}`);
      return;
    }
    onChange(`${newYear}-${newMonth}-${newDay}`);
  };

  return (
    <div className="relative">
      <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="flex gap-1.5">
        {/* Custom Dropdown Tanggal */}
        <CustomDropdown
          placeholder="Tgl (--)"
          value={selectedDay}
          options={dayOptions}
          onSelect={(d) => updateDate(selectedYear, selectedMonth, d)}
        />

        {/* Custom Dropdown Bulan */}
        <CustomDropdown
          placeholder="Bulan (--)"
          value={selectedMonth}
          options={MONTHS}
          onSelect={(m) => updateDate(selectedYear, m, selectedDay)}
        />

        {/* Custom Dropdown Tahun */}
        <CustomDropdown
          placeholder="Tahun (*)"
          value={selectedYear}
          options={yearOptions}
          onSelect={(y) => updateDate(y, selectedMonth, selectedDay)}
          isHighlight
        />
      </div>
      <p className="text-[10px] text-[#59413e]/70 mt-1">
        *Cukup pilih <b>Tahun</b> jika lupa tanggal/bulan pasti.
      </p>
    </div>
  );
};
