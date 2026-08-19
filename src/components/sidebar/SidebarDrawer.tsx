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
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-[300px] bg-[#fbf9f5] border-r border-[#e8dfd5] shadow-sm flex flex-col p-3 z-40 overflow-hidden">
      {/* Branch Title & Ledger Header */}
      <div className="flex items-center gap-2.5 bg-[#efeeea] p-2 rounded border border-[#e8dfd5]">
        <div className="w-9 h-9 rounded-full border-2 border-[#fed65b] overflow-hidden bg-[#8e1616] flex items-center justify-center text-white shrink-0">
          {activeMember?.photoUrl ? (
            <img
              src={activeMember.photoUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-[20px]">
              account_balance
            </span>
          )}
        </div>
        <div>
          <h2 className="font-bold text-xs text-[#8e1616] leading-tight font-['Poppins']">
            Family Ledger
          </h2>
          <p className="text-[10px] text-[#59413e] italic">Ming Dynasty Branch</p>
        </div>
      </div>

      {/* Navigation Tabs (Compact 4-grid pill icons) */}
      <div className="grid grid-cols-4 gap-1 my-2 bg-[#eae8e4] p-1 rounded border border-[#e8dfd5]">
        {[
          { id: 'profile', label: 'Profile', icon: 'person' },
          { id: 'records', label: 'Records', icon: 'menu_book' },
          { id: 'ancestors', label: 'Tree', icon: 'account_tree' },
          { id: 'media', label: 'Media', icon: 'photo_library' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-1 text-[10px] font-bold rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#8e1616] text-white shadow-sm'
                : 'text-[#59413e] hover:bg-[#efeeea]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
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
          <div className="p-2.5 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] space-y-2">
            <h4 className="font-bold text-[#8e1616]">Archival Ledger Records</h4>
            <p className="text-[11px]">Historical genealogical archives of the Li family line (Zupu Volume IV).</p>
            <div className="p-1.5 bg-[#eae8e4] rounded text-[10px] flex items-center gap-1.5 font-mono">
              <span className="material-symbols-outlined text-[14px] text-[#8e1616]">description</span>
              <span>Document Ref #M-1994-07</span>
            </div>
          </div>
        )}

        {activeTab === 'ancestors' && (
          <div className="p-2.5 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] space-y-1.5">
            <h4 className="font-bold text-[#8e1616]">Generational Lineage</h4>
            <ul className="space-y-1 pl-2 border-l-2 border-[#8e1616] text-[11px]">
              <li>Gen 1: Li Jianhua & Wang Xiu Ying</li>
              <li>Gen 2: Li Wei & Chen Ting</li>
              <li>Gen 3: Li An</li>
            </ul>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="p-3 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] text-center">
            <span className="material-symbols-outlined text-[28px] text-[#8e1616]">
              collections
            </span>
            <p className="mt-1 text-[11px]">No additional media attachments uploaded for this node.</p>
          </div>
        )}
      </div>

      {/* Bottom Export & Options Bar */}
      <div className="mt-auto pt-2 border-t border-[#e8dfd5] flex flex-col gap-1.5 shrink-0">
        <button
          onClick={onOpenExportModal}
          className="w-full py-1.5 border border-[#735c00] text-[#735c00] bg-[#eae8e4] font-bold text-[11px] uppercase tracking-wider rounded hover:bg-[#e4e2de] transition-colors flex justify-center items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Export Scroll</span>
        </button>

        <div className="flex justify-between px-1 text-[10px]">
          <button className="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            Settings
          </button>
          <button className="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">help_outline</span>
            Help
          </button>
        </div>
      </div>
    </aside>
  );
};
