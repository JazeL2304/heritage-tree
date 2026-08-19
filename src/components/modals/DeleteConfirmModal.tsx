'use client';

import React from 'react';
import { FamilyMember } from '@/types/family';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  member: FamilyMember | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  member,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fbf9f5] border-2 border-[#ba1a1a] rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#ba1a1a] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 border border-[#ba1a1a]">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#ba1a1a] font-['Plus_Jakarta_Sans']">
              Delete Member Record
            </h3>
            <p className="text-xs text-[#59413e]">
              Confirm removal from family lineage records.
            </p>
          </div>
        </div>

        <p className="text-xs text-[#1f1d1d] bg-[#eae8e4] p-3 rounded border border-[#e8dfd5] mb-4">
          Are you sure you want to remove{' '}
          <strong className="text-[#8e1616]">
            {member.surname} {member.givenName}
          </strong>{' '}
          from the tree? This action will break connected relational links.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] text-xs font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-[#6B0F0F] text-white text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
