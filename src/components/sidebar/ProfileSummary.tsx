'use client';

import React from 'react';
import { FamilyMember } from '@/types/family';
import { formatDate } from '@/lib/utils';

interface ProfileSummaryProps {
  member: FamilyMember | null;
  onEditMember: () => void;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  member,
  onEditMember,
}) => {
  if (!member) {
    return (
      <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded p-4 text-center text-sm text-[#59413e]">
        Select a member on the canvas to view details.
      </div>
    );
  }

  return (
    <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded relative mt-2 p-3 pt-4 shadow-sm">
      <div className="absolute -top-3 left-3 bg-[#fbf9f5] px-1 text-[11px] font-bold text-[#8e1616] uppercase tracking-widest flex items-center gap-1">
        <span>Active Subject</span>
        {member.isVerified && (
          <span className="material-symbols-outlined text-[14px] text-[#fed65b]">
            verified
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-xs text-[#1f1d1d]">
        <div className="flex justify-between border-b border-[#eae8e4] pb-1.5">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Surname
          </span>
          <span className="font-bold text-[#8e1616]">{member.surname}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1.5">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Given Name
          </span>
          <span className="font-bold">{member.givenName}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1.5">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Gender
          </span>
          <span className="capitalize">{member.gender}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1.5">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            DoB
          </span>
          <span className="text-[#8e1616] font-semibold">
            {formatDate(member.birthDate)}
          </span>
        </div>

        {member.isDeceased && (
          <div className="flex justify-between border-b border-[#eae8e4] pb-1.5">
            <span className="text-[#59413e] font-semibold uppercase tracking-wide">
              DoD
            </span>
            <span className="text-gray-600 italic">
              {formatDate(member.deathDate)}
            </span>
          </div>
        )}

        {member.notes && (
          <div className="mt-1 pt-1 text-[11px] text-[#59413e] italic">
            "{member.notes}"
          </div>
        )}

        <button
          onClick={onEditMember}
          className="mt-2 w-full py-1.5 border border-[#8e1616] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider rounded cursor-pointer flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">edit</span>
          Edit Record
        </button>
      </div>
    </div>
  );
};
