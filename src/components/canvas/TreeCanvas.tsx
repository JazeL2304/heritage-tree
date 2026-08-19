'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FamilyMember, TreeConnection, CanvasTransform } from '@/types/family';
import { TreeNodeCard } from './TreeNodeCard';
import { TreeConnector } from './TreeConnector';
import { CanvasToolbar } from './CanvasToolbar';

interface TreeCanvasProps {
  members: FamilyMember[];
  connections: TreeConnection[];
  activeMember: FamilyMember | null;
  onSelectMember: (member: FamilyMember) => void;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  members,
  connections,
  activeMember,
  onSelectMember,
}) => {
  const [transform, setTransform] = useState<CanvasTransform>({
    x: 400,
    y: 150,
    zoom: 1,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click drag
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setTransform((prev) => {
      const newZoom = Math.min(Math.max(prev.zoom * zoomFactor, 0.4), 2.2);
      return { ...prev, zoom: newZoom };
    });
  };

  // Toolbar actions
  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.15, 2.2),
    }));
  };

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom * 0.85, 0.4),
    }));
  };

  const handleFitScreen = () => {
    setTransform({ x: 400, y: 150, zoom: 1 });
  };

  const handleReset = () => {
    setTransform({ x: 400, y: 150, zoom: 1 });
  };

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      class="ml-[320px] flex-1 h-[calc(100vh-4rem)] relative overflow-hidden parchment-grid select-none cursor-grab active:cursor-grabbing"
    >
      {/* Floating Canvas Toolbar */}
      <CanvasToolbar
        zoom={transform.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitScreen={handleFitScreen}
        onReset={handleReset}
      />

      {/* Infinite Canvas Transform Viewport */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        class="absolute left-1/2 top-10 w-0 h-0"
      >
        {/* Render Orthogonal Lines */}
        <TreeConnector connections={connections} />

        {/* Render Node Cards */}
        {members.map((member) => (
          <TreeNodeCard
            key={member.id}
            member={member}
            isActive={activeMember?.id === member.id}
            onSelect={onSelectMember}
          />
        ))}
      </div>
    </main>
  );
};
