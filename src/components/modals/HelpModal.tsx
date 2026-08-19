'use client';

import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0 shadow">
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
              Panduan Penggunaan Aplikasi
            </h3>
            <p className="text-xs text-[#59413e]">
              Petunjuk navigasi canvas, relasi silsilah, dan manajemen arsip.
            </p>
          </div>
        </div>

        {/* Accordion List of Help Topics */}
        <div className="space-y-3 text-xs text-[#59413e]">
          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-1">
            <div className="font-bold text-[#8e1616] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>1. Navigasi & Zoom Canvas Silsilah</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Klik dan tahan mouse di area kosong canvas untuk menggeser (pan) tampilan. Gunakan scroll wheel mouse atau tombol kontrol di kanan atas (+ / - / Fit) untuk mengatur perbesaran layar.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-1">
            <div className="font-bold text-[#8e1616] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>2. Menambah & Menghubungkan Anggota Keluarga</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Pilih salah satu kartu anggota pada canvas untuk menjadikannya <strong>Active Subject</strong>. Gunakan tombol aksi di sidebar kiri (+ Parents, + Sibling, + Partner, + Child) untuk menambah relasi terkait.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-1">
            <div className="font-bold text-[#8e1616] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>3. Ekspor Gulungan Silsilah (PDF & Cetak)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Klik tombol <strong>EXPORT SCROLL</strong> di bagian bawah sidebar untuk mengunduh bagan silsilah keluarga dalam format dokumen gulungan klasik beresolusi tinggi.
            </p>
          </div>

          <div className="p-3 bg-white border border-[#e8dfd5] rounded-lg space-y-1">
            <div className="font-bold text-[#8e1616] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">collections</span>
              <span>4. Galeri Arsip & Kalender Agenda</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Gunakan bilah navigasi atas untuk berpindah ke menu <strong>Archive</strong> (galeri foto & dokumen bersejarah) atau <strong>Events & Calendar</strong> (jadwal reuni dan ulang tahun keluarga).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-[#e8dfd5] mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-[#8e1616] text-white font-bold text-xs rounded hover:bg-[#731010] transition-colors cursor-pointer shadow"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
