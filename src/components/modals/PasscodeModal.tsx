'use client';

import React, { useState } from 'react';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedPasscode = process.env.NEXT_PUBLIC_FAMILY_PASSCODE || '1234';

    if (passcode.trim() === expectedPasscode) {
      setError('');
      setPasscode('');
      onSuccess();
    } else {
      setError('Invalid family passcode. (Default demo passcode is 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0 border border-[#fed65b]">
            <span className="material-symbols-outlined text-[28px]">verified_user</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#8e1616] font-['Plus_Jakarta_Sans']">
              Ancestral Verification Gate
            </h3>
            <p className="text-xs text-[#59413e]">
              Enter access code to modify lineage records.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Family Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (e.g. 1234)"
              autoFocus
              className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616] focus:ring-1 focus:ring-[#8e1616]"
            />
          </div>

          {error && (
            <div className="p-2 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] text-xs rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] text-xs font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#8e1616] text-white text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow"
            >
              Unlock Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
