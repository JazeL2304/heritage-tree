'use client';

import React from 'react';

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
  const years = Array.from({ length: 130 }, (_, i) => String(currentYear - i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

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
    <div>
      <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {/* Dropdown Tanggal */}
        <select
          value={selectedDay}
          onChange={(e) => updateDate(selectedYear, selectedMonth, e.target.value)}
          className="px-2 py-1.5 bg-white border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] focus:outline-none focus:border-[#8e1616] cursor-pointer"
        >
          <option value="">Tgl (--)</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {parseInt(d, 10)}
            </option>
          ))}
        </select>

        {/* Dropdown Bulan */}
        <select
          value={selectedMonth}
          onChange={(e) => updateDate(selectedYear, e.target.value, selectedDay)}
          className="px-2 py-1.5 bg-white border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] focus:outline-none focus:border-[#8e1616] cursor-pointer"
        >
          <option value="">Bulan (--)</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Dropdown Tahun */}
        <select
          value={selectedYear}
          onChange={(e) => updateDate(e.target.value, selectedMonth, selectedDay)}
          className="px-2 py-1.5 bg-white border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] font-semibold text-[#8e1616] focus:outline-none focus:border-[#8e1616] cursor-pointer"
        >
          <option value="">Tahun (*)</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <p className="text-[10px] text-[#59413e]/70 mt-1">
        *Cukup pilih <b>Tahun</b> jika lupa tanggal/bulan pasti.
      </p>
    </div>
  );
};
