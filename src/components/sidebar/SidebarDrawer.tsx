'use client';

import React, { useState, useEffect } from 'react';
import { FamilyMember, RelationType } from '@/types/family';
import { ProfileSummary } from './ProfileSummary';
import { ActionStack } from './ActionStack';
import { loadArchives } from '@/lib/archive-service';
import { ArchivalItem } from '@/components/archive/ArchiveView';

interface SidebarDrawerProps {
  activeMember: FamilyMember | null;
  allMembers: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
  onAddRelation: (relation: RelationType) => void;
  onAddStandalone: () => void;
  onEditMember: () => void;
  onDeleteMember: () => void;
  onOpenExportModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenHelpModal: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  activeMember,
  allMembers,
  onSelectMember,
  onAddRelation,
  onAddStandalone,
  onEditMember,
  onDeleteMember,
  onOpenExportModal,
  onOpenSettingsModal,
  onOpenHelpModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'records' | 'ancestors' | 'media'>('profile');
  const [archives, setArchives] = useState<ArchivalItem[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ArchivalItem | null>(null);

  useEffect(() => {
    async function fetchArchives() {
      const data = await loadArchives();
      setArchives(data);
    }
    fetchArchives();
  }, []);

  // Group members by dynamic generation depth for the 'Bagan' tab
  const generationsMap: { [gen: number]: FamilyMember[] } = {};

  const getMemberGen = (m: FamilyMember): number => {
    if (m.fatherId || m.motherId) {
      let parentGen = 2;
      const father = allMembers.find((p) => p.id === m.fatherId);
      const mother = allMembers.find((p) => p.id === m.motherId);
      if (father) parentGen = getMemberGen(father);
      else if (mother) parentGen = getMemberGen(mother);
      return parentGen + 1;
    }
    if (m.spouseId) {
      const spouse = allMembers.find((s) => s.id === m.spouseId);
      if (spouse && (spouse.fatherId || spouse.motherId)) {
        return getMemberGen(spouse);
      }
    }
    return m.generation && m.generation > 1 ? m.generation : 2;
  };

  allMembers.forEach((m) => {
    const gen = getMemberGen(m);
    if (!generationsMap[gen]) generationsMap[gen] = [];
    generationsMap[gen].push(m);
  });

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
            Silsilah Potu Family
          </h2>
          <p className="text-[10px] text-[#59413e]">
            {allMembers.length} Anggota Terdaftar
          </p>
        </div>
      </div>

      {/* Navigation Tabs (Compact 4-grid pill icons) */}
      <div className="grid grid-cols-4 gap-1 my-2 bg-[#eae8e4] p-1 rounded border border-[#e8dfd5]">
        {[
          { id: 'profile', label: 'Profil', icon: 'person' },
          { id: 'records', label: 'Arsip', icon: 'menu_book' },
          { id: 'ancestors', label: 'Bagan', icon: 'account_tree' },
          { id: 'media', label: 'Media', icon: 'photo_library' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-1 text-[10px] font-bold rounded flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === tab.id
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
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {activeTab === 'profile' && (
          <>
            <ProfileSummary
              member={activeMember}
              onEditMember={onEditMember}
            />
            <ActionStack
              disabled={!activeMember}
              onAddRelation={onAddRelation}
              onAddStandalone={onAddStandalone}
              onDeleteMember={onDeleteMember}
            />
          </>
        )}

        {/* Dynamic Records Tab from Supabase */}
        {activeTab === 'records' && (
          <div className="space-y-2">
            <div className="p-2.5 bg-[#efeeea] border border-[#e8dfd5] rounded text-xs text-[#59413e]">
              <h4 className="font-bold text-[#8e1616]">Dokumen & Doktrin Silsilah</h4>
              <p className="text-[10px] mt-0.5">Catatan arsip silsilah resmi yang tersimpan di Supabase Cloud.</p>
            </div>

            {archives.length === 0 ? (
              <div className="p-4 bg-white border border-[#e8dfd5] rounded text-center text-xs text-[#59413e]">
                Belum ada dokumen arsip tersimpan.
              </div>
            ) : (
              <div className="space-y-1.5">
                {archives.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="p-2 bg-white border border-[#e8dfd5] hover:border-[#8e1616] rounded text-xs cursor-pointer transition-all shadow-2xs"
                  >
                    <div className="font-bold text-[#8e1616] line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-[#59413e] flex justify-between mt-1">
                      <span>📅 {item.date}</span>
                      <span className="font-semibold text-[#735c00] uppercase">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Record Details Modal / Preview */}
            {selectedRecord && (
              <div className="p-2.5 bg-[#eae8e4] border border-[#8e1616] rounded text-xs text-[#1f1d1d] space-y-1 relative">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-1 right-1 text-[#8e1616] font-bold"
                >
                  ✕
                </button>
                <div className="font-bold text-[#8e1616]">{selectedRecord.title}</div>
                <p className="text-[11px] text-[#59413e]">{selectedRecord.description}</p>
                {selectedRecord.imageUrl && (
                  <img
                    src={selectedRecord.imageUrl}
                    alt={selectedRecord.title}
                    className="w-full h-24 object-cover rounded border border-[#e8dfd5] mt-1"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Tree/Ancestors Tab from Live Members */}
        {activeTab === 'ancestors' && (
          <div className="p-2.5 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#59413e] space-y-2">
            <h4 className="font-bold text-[#8e1616]">Silsilah Per Generasi</h4>
            <p className="text-[10px] text-[#59413e]">Klik nama anggota untuk memfokuskan kursor di canvas.</p>

            <div className="space-y-3 pt-1">
              {/* Gen 1 (Tetua Trah) */}
              <div className="space-y-1">
                <div className="font-bold text-[11px] text-[#8e1616] uppercase border-b border-[#e8dfd5] pb-0.5 flex justify-between items-center">
                  <span>Generasi 1 (Tetua Trah)</span>
                  {(!generationsMap[1] || generationsMap[1].length === 0) && (
                    <span className="text-[9px] text-[#8e1616] font-semibold italic">Belum diisi</span>
                  )}
                </div>
                {!generationsMap[1] || generationsMap[1].length === 0 ? (
                  <div className="p-2 bg-[#eae8e4]/60 border border-dashed border-[#e8dfd5] rounded text-[10px] text-[#59413e] italic">
                    Belum ada data Tetua Gen 1. Tambah orang tua pada Roni/Imelda di canvas.
                  </div>
                ) : (
                  <div className="space-y-1 pl-1">
                    {generationsMap[1].map((m) => {
                      const isSelected = activeMember?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => onSelectMember(m)}
                          className={`p-1.5 rounded flex items-center justify-between cursor-pointer text-[11px] transition-colors ${isSelected
                              ? 'bg-[#8e1616] text-white font-bold'
                              : 'bg-white text-[#1f1d1d] hover:bg-[#eae8e4] border border-[#e8dfd5]'
                            }`}
                        >
                          <span className="truncate">{m.givenName} {m.surname}</span>
                          <span className="text-[9px] uppercase opacity-80 px-1 bg-black/10 rounded">
                            {m.gender === 'female' ? 'Wanita' : 'Pria'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Gen 2 (Kepala Cabang - Roni & Imelda) */}
              {generationsMap[2] && generationsMap[2].length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-[11px] text-[#8e1616] uppercase border-b border-[#e8dfd5] pb-0.5">
                    Generasi 2 (Kepala Cabang)
                  </div>
                  <div className="space-y-1 pl-1">
                    {generationsMap[2].map((m) => {
                      const isSelected = activeMember?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => onSelectMember(m)}
                          className={`p-1.5 rounded flex items-center justify-between cursor-pointer text-[11px] transition-colors ${isSelected
                              ? 'bg-[#8e1616] text-white font-bold'
                              : 'bg-white text-[#1f1d1d] hover:bg-[#eae8e4] border border-[#e8dfd5]'
                            }`}
                        >
                          <span className="truncate">{m.givenName} {m.surname}</span>
                          <span className="text-[9px] uppercase opacity-80 px-1 bg-black/10 rounded">
                            {m.gender === 'female' ? 'Wanita' : 'Pria'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gen 3 (Penerus Trah - Jastin & Jason) */}
              {generationsMap[3] && generationsMap[3].length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-[11px] text-[#8e1616] uppercase border-b border-[#e8dfd5] pb-0.5">
                    Generasi 3 (Penerus Trah)
                  </div>
                  <div className="space-y-1 pl-1">
                    {generationsMap[3].map((m) => {
                      const isSelected = activeMember?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => onSelectMember(m)}
                          className={`p-1.5 rounded flex items-center justify-between cursor-pointer text-[11px] transition-colors ${isSelected
                              ? 'bg-[#8e1616] text-white font-bold'
                              : 'bg-white text-[#1f1d1d] hover:bg-[#eae8e4] border border-[#e8dfd5]'
                            }`}
                        >
                          <span className="truncate">{m.givenName} {m.surname}</span>
                          <span className="text-[9px] uppercase opacity-80 px-1 bg-black/10 rounded">
                            {m.gender === 'female' ? 'Wanita' : 'Pria'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-2">
            <div className="p-2.5 bg-[#efeeea] border border-[#e8dfd5] rounded text-xs text-[#59413e]">
              <h4 className="font-bold text-[#8e1616]">Galeri Media Anggota</h4>
              <p className="text-[10px] mt-0.5">Foto-foto tersimpan anggota trah keluarga.</p>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {allMembers.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className="bg-white border border-[#e8dfd5] rounded p-1.5 cursor-pointer hover:border-[#8e1616] transition-all text-center group"
                >
                  <img
                    src={
                      m.photoUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={m.givenName}
                    className="w-full h-16 object-cover rounded group-hover:scale-105 transition-transform"
                  />
                  <div className="text-[10px] font-bold text-[#8e1616] truncate mt-1">
                    {m.givenName}
                  </div>
                </div>
              ))}
            </div>
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
          <button
            onClick={onOpenSettingsModal}
            className="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-1 text-[#59413e] hover:text-[#8e1616] transition-colors cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">help_outline</span>
            <span>Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
