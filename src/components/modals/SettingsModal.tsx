'use client';

import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasscodeModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPasscodeModal,
}) => {
  const [gridStyle, setGridStyle] = useState<'parchment' | 'dots' | 'clean'>('parchment');
  const [autoSave, setAutoSave] = useState(true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleClearCache = () => {
    if (confirm('Apakah Anda yakin ingin menghapus cache lokal browser? Data Supabase tetap aman.')) {
      localStorage.clear();
      alert('Cache lokal berhasil dibersihkan.');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-[#e8dfd5] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0 shadow">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
              Pengaturan Aplikasi Silsilah
            </h3>
            <p className="text-xs text-[#59413e]">
              Konfigurasi sistem, keamanan, dan preferensi tampilan canvas.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Security & Passcode Setting */}
          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#8e1616] block">Keamanan Akses Silsilah</span>
                <span className="text-[11px] text-[#59413e]">Verifikasi passcode pembuka ledger</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPasscodeModal();
                }}
                className="px-3 py-1 bg-[#8e1616] text-white font-bold text-[11px] rounded hover:bg-[#731010] transition-colors cursor-pointer"
              >
                Ubah Passcode
              </button>
            </div>
          </div>

          {/* Grid Style Preference */}
          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-2">
            <label className="font-bold text-[#8e1616] block mb-1">Tampilan Canvas Background</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'parchment', label: 'Parchment Grid' },
                { id: 'dots', label: 'Dot Matrix' },
                { id: 'clean', label: 'Polos Minimalis' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGridStyle(item.id as any)}
                  className={`py-1.5 px-2 rounded font-semibold text-[11px] border transition-all cursor-pointer ${
                    gridStyle === item.id
                      ? 'bg-[#8e1616] text-white border-[#8e1616]'
                      : 'bg-[#eae8e4] text-[#59413e] border-[#e8dfd5] hover:bg-[#e4e2de]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Sync Toggle */}
          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-[#8e1616] block">Sinkronisasi Otomatis</span>
              <span className="text-[11px] text-[#59413e]">Simpan data ke Supabase secara instan</span>
            </div>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="accent-[#8e1616] w-4 h-4 cursor-pointer"
            />
          </div>

          {/* System Cache & Maintenance */}
          <div className="p-3 bg-[#efeeea] border border-[#e8dfd5] rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-[#59413e] block">Pemeliharaan Cache</span>
              <span className="text-[11px] text-[#59413e]">Bersihkan data temporary lokal browser</span>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className="px-3 py-1 bg-[#ba1a1a] text-white font-bold text-[11px] rounded hover:bg-[#93000a] transition-colors cursor-pointer"
            >
              Hapus Cache
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[#e8dfd5] mt-5">
          {isSavedNotice ? (
            <span className="text-xs font-bold text-green-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Pengaturan Tersimpan
            </span>
          ) : (
            <span className="text-[11px] text-[#59413e]">HeritageTree Version 2.4.0</span>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#e8dfd5] text-[#59413e] font-semibold text-xs rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-1.5 bg-[#8e1616] text-white font-bold text-xs rounded hover:bg-[#731010] transition-colors cursor-pointer shadow"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
