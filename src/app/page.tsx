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

export default function Home() {
  const [activeNavTab, setActiveNavTab] = useState<'lineage' | 'archive' | 'events'>('lineage');
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [activeMember, setActiveMember] = useState<FamilyMember | null>(null);

  // Authentication State: defaults to false so Ancestral Verification Gate appears first!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(true);

  // Other Modals State
  const [isMemberFormOpen, setIsMemberFormOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [relationType, setRelationType] = useState<RelationType | null>(null);

  // Set default active member on initial load
  useEffect(() => {
    const subject = members.find((m) => m.id === 'm_subject') || members[0] || null;
    setActiveMember(subject);
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

  const confirmDelete = () => {
    if (!activeMember) return;
    const updated = members.filter((m) => m.id !== activeMember.id);
    setMembers(updated);
    setActiveMember(updated[0] || null);
  };

  // Handler for saving member form data
  const handleSaveMember = (data: Partial<FamilyMember>) => {
    if (editingMember) {
      // Edit existing member
      const updatedMembers = members.map((m) =>
        m.id === editingMember.id ? { ...m, ...data } : m
      );
      setMembers(updatedMembers);

      if (activeMember?.id === editingMember.id) {
        setActiveMember({ ...activeMember, ...data });
      }
    } else {
      // Add new member relative to activeMember
      const newId = generateId();
      let newGen = activeMember?.generation || 2;
      let fatherId = data.fatherId;
      let motherId = data.motherId;
      let spouseId = data.spouseId;

      if (activeMember && relationType) {
        switch (relationType) {
          case 'parents':
            newGen = (activeMember.generation || 2) - 1;
            break;
          case 'sibling':
            newGen = activeMember.generation || 2;
            fatherId = activeMember.fatherId;
            motherId = activeMember.motherId;
            break;
          case 'partner':
            newGen = activeMember.generation || 2;
            spouseId = activeMember.id;
            break;
          case 'child':
            newGen = (activeMember.generation || 2) + 1;
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
        surname: data.surname || 'Li',
        givenName: data.givenName || 'Unnamed',
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

      // If adding partner, update activeMember spouse reference
      let updatedMembers = [...members, newMember];
      if (relationType === 'partner' && activeMember) {
        updatedMembers = updatedMembers.map((m) =>
          m.id === activeMember.id ? { ...m, spouseId: newId } : m
        );
      }

      setMembers(updatedMembers);
      setActiveMember(newMember);
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
              onAddRelation={handleAddRelation}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />

            {/* Interactive Infinite Canvas */}
            <TreeCanvas
              members={positionedMembers}
              connections={connections}
              activeMember={activeMember}
              onSelectMember={(m) => setActiveMember(m)}
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
    </div>
  );
}
