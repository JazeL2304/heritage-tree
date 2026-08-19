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
    <div className="absolute top-4 right-6 z-30 flex items-center bg-[#fbf9f5] border border-[#e8dfd5] rounded-full shadow-md p-1 gap-1">
      <button
        onClick={onZoomIn}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Zoom In"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
      </button>

      <button
        onClick={onZoomOut}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined text-[20px]">remove</span>
      </button>

      <button
        onClick={onReset}
        className="px-2 py-1 rounded text-xs font-bold text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer select-none"
        title="Reset Zoom to 100%"
      >
        {Math.round(zoom * 100)}%
      </button>

      <div className="w-px h-6 bg-[#e8dfd5] my-auto mx-1"></div>

      <button
        onClick={onFitScreen}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Fit to Screen"
      >
        <span className="material-symbols-outlined text-[20px]">fit_screen</span>
      </button>

      <button
        onClick={onReset}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#8e1616] hover:bg-[#efeeea] transition-colors cursor-pointer"
        title="Reset Canvas"
      >
        <span className="material-symbols-outlined text-[20px]">restart_alt</span>
      </button>
    </div>
  );
};
