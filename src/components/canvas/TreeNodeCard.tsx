'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FamilyMember } from '@/types/family';

interface TreeNodeCardProps {
  member: FamilyMember;
  isActive: boolean;
  onSelect: (member: FamilyMember) => void;
}

export const TreeNodeCard: React.FC<TreeNodeCardProps> = ({
  member,
  isActive,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Entrance Animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.85, autoAlpha: 0, y: (member.y || 0) + 20 },
        { scale: 1, autoAlpha: 1, y: member.y || 0, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }
  }, [member.id]);

  const getYearsText = () => {
    const birthYear = member.birthDate ? new Date(member.birthDate).getFullYear() : '????';
    if (member.isDeceased) {
      const deathYear = member.deathDate ? new Date(member.deathDate).getFullYear() : '????';
      return `${birthYear} - ${deathYear}`;
    }
    return `${birthYear} - Present`;
  };

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(member);
      }}
      style={{
        transform: `translate(${member.x || 0}px, ${member.y || 0}px)`,
      }}
      className={`tree-node-card absolute w-[160px] bg-[#8e1616] rounded border shadow-sm flex flex-col items-center p-3 z-10 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isActive
          ? 'border-2 border-[#fed65b] shadow-[0_4px_20px_rgba(254,214,91,0.35)] scale-105 z-20'
          : 'border-[#e8dfd5] hover:border-[#fed65b]'
      }`}
    >
      {/* Active Selection Badge */}
      {isActive && (
        <div className="absolute -top-3 bg-[#fed65b] text-[#745c00] px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold shadow-sm z-20">
          Subject
        </div>
      )}

      {/* Avatar Image */}
      <div className="relative w-16 h-16 rounded-full border-2 border-[#fbf9f5] object-cover mb-1 -mt-7 bg-[#fbf9f5] shadow-sm overflow-hidden flex items-center justify-center text-[#8e1616]">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`${member.surname} ${member.givenName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-[32px]">
            {member.gender === 'female' ? 'woman' : 'man'}
          </span>
        )}
      </div>

      {/* Surname */}
      <div className="text-[11px] font-semibold text-[#fed65b] opacity-90 uppercase tracking-widest mt-1">
        {member.surname}
      </div>

      {/* Given Name */}
      <div className="text-sm text-white font-bold text-center leading-tight mb-1 font-['Plus_Jakarta_Sans']">
        {member.givenName}
      </div>

      {/* Date */}
      <div className="text-[10px] text-white/80 mb-2 bg-black/20 px-1.5 py-0.5 rounded">
        {getYearsText()}
      </div>

      {/* Status Icons Footer */}
      <div className="w-full border-t border-white/20 pt-1 flex justify-center gap-1.5">
        {member.isVerified && (
          <span
            className="material-symbols-outlined text-[#fed65b] text-[15px]"
            title="Documented Lineage Record"
          >
            verified
          </span>
        )}
        {member.notes && (
          <span
            className="material-symbols-outlined text-white/60 text-[15px]"
            title={member.notes}
          >
            notes
          </span>
        )}
      </div>
    </div>
  );
};
