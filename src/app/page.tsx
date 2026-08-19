'use client';

import React, { useState, useEffect } from 'react';
import { FamilyMember, RelationType } from '@/types/family';
import { INITIAL_MEMBERS, calculateTreePositions } from '@/lib/tree-layout';
import { generateId } from '@/lib/utils';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarDrawer } from '@/components/sidebar/SidebarDrawer';
import { TreeCanvas } from '@/components/canvas/TreeCanvas';
import { ArchiveView } from '@/components/archive/ArchiveView';
import { EventsView } from '@/components/events/EventsView';
import { PasscodeModal } from '@/components/modals/PasscodeModal';
import { MemberFormModal } from '@/components/modals/MemberFormModal';
import { ExportScrollModal } from '@/components/modals/ExportScrollModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { HelpModal } from '@/components/modals/HelpModal';
import {
  loadFamilyMembers,
  saveMember,
  deleteMember,
  syncMembers,
  clearAllFamilyMembers,
} from '@/lib/family-service';

export default function Home() {
  const [activeNavTab, setActiveNavTab] = useState<'lineage' | 'archive' | 'events'>('lineage');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activeMember, setActiveMember] = useState<FamilyMember | null>(null);

  // Authentication State: defaults to false so Ancestral Verification Gate appears first!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(true);

  // Other Modals State
  const [isMemberFormOpen, setIsMemberFormOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [relationType, setRelationType] = useState<RelationType | null>(null);

  // Load family members: Instant local cache render + background Supabase sync
  useEffect(() => {
    async function init() {
      // Fetch clean members from Supabase Cloud
      const loaded = await loadFamilyMembers();
      if (loaded && loaded.length > 0) {
        setMembers(loaded);
        setActiveMember((prev) => prev || loaded[0]);
        return;
      }

      // Offline fallback from local cache
      try {
        const cached = localStorage.getItem('heritage_tree_family_members');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMembers(parsed);
            setActiveMember(parsed[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load local cache:', err);
      }
    }
    init();
  }, []);

  // Compute positions & connections
  const { positionedMembers, connections } = calculateTreePositions(members);

  // Handler for adding a relation
  const handleAddRelation = (type: RelationType) => {
    if (!isAuthenticated) {
      setIsPasscodeModalOpen(true);
      return;
    }
    setEditingMember(null);
    setRelationType(type);
    setIsMemberFormOpen(true);
  };

  // Handler for adding the first member when tree is empty
  const handleAddFirstMember = () => {
    if (!isAuthenticated) {
      setIsPasscodeModalOpen(true);
      return;
    }
    setEditingMember(null);
    setRelationType(null);
    setIsMemberFormOpen(true);
  };

  // Handler for editing an existing member
  const handleEditMember = () => {
    if (!isAuthenticated) {
      setIsPasscodeModalOpen(true);
      return;
    }
    if (!activeMember) return;
    setEditingMember(activeMember);
    setRelationType(null);
    setIsMemberFormOpen(true);
  };

  // Handler for deleting an active member
  const handleDeleteMember = () => {
    if (!isAuthenticated) {
      setIsPasscodeModalOpen(true);
      return;
    }
    if (!activeMember) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!activeMember) return;
    const deletedId = activeMember.id;
    const updated = members.filter((m) => m.id !== deletedId);
    setMembers(updated);
    setActiveMember(updated[0] || null);
    await deleteMember(deletedId);
    await syncMembers(updated);
  };

  // Handler for saving member form data
  const handleSaveMember = async (data: Partial<FamilyMember>) => {
    if (editingMember) {
      // Edit existing member
      let updatedMembers = members.map((m) =>
        m.id === editingMember.id ? { ...m, ...data } : m
      );

      // Bidirectional Spouse sync
      if (data.spouseId) {
        updatedMembers = updatedMembers.map((m) =>
          m.id === data.spouseId ? { ...m, spouseId: editingMember.id } : m
        );
      }

      // Bidirectional Parent-Spouse sync
      if (data.fatherId && data.motherId) {
        updatedMembers = updatedMembers.map((m) => {
          if (m.id === data.fatherId) return { ...m, spouseId: data.motherId };
          if (m.id === data.motherId) return { ...m, spouseId: data.fatherId };
          return m;
        });
      }

      setMembers(updatedMembers);

      const updatedObj = { ...editingMember, ...data };
      if (activeMember?.id === editingMember.id) {
        setActiveMember(updatedObj);
      }
      await saveMember(updatedObj);
      await syncMembers(updatedMembers);
    } else {
      // Add new member relative to activeMember (or initial root member)
      const newId = generateId();
      let newGen = activeMember?.generation || 1;
      let fatherId = data.fatherId;
      let motherId = data.motherId;
      let spouseId = data.spouseId;

      if (activeMember && relationType) {
        switch (relationType) {
          case 'parents':
            newGen = Math.max(1, (activeMember.generation || 2) - 1);
            break;
          case 'sibling':
            newGen = activeMember.generation || 1;
            fatherId = activeMember.fatherId;
            motherId = activeMember.motherId;
            break;
          case 'partner':
            newGen = activeMember.generation || 1;
            spouseId = activeMember.id;
            break;
          case 'child':
            newGen = (activeMember.generation || 1) + 1;
            if (activeMember.gender === 'female') {
              motherId = activeMember.id;
              fatherId = activeMember.spouseId;
            } else {
              fatherId = activeMember.id;
              motherId = activeMember.spouseId;
            }
            break;
        }
      }

      const newMember: FamilyMember = {
        id: newId,
        surname: data.surname || activeMember?.surname || 'Li',
        givenName: data.givenName || 'Nama Anggota',
        gender: data.gender || 'male',
        birthDate: data.birthDate || '',
        deathDate: data.deathDate || '',
        isDeceased: data.isDeceased || false,
        photoUrl:
          data.photoUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        notes: data.notes || '',
        generation: newGen,
        isVerified: true,
        fatherId,
        motherId,
        spouseId,
      };

      let updatedMembers = [...members, newMember];

      // Update bidirectional references for perfect tree connection
      if (activeMember && relationType) {
        if (relationType === 'partner') {
          // Link activeMember <-> newMember as spouses
          updatedMembers = updatedMembers.map((m) =>
            m.id === activeMember.id ? { ...m, spouseId: newId } : m
          );
        } else if (relationType === 'parents') {
          // Link activeMember (and their siblings) to new parent
          const isMother = newMember.gender === 'female';
          const existingFatherId = activeMember.fatherId;
          const existingMotherId = activeMember.motherId;
          const spouseParentId = isMother ? existingFatherId : existingMotherId;

          updatedMembers = updatedMembers.map((m) => {
            // Update activeMember and siblings
            if (m.id === activeMember.id || (activeMember.fatherId && m.fatherId === activeMember.fatherId) || (activeMember.motherId && m.motherId === activeMember.motherId)) {
              return isMother ? { ...m, motherId: newId } : { ...m, fatherId: newId };
            }
            // Link existing parent with new parent as spouses
            if (spouseParentId && m.id === spouseParentId) {
              return { ...m, spouseId: newId };
            }
            return m;
          });

          // Also link new parent to existing spouse parent
          if (spouseParentId) {
            const finalNewMemberIndex = updatedMembers.findIndex((m) => m.id === newId);
            if (finalNewMemberIndex !== -1) {
              updatedMembers[finalNewMemberIndex] = {
                ...updatedMembers[finalNewMemberIndex],
                spouseId: spouseParentId,
              };
            }
          }
        }
      }

      setMembers(updatedMembers);
      setActiveMember(newMember);
      await syncMembers(updatedMembers);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f5] overflow-hidden relative">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeNavTab}
        onSelectTab={(tab) => setActiveNavTab(tab)}
        isAuthenticated={isAuthenticated}
        onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
        onSignOut={() => {
          setIsAuthenticated(false);
          setIsPasscodeModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className={`flex flex-1 pt-16 min-h-screen w-full relative transition-all duration-300 ${!isAuthenticated ? 'filter blur-sm pointer-events-none opacity-50' : ''}`}>
        {activeNavTab === 'lineage' && (
          <>
            {/* Left Property Drawer */}
            <SidebarDrawer
              activeMember={activeMember}
              allMembers={members}
              onSelectMember={(m) => setActiveMember(m)}
              onAddRelation={handleAddRelation}
              onAddStandalone={handleAddFirstMember}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
              onOpenHelpModal={() => setIsHelpModalOpen(true)}
            />

            {/* Interactive Infinite Canvas */}
            <TreeCanvas
              members={positionedMembers}
              connections={connections}
              activeMember={activeMember}
              onSelectMember={(m) => setActiveMember(m)}
              onAddFirstMember={handleAddFirstMember}
            />
          </>
        )}

        {activeNavTab === 'archive' && <ArchiveView />}

        {activeNavTab === 'events' && <EventsView />}
      </div>

      {/* Ancestral Verification Gate Modal (First Screen Landing) */}
      <PasscodeModal
        isOpen={!isAuthenticated || isPasscodeModalOpen}
        isStandaloneGate={!isAuthenticated}
        onClose={() => {
          if (isAuthenticated) {
            setIsPasscodeModalOpen(false);
          }
        }}
        onSuccess={() => {
          setIsAuthenticated(true);
          setIsPasscodeModalOpen(false);
        }}
      />

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={isMemberFormOpen}
        onClose={() => setIsMemberFormOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
        relationType={relationType}
        activeMember={activeMember}
        allMembers={members}
      />

      {/* Export Scroll Modal */}
      <ExportScrollModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        members={members}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        member={activeMember}
      />

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onOpenPasscodeModal={() => setIsPasscodeModalOpen(true)}
      />

      {/* Interactive User Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
