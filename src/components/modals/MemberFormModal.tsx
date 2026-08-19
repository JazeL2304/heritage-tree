'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fbf9f5] border-2 border-[#8e1616] rounded-lg shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#59413e] hover:text-[#8e1616] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-[#e8dfd5] pb-3">
          <div className="w-10 h-10 rounded-full bg-[#8e1616] text-[#fed65b] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">edit_note</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-[#8e1616] font-['Plus_Jakarta_Sans']">
              {getModalTitle()}
            </h3>
            <p className="text-xs text-[#59413e]">
              Enter biographical data and photo into the family ledger.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo Selection Area */}
          <div>
            <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Member Photo
            </label>
            <div className="border border-[#e8dfd5] bg-white rounded p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-[#e8dfd5] pb-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadTab('file')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                      uploadTab === 'file'
                        ? 'bg-[#8e1616] text-white'
                        : 'bg-[#eae8e4] text-[#59413e] hover:bg-[#e4e2de]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">upload_file</span>
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadTab('url')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                      uploadTab === 'url'
                        ? 'bg-[#8e1616] text-white'
                        : 'bg-[#eae8e4] text-[#59413e] hover:bg-[#e4e2de]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    Photo URL
                  </button>
                </div>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-xs text-[#ba1a1a] hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Remove
                  </button>
                )}
              </div>

              {/* Photo Preview & Controls */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-16 h-16 rounded-full border-2 border-[#8e1616] bg-[#fbf9f5] overflow-hidden shrink-0 flex items-center justify-center text-[#8e1616] shadow-sm">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[32px]">
                      {gender === 'female' ? 'woman' : 'man'}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  {uploadTab === 'file' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#eae8e4] border border-[#e8dfd5] text-[#1f1d1d] font-semibold rounded text-xs hover:bg-[#e4e2de] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                        Choose Photo File...
                      </button>
                      <p className="text-[10px] text-[#59413e] mt-1">Supports JPG, PNG, WEBP files.</p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-2.5 py-1.5 bg-[#fbf9f5] border border-[#e8dfd5] rounded text-xs text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Surname *
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Given Name *
              </label>
              <input
                type="text"
                required
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="e.g. Wei"
                className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Gender
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  className="accent-[#8e1616]"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  className="accent-[#8e1616]"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Deceased Status
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="accent-[#8e1616]"
                />
                <span>Is Deceased</span>
              </label>
            </div>
          </div>

          {isDeceased && (
            <div>
              <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
                Date of Death
              </label>
              <input
                type="date"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#59413e] uppercase tracking-wider mb-1">
              Notes / Archival References
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Biographical notes..."
              className="w-full px-3 py-2 bg-white border border-[#e8dfd5] rounded text-sm text-[#1f1d1d] focus:outline-none focus:border-[#8e1616]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e8dfd5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8dfd5] text-[#59413e] font-semibold rounded hover:bg-[#eae8e4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#8e1616] text-white font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity cursor-pointer shadow"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
