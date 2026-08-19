'use client';

import React, { useState, useEffect } from 'react';
import { FamilyMember, Gender, RelationType } from '@/types/family';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Partial<FamilyMember>) => void;
  editingMember?: FamilyMember | null;
  relationType?: RelationType | null;
  activeMember?: FamilyMember | null;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMember,
  relationType,
  activeMember,
}) => {
  const [surname, setSurname] = useState('Li');
  const [givenName, setGivenName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [isDeceased, setIsDeceased] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingMember) {
      setSurname(editingMember.surname || 'Li');
      setGivenName(editingMember.givenName || '');
      setGender(editingMember.gender || 'male');
      setBirthDate(editingMember.birthDate || '');
      setDeathDate(editingMember.deathDate || '');
      setIsDeceased(editingMember.isDeceased || false);
      setPhotoUrl(editingMember.photoUrl || '');
      setNotes(editingMember.notes || '');
    } else {
      setSurname(activeMember?.surname || 'Li');
      setGivenName('');
      setGender(relationType === 'partner' ? (activeMember?.gender === 'male' ? 'female' : 'male') : 'male');
      setBirthDate('');
      setDeathDate('');
      setIsDeceased(false);
      setPhotoUrl('');
      setNotes('');
    }
  }, [editingMember, relationType, activeMember, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!givenName.trim()) return;

    onSave({
      id: editingMember?.id,
      surname,
      givenName,
      gender,
      birthDate,
      deathDate: isDeceased ? deathDate : undefined,
      isDeceased,
      photoUrl,
      notes,
    });

    onClose();
  };

  const getModalTitle = () => {
    if (editingMember) return 'Edit Ancestral Record';
    if (relationType && activeMember) {
      const name = `${activeMember.surname} ${activeMember.givenName}`;
      switch (relationType) {
        case 'parents':
          return `Add Parents for ${name}`;
        case 'sibling':
          return `Add Sibling for ${name}`;
        case 'partner':
          return `Add Partner for ${name}`;
        case 'child':
          return `Add Child for ${name}`;
      }
    }
    return 'Add Member Record';
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          class="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div class="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
          <div class="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[24px]">edit_note</span>
          </div>
          <div>
            <h3 class="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
              {getModalTitle()}
            </h3>
            <p class="text-xs text-[#59413e]">
              Enter biographical data into the family ledger.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Surname *
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Given Name *
              </label>
              <input
                type="text"
                required
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="e.g. Wei"
                class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Gender
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  class="accent-[#8e1616]"
                />
                <span>Male</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  class="accent-[#8e1616]"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
            <div>
              <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Deceased Status
              </label>
              <label class="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  class="accent-[#8e1616]"
                />
                <span>Is Deceased</span>
              </label>
            </div>
          </div>

          {isDeceased && (
            <div>
              <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Date of Death
              </label>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
          )}

          <div>
            <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
            />
          </div>

          <div>
            <label class="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Notes / Archival References
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Biographical notes..."
              class="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
            />
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-[#e8dfd5]">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 border border-[#e8dfd5] text-[#59413e] font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-[#8e1616] text-white font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
