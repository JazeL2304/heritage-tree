'use client';

import React from 'react';

interface NavbarProps {
  isAuthenticated?: boolean;
  onOpenPasscodeModal?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onOpenPasscodeModal,
  onSignOut,
}) => {
  return (
    <nav className="flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 bg-[#8e1616] border-b border-[#e8dfd5] text-white shadow-md">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#fed65b] text-[28px]">
          account_tree
        </span>
        <span className="font-bold text-lg text-[#fed65b] tracking-widest uppercase font-['Plus_Jakarta_Sans']">
          HeritageTree
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 h-full items-center">
        <a
          href="#"
          className="text-[#fed65b] font-semibold tracking-wide border-b-2 border-[#fed65b] py-1 cursor-pointer transition-colors"
        >
          Lineage
        </a>
        <a
          href="#"
          className="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Archive
        </a>
        <a
          href="#"
          className="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Research
        </a>
        <a
          href="#"
          className="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Glossary
        </a>
      </div>

      {/* Right Action Button (Clean Sign In / Account Button) */}
      <div className="flex items-center gap-3">
        <button
          onClick={isAuthenticated && onSignOut ? onSignOut : onOpenPasscodeModal}
          className="text-xs text-white border-2 border-[#fed65b] px-4 py-1.5 rounded font-semibold tracking-wide hover:bg-[#6a0006] transition-colors cursor-pointer uppercase flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">account_circle</span>
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </nav>
  );
};
