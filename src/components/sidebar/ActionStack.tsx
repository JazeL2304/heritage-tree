'use client';

import React from 'react';
import { RelationType } from '@/types/family';

interface ActionStackProps {
  onAddRelation: (relation: RelationType) => void;
  onDeleteMember: () => void;
  disabled: boolean;
}

export const ActionStack: React.FC<ActionStackProps> = ({
  onAddRelation,
  onDeleteMember,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <button
        disabled={disabled}
        onClick={() => onAddRelation('parents')}
        className="w-full py-2.5 bg-[#C06050] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[16px]">groups</span>
        ADD PARENTS
      </button>

      <button
        disabled={disabled}
        onClick={() => onAddRelation('sibling')}
        className="w-full py-2.5 bg-[#8E1616] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[16px]">diversity_3</span>
        ADD SIBLING
      </button>

      <button
        disabled={disabled}
        onClick={() => onAddRelation('partner')}
        className="w-full py-2.5 bg-[#8E1616] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[16px]">favorite</span>
        ADD PARTNER
      </button>

      <button
        disabled={disabled}
        onClick={() => onAddRelation('child')}
        className="w-full py-2.5 bg-[#8E1616] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[16px]">child_care</span>
        ADD CHILD
      </button>

      <button
        disabled={disabled}
        onClick={onDeleteMember}
        className="w-full py-2.5 bg-[#6B0F0F] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:opacity-90 transition-all duration-200 flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-1"
      >
        <span className="material-symbols-outlined text-[16px]">delete_forever</span>
        DELETE PERSON
      </button>
    </div>
  );
};
