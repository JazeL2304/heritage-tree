'use client';

import React from 'react';

interface NavbarProps {
  activeTab: 'lineage' | 'archive' | 'events';
  onSelectTab: (tab: 'lineage' | 'archive' | 'events') => void;
  isAuthenticated?: boolean;
  onOpenPasscodeModal?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isAuthenticated,
  onOpenPasscodeModal,
  onSignOut,
}) => {
  return (
    <nav className="flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 bg-[#8e1616] border-b border-[#e8dfd5] text-white shadow-md">
      {/* Brand Logo */}
      <div
        onClick={() => onSelectTab('lineage')}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <span className="material-symbols-outlined text-[#fed65b] text-[28px]">
          account_tree
        </span>
        <span className="font-bold text-lg text-[#fed65b] tracking-widest uppercase font-['Poppins']">
          HeritageTree
        </span>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex gap-8 h-full items-center">
        <button
          onClick={() => onSelectTab('lineage')}
          className={`font-semibold tracking-wide py-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'lineage'
              ? 'text-[#fed65b] border-[#fed65b]'
              : 'text-white/90 border-transparent hover:text-[#fed65b]'
          }`}
        >
          Lineage
        </button>

        <button
          onClick={() => onSelectTab('archive')}
          className={`font-semibold tracking-wide py-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'archive'
              ? 'text-[#fed65b] border-[#fed65b]'
              : 'text-white/90 border-transparent hover:text-[#fed65b]'
          }`}
        >
          Archive
        </button>

        <button
          onClick={() => onSelectTab('events')}
          className={`font-semibold tracking-wide py-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'text-[#fed65b] border-[#fed65b]'
              : 'text-white/90 border-transparent hover:text-[#fed65b]'
          }`}
        >
          Events & Calendar
        </button>
      </div>

      {/* Navigation Links (Mobile Icons) */}
      <div className="flex md:hidden items-center gap-1">
        <button
          onClick={() => onSelectTab('lineage')}
          className={`p-1.5 rounded transition-colors ${
            activeTab === 'lineage' ? 'text-[#fed65b] bg-black/20' : 'text-white/80'
          }`}
          title="Lineage Tree"
        >
          <span className="material-symbols-outlined text-[20px]">account_tree</span>
        </button>

        <button
          onClick={() => onSelectTab('archive')}
          className={`p-1.5 rounded transition-colors ${
            activeTab === 'archive' ? 'text-[#fed65b] bg-black/20' : 'text-white/80'
          }`}
          title="Archive Gallery"
        >
          <span className="material-symbols-outlined text-[20px]">photo_library</span>
        </button>

        <button
          onClick={() => onSelectTab('events')}
          className={`p-1.5 rounded transition-colors ${
            activeTab === 'events' ? 'text-[#fed65b] bg-black/20' : 'text-white/80'
          }`}
          title="Events & Calendar"
        >
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
        </button>
      </div>

      {/* Right Action Button (Clean Sign In / Sign Out Button) */}
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
