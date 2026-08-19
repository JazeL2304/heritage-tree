'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col items-center py-4 w-full bg-[#eae8e4] border-t border-[#e8dfd5] text-[#59413e]">
      <div className="flex gap-6 mb-2 text-xs font-semibold">
        <a href="#" className="hover:text-[#8e1616] hover:underline transition-all opacity-90">
          Ancestral Laws
        </a>
        <a href="#" className="hover:text-[#8e1616] hover:underline transition-all opacity-90">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#8e1616] hover:underline transition-all opacity-90">
          Archival Guidelines
        </a>
      </div>
      <div className="text-[11px] uppercase tracking-widest opacity-70">
        © 2024 HeritageTree. Preservation of the Eternal Lineage.
      </div>
    </footer>
  );
};
