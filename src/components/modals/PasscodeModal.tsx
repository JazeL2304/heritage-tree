'use client';

import React, { useState } from 'react';
import { AncestralCrestCanvas } from '../3d/AncestralCrestCanvas';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
  isStandaloneGate?: boolean;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isStandaloneGate = false,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPasscode = (process.env.NEXT_PUBLIC_FAMILY_PASSCODE || 'potu').toLowerCase();

    if (passcode.trim().toLowerCase() === expectedPasscode) {
      setError('');
      setPasscode('');
      onSuccess();
    } else {
      setError('Kode akses keluarga salah. (Kode sandi default adalah: potu)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Blurred Background Overlay Canvas Preview */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#FDFBF7]/80 parchment-grid"></div>

      {/* Main Modal Card with Stitch Double Border */}
      <div
        role="dialog"
        className="relative z-10 w-[90%] max-w-[480px] bg-[#FDFBF7] rounded-[16px] border-2 border-[#8e1616] shadow-[0_20px_40px_rgba(70,10,10,0.25)] p-6 md:p-8 flex flex-col items-center animate-in fade-in zoom-in duration-200"
      >
        {/* Optional Close Button if not full standalone landing gate */}
        {!isStandaloneGate && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-[#5C5249] hover:text-[#8e1616] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}

        {/* 3D Three.js Interactive Ancestral Crest Ring */}
        <AncestralCrestCanvas />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6 w-full -mt-6">
          {/* Title & Subtitle Badge */}
          <h1 className="font-bold text-xl text-[#8e1616] uppercase tracking-[0.08em] mb-1 font-['Plus_Jakarta_Sans']">
            HERITAGESCROLL
          </h1>
          <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-2 border-b border-[#D4AF37]/30 pb-1 px-4 inline-block">
            FAMILY LEDGER ACCESS
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#5C5249] leading-relaxed max-w-[320px] text-center">
            Masukkan kode rahasia keluarga untuk membuka catatan silsilah dan memulai penyusunan pohon keluarga.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-[11px] font-bold text-[#8e1616] tracking-wide text-center uppercase">
              KODE AKSES KELUARGA / FAMILY PASSCODE
            </label>
            <div className="relative w-full">
              <input
                type="password"
                autoComplete="off"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Contoh: potu"
                autoFocus
                className="w-full h-12 bg-[#FBF8F3] border-[1.5px] border-[#D6C8B4] rounded-[8px] text-center font-mono text-[18px] text-[#3D3731] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors placeholder:text-[#3D3731]/40 uppercase"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8e1616]/50">
                <span className="material-symbols-outlined text-sm">vpn_key</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] text-xs rounded text-center font-semibold">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#8e1616] text-white font-bold text-xs uppercase tracking-wider rounded-[8px] hover:bg-[#731010] transition-colors shadow-sm flex items-center justify-center gap-2 group cursor-pointer border border-transparent focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <span>BUKA SILSILAH KELUARGA</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </form>

        {/* Card Footer Info */}
        <div className="mt-5 text-[11px] text-[#5C5249] text-center flex items-center justify-center gap-1.5 opacity-80 pt-3 border-t border-[#e8dfd5] w-full">
          <span className="material-symbols-outlined text-[14px] text-[#D4AF37]">lock</span>
          <span>Tersimpan aman di cloud pribadi keluarga.</span>
        </div>
      </div>
    </div>
  );
};
