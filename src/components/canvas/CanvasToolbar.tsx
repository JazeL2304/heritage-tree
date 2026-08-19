'use client';

import React from 'react';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onReset: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onReset,
}) => {
  return (
    <div class="absolute top-4 right-6 z-30 flex items-center bg-[#fbf9f5] border border-[#e8dfd5] rounded-full shadow-md p-1 gap-1">
      <button
        onClick={onZoomIn}
        class="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Zoom In"
      >
        <span class="material-symbols-outlined text-[20px]">add</span>
      </button>

      <button
        onClick={onZoomOut}
        class="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Zoom Out"
      >
        <span class="material-symbols-outlined text-[20px]">remove</span>
      </button>

      <div class="px-2 text-xs font-bold text-[#8e1616] select-none">
        {Math.round(zoom * 100)}%
      </div>

      <div class="w-px h-6 bg-[#e8dfd5] my-auto mx-1"></div>

      <button
        onClick={onFitScreen}
        class="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Fit to Screen"
      >
        <span class="material-symbols-outlined text-[20px]">fit_screen</span>
      </button>

      <button
        onClick={onReset}
        class="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Reset Canvas"
      >
        <span class="material-symbols-outlined text-[20px]">restart_alt</span>
      </button>
    </div>
  );
};
