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
      <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded p-3 text-center text-xs text-[#59413e]">
        Select a member on the canvas to view details.
      </div>
    );
  }

  return (
    <div className="bg-[#fbf9f5] border border-[#e8dfd5] rounded relative mt-1 p-2.5 pt-3 shadow-sm">
      <div className="absolute -top-2.5 left-2 bg-[#fbf9f5] px-1 text-[10px] font-bold text-[#8e1616] uppercase tracking-widest flex items-center gap-1">
        <span>Active Subject</span>
        {member.isVerified && (
          <span className="material-symbols-outlined text-[13px] text-[#fed65b]">
            verified
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-[11px] text-[#1f1d1d]">
        <div className="flex justify-between border-b border-[#eae8e4] pb-1">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Nama Depan
          </span>
          <span className="font-bold text-[#8e1616]">{member.givenName || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Marga / Keluarga
          </span>
          <span className="font-semibold">{member.surname || '-'}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Jenis Kelamin
          </span>
          <span className="capitalize">{member.gender === 'female' ? 'Perempuan' : 'Laki-laki'}</span>
        </div>
        <div className="flex justify-between border-b border-[#eae8e4] pb-1">
          <span className="text-[#59413e] font-semibold uppercase tracking-wide">
            Tgl Lahir
          </span>
          <span className="text-[#8e1616] font-semibold">
            {formatDate(member.birthDate)}
          </span>
        </div>

        {member.isDeceased && (
          <div className="flex justify-between border-b border-[#eae8e4] pb-1">
            <span className="text-[#59413e] font-semibold uppercase tracking-wide">
              Tgl Wafat
            </span>
            <span className="text-gray-600 italic">
              {formatDate(member.deathDate)}
            </span>
          </div>
        )}

        {member.notes && (
          <div className="mt-0.5 text-[10px] text-[#59413e] italic truncate">
            "{member.notes}"
          </div>
        )}

        <button
          onClick={onEditMember}
          className="mt-1 w-full py-1 border border-[#8e1616] text-[#8e1616] hover:bg-[#8e1616] hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider rounded cursor-pointer flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[13px]">edit</span>
          Edit Data Anggota
        </button>
      </div>
    </div>
  );
};
