'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FamilyMember } from '@/types/family';

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
  const [scrollTitle, setScrollTitle] = useState('Imperial Lineage - Li Family Scroll');
  const [format, setFormat] = useState<'pdf' | 'png' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (format === 'json') {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
          JSON.stringify({ title: scrollTitle, members }, null, 2)
        );
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `heritage_scroll_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } else {
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8e1616', '#fed65b', '#003921'],
        });

        // Trigger API export call
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ format, title: scrollTitle }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `heritage_scroll_${Date.now()}.${format}`;
          a.click();
        } else {
          // Print fallback window
          window.print();
        }
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">history_edu</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
              Export Family Scroll Modal
            </h3>
            <p className="text-xs text-[#59413e]">
              Generate high-resolution physical or digital scroll document.
            </p>
          </div>
        </div>

        {/* Scroll Preview Box */}
        <div className="bg-[#F8F4EE] border border-[#e8dfd5] rounded p-4 mb-4 relative overflow-hidden text-center shadow-inner">
          <div className="text-[11px] uppercase tracking-widest text-[#8e1616] font-bold mb-1">
            📜 Scroll Preview
          </div>
          <div className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
            {scrollTitle || 'Family Lineage Scroll'}
          </div>
          <div className="text-xs text-[#59413e] mt-1">
            Total Documented Members: <span className="font-bold text-[#8e1616]">{members.length}</span>
          </div>

          <div className="mt-3 py-2 px-4 bg-white/70 rounded border border-[#e8dfd5] inline-flex items-center gap-2 text-xs font-semibold text-[#735c00]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Stamped with Imperial Seal of Verification
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Scroll Document Title
            </label>
            <input
              type="text"
              value={scrollTitle}
              onChange={(e) => setScrollTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  format === 'pdf'
                    ? 'bg-[#8e1616] text-white border-[#8e1616]'
                    : 'bg-white text-[#59413e] border-[#e8dfd5] hover:bg-[#eae8e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                PDF Scroll
              </button>

              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  format === 'png'
                    ? 'bg-[#8e1616] text-white border-[#8e1616]'
                    : 'bg-white text-[#59413e] border-[#e8dfd5] hover:bg-[#eae8e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">image</span>
                High-Res PNG
              </button>

              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  format === 'json'
                    ? 'bg-[#8e1616] text-white border-[#8e1616]'
                    : 'bg-white text-[#59413e] border-[#e8dfd5] hover:bg-[#eae8e4]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">code</span>
                JSON Data
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e8dfd5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2 bg-[#8e1616] text-white font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              {isExporting ? 'Exporting...' : 'Download Scroll'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
