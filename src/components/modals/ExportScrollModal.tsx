'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FamilyMember } from '@/types/family';
import { formatDate } from '@/lib/utils';

interface ExportScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
}

export const ExportScrollModal: React.FC<ExportScrollModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const [scrollTitle, setScrollTitle] = useState('Dokumen Silsilah Trah Keluarga');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportPDF = () => {
    setIsExporting(true);

    try {
      // Trigger celebratory confetti effect
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8e1616', '#fed65b', '#003921'],
      });

      // Group members by generation for the PDF report
      const genMap: { [gen: number]: FamilyMember[] } = { 1: [], 2: [], 3: [] };
      members.forEach((m) => {
        const gen = m.generation || (m.fatherId || m.motherId ? 3 : 2);
        if (!genMap[gen]) genMap[gen] = [];
        genMap[gen].push(m);
      });

      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${scrollTitle}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              background-color: #fbf9f5;
              color: #1f1d1d;
              padding: 24px;
              border: 5px double #8e1616;
              box-sizing: border-box;
            }
            .header { text-align: center; border-bottom: 2px solid #8e1616; padding-bottom: 14px; margin-bottom: 20px; }
            .header h1 { color: #8e1616; font-size: 22px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .header p { color: #59413e; font-size: 12px; margin-top: 6px; font-style: italic; }
            .seal { display: inline-block; background-color: #8e1616; color: #fed65b; padding: 4px 14px; font-size: 10px; font-weight: bold; border-radius: 4px; text-transform: uppercase; margin-top: 10px; letter-spacing: 1px; }
            .gen-section { margin-bottom: 18px; }
            .gen-title { font-size: 13px; font-weight: bold; color: #8e1616; border-bottom: 1px solid #e8dfd5; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .member-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 10px; }
            .member-card { border: 1px solid #e8dfd5; background: #ffffff; padding: 10px 12px; border-radius: 6px; }
            .member-name { font-weight: bold; color: #8e1616; font-size: 13px; }
            .member-details { font-size: 11px; color: #59413e; margin-top: 3px; }
            .empty-text { font-size: 11px; color: #8e1616; font-style: italic; padding: 6px 0; }
            .footer { margin-top: 30px; border-top: 1px dashed #8e1616; pt: 12px; text-align: center; font-size: 10px; color: #59413e; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${scrollTitle}</h1>
            <p>Arsip Resmi Catatan Silsilah & Silsilah Trah Keluarga</p>
            <div class="seal">Tercatat di Supabase Cloud Ledger — Silsilah Terverifikasi</div>
          </div>

          <div class="gen-section">
            <div class="gen-title">Generasi 1 (Tetua Trah)</div>
            ${
              genMap[1] && genMap[1].length > 0
                ? `<div class="member-grid">
                    ${genMap[1]
                      .map(
                        (m) => `
                      <div class="member-card">
                        <div class="member-name">${m.givenName} ${m.surname}</div>
                        <div class="member-details">Jenis Kelamin: ${m.gender === 'female' ? 'Wanita' : 'Pria'}</div>
                        <div class="member-details">Tgl Lahir: ${formatDate(m.birthDate) || '-'}</div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>`
                : `<div class="empty-text">Belum ada data Tetua Gen 1 terdaftar.</div>`
            }
          </div>

          <div class="gen-section">
            <div class="gen-title">Generasi 2 (Kepala Cabang)</div>
            ${
              genMap[2] && genMap[2].length > 0
                ? `<div class="member-grid">
                    ${genMap[2]
                      .map(
                        (m) => `
                      <div class="member-card">
                        <div class="member-name">${m.givenName} ${m.surname}</div>
                        <div class="member-details">Jenis Kelamin: ${m.gender === 'female' ? 'Wanita' : 'Pria'}</div>
                        <div class="member-details">Tgl Lahir: ${formatDate(m.birthDate) || '-'}</div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>`
                : `<div class="empty-text">Belum ada data Gen 2 terdaftar.</div>`
            }
          </div>

          <div class="gen-section">
            <div class="gen-title">Generasi 3 (Penerus Trah)</div>
            ${
              genMap[3] && genMap[3].length > 0
                ? `<div class="member-grid">
                    ${genMap[3]
                      .map(
                        (m) => `
                      <div class="member-card">
                        <div class="member-name">${m.givenName} ${m.surname}</div>
                        <div class="member-details">Jenis Kelamin: ${m.gender === 'female' ? 'Wanita' : 'Pria'}</div>
                        <div class="member-details">Tgl Lahir: ${formatDate(m.birthDate) || '-'}</div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>`
                : `<div class="empty-text">Belum ada data Gen 3 terdaftar.</div>`
            }
          </div>

          <div class="footer">
            Dicetak pada: ${today} — Total Anggota Terverifikasi: ${members.length}
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printHtml);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0 shadow">
            <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#8e1616] font-['Poppins']">
              Ekspor Dokumen PDF Silsilah
            </h3>
            <p className="text-xs text-[#59413e]">
              Cetak atau simpan bagan trah keluarga sebagai dokumen PDF resmi.
            </p>
          </div>
        </div>

        {/* Scroll Preview Box */}
        <div className="bg-[#F8F4EE] border border-[#e8dfd5] rounded-lg p-4 mb-4 text-center shadow-inner">
          <div className="text-[10px] uppercase tracking-widest text-[#8e1616] font-bold mb-1 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>Pratinjau Dokumen</span>
          </div>
          <div className="font-bold text-base text-[#8e1616] font-['Poppins']">
            {scrollTitle || 'Dokumen Silsilah Trah Keluarga'}
          </div>
          <div className="text-xs text-[#59413e] mt-1">
            Total Anggota Terdaftar: <span className="font-bold text-[#8e1616]">{members.length}</span>
          </div>

          <div className="mt-3 py-1.5 px-3 bg-white rounded border border-[#e8dfd5] inline-flex items-center gap-1.5 text-xs font-semibold text-[#735c00]">
            <span className="material-symbols-outlined text-[16px] text-[#e5a900]">verified</span>
            <span>Stempel Silsilah Terverifikasi</span>
          </div>
        </div>

        {/* Form Input */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#8e1616] uppercase tracking-wider mb-1">
              Judul Dokumen Silsilah
            </label>
            <input
              type="text"
              value={scrollTitle}
              onChange={(e) => setScrollTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
            />
          </div>

          {/* Clean Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#e8dfd5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] font-semibold text-xs rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2 bg-[#8e1616] text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-[#731010] transition-colors cursor-pointer shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>{isExporting ? 'Memproses PDF...' : 'Unduh Dokumen PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
