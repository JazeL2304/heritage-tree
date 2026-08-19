'use client';

import React, { useState } from 'react';
import { FamilyMember, RelationType } from '@/types/family';
import { ProfileSummary } from './ProfileSummary';
import { ActionStack } from './ActionStack';

interface SidebarDrawerProps {
  activeMember: FamilyMember | null;
  onAddRelation: (relation: RelationType) => void;
  onEditMember: () => void;
  onDeleteMember: () => void;
  onOpenExportModal: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  activeMember,
  onAddRelation,
  onEditMember,
  onDeleteMember,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'records' | 'ancestors' | 'media'>('profile');

  return (
    <aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[320px] bg-[#fbf9f5] border-r border-[#e8dfd5] shadow-sm flex flex-col p-4 space-y-4 z-40 overflow-y-auto">
      {/* Branch Title & Ledger Header */}
      <div class="flex items-center gap-3 bg-[#efeeea] p-2.5 rounded border border-[#e8dfd5]">
        <div class="w-12 h-12 rounded-full border-2 border-[#fed65b] overflow-hidden bg-[#8e1616] flex items-center justify-center text-white shrink-0">
          {activeMember?.photoUrl ? (
            <img
              src={activeMember.photoUrl}
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          ) : (
            <span class="material-symbols-outlined text-[28px]">
              account_balance
            </span>
          )}
        </div>
        <div>
          <h2 class="font-bold text-sm text-[#8e1616] leading-tight font-['Plus_Jakarta_Sans']">
            Family Ledger
          </h2>
          <p class="text-xs text-[#59413e] italic">Ming Dynasty Branch</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div class="flex flex-col gap-1 pb-2 border-b border-[#e8dfd5]">
        <button
          onClick={() => setActiveTab('profile')}
          class={`flex items-center gap-2.5 px-3 py-2 font-bold text-xs text-left rounded-l w-full transition-all ${
            activeTab === 'profile'
              ? 'text-[#8e1616] border-r-4 border-[#8e1616] bg-[#eae8e4]'
              : 'text-[#59413e] hover:bg-[#efeeea] border-r-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          class={`flex items-center gap-2.5 px-3 py-2 text-xs text-left rounded-l w-full transition-all ${
            activeTab === 'records'
              ? 'text-[#8e1616] font-bold border-r-4 border-[#8e1616] bg-[#eae8e4]'
              : 'text-[#59413e] hover:bg-[#efeeea] border-r-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Records</span>
        </button>

        <button
          onClick={() => setActiveTab('ancestors')}
          class={`flex items-center gap-2.5 px-3 py-2 text-xs text-left rounded-l w-full transition-all ${
            activeTab === 'ancestors'
              ? 'text-[#8e1616] font-bold border-r-4 border-[#8e1616] bg-[#eae8e4]'
              : 'text-[#59413e] hover:bg-[#efeeea] border-r-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_tree</span>
          <span>Ancestors</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          class={`flex items-center gap-2.5 px-3 py-2 text-xs text-left rounded-l w-full transition-all ${
            activeTab === 'media'
              ? 'text-[#8e1616] font-bold border-r-4 border-[#8e1616] bg-[#eae8e4]'
              : 'text-[#59413e] hover:bg-[#efeeea] border-r-4 border-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          <span>Media</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div class="flex-1 flex flex-col gap-3">
        {activeTab === 'profile' && (
          <>
            <ProfileSummary
              member={activeMember}
              onEditMember={onEditMember}
            />
            <ActionStack
              disabled={!activeMember}
              onAddRelation={onAddRelation}
              onDeleteMember={onDeleteMember}
            />
          </>
        )}

        {activeTab === 'records' && (
          <div class="p-3 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] space-y-2">
            <h4 class="font-bold text-[#8e1616]">Archival Ledger Records</h4>
            <p>Historical genealogical archives of the Li family line (Zupu Volume IV).</p>
            <div class="p-2 bg-[#eae8e4] rounded text-[11px]">
              📜 Document Ref #M-1994-07
            </div>
          </div>
        )}

        {activeTab === 'ancestors' && (
          <div class="p-3 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] space-y-2">
            <h4 class="font-bold text-[#8e1616]">Generational Lineage</h4>
            <ul class="space-y-1 pl-2 border-l-2 border-[#8e1616]">
              <li>Gen 1: Li Jianhua & Wang Xiu Ying</li>
              <li>Gen 2: Li Wei & Chen Ting</li>
              <li>Gen 3: Li An</li>
            </ul>
          </div>
        )}

        {activeTab === 'media' && (
          <div class="p-3 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] text-center">
            <span class="material-symbols-outlined text-[32px] text-[#8e1616]">
              collections
            </span>
            <p class="mt-1">No additional media attachments uploaded for this node.</p>
          </div>
        )}
      </div>

      {/* Bottom Export & Options Bar */}
      <div class="mt-auto pt-3 border-t border-[#e8dfd5] flex flex-col gap-2">
        <button
          onClick={onOpenExportModal}
          class="w-full py-2.5 border border-[#735c00] text-[#735c00] bg-[#eae8e4] font-semibold text-xs uppercase tracking-wider rounded hover:bg-[#e4e2de] transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">download</span>
          Export Scroll
        </button>

        <div class="flex justify-between px-1 text-xs">
          <button class="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">settings</span>
            Settings
          </button>
          <button class="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">help_outline</span>
            Help
          </button>
        </div>
      </div>
    </aside>
  );
};
