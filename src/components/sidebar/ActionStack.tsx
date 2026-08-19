'use client';

import React from 'react';
import { RelationType } from '@/types/family';

interface ActionStackProps {
  onAddRelation: (relation: RelationType) => void;
  onAddStandalone: () => void;
  onDeleteMember: () => void;
  disabled: boolean;
}

export const ActionStack: React.FC<ActionStackProps> = ({
  onAddRelation,
  onAddStandalone,
  onDeleteMember,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {/* Standalone Add Member Button */}
      <button
        onClick={onAddStandalone}
        className="w-full py-1.5 bg-[#2E5E3B] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">person_add</span>
        <span>+ ANGGOTA BARU (TANPA RELASI)</span>
      </button>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          disabled={disabled}
          onClick={() => onAddRelation('parents')}
          className="py-1.5 px-2 bg-[#8E1616] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[15px]">groups</span>
          <span>+ Parents</span>
        </button>

        <button
          disabled={disabled}
          onClick={() => onAddRelation('sibling')}
          className="py-1.5 px-2 bg-[#8E1616] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[15px]">diversity_3</span>
          <span>+ Sibling</span>
        </button>

        <button
          disabled={disabled}
          onClick={() => onAddRelation('partner')}
          className="py-1.5 px-2 bg-[#8E1616] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[15px]">favorite</span>
          <span>+ Partner</span>
        </button>

        <button
          disabled={disabled}
          onClick={() => onAddRelation('child')}
          className="py-1.5 px-2 bg-[#8E1616] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[15px]">child_care</span>
          <span>+ Child</span>
        </button>
      </div>

      <button
        disabled={disabled}
        onClick={onDeleteMember}
        className="w-full py-1.5 bg-[#6B0F0F] text-white font-bold text-[11px] uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[15px]">delete_forever</span>
        <span>Delete Person</span>
      </button>
    </div>
  );
};
