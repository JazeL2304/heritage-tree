'use client';

import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  onOpenPasscodeModal: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onOpenPasscodeModal,
  onSignOut,
}) => {
  return (
    <nav class="flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 bg-[#8e1616] border-b border-[#e8dfd5] text-white shadow-md">
      {/* Brand Logo */}
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-[#fed65b] text-[28px]">
          account_tree
        </span>
        <span class="font-bold text-lg text-[#fed65b] tracking-widest uppercase font-['Plus_Jakarta_Sans']">
          HeritageTree
        </span>
      </div>

      {/* Navigation Links */}
      <div class="hidden md:flex gap-8 h-full items-center">
        <a
          href="#"
          class="text-[#fed65b] font-semibold tracking-wide border-b-2 border-[#fed65b] py-1 cursor-pointer transition-colors"
        >
          Lineage
        </a>
        <a
          href="#"
          class="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Archive
        </a>
        <a
          href="#"
          class="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Research
        </a>
        <a
          href="#"
          class="text-white/90 font-semibold tracking-wide hover:text-[#fed65b] transition-colors py-1 border-b-2 border-transparent"
        >
          Glossary
        </a>
      </div>

      {/* Access Gate Button */}
      <div class="flex items-center gap-3">
        {isAuthenticated ? (
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 bg-[#6a0006] text-[#fed65b] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#fed65b]/40">
              <span class="material-symbols-outlined text-[16px]">lock_open</span>
              Unlocked
            </span>
            <button
              onClick={onSignOut}
              class="text-xs text-white/80 hover:text-white underline cursor-pointer"
            >
              Lock
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenPasscodeModal}
            class="text-sm text-white border-2 border-[#fed65b] px-4 py-1.5 rounded font-semibold tracking-wide hover:bg-[#6a0006] transition-colors cursor-pointer uppercase flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-[18px]">key</span>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
