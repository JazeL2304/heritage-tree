'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { FamilyMember, TreeConnection, CanvasTransform } from '@/types/family';
import { TreeNodeCard } from './TreeNodeCard';
import { TreeConnector } from './TreeConnector';
import { CanvasToolbar } from './CanvasToolbar';

const NODE_W = 170;
const NODE_H = 160;

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute tree bounding-box center
  const getCenter = useCallback(() => {
    if (!members.length) return { cx: 0, cy: 0 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const m of members) {
      const mx = m.x ?? 0;
      const my = m.y ?? 0;
      if (mx < minX) minX = mx;
      if (mx + NODE_W > maxX) maxX = mx + NODE_W;
      if (my < minY) minY = my;
      if (my + NODE_H > maxY) maxY = my + NODE_H;
    }
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
  }, [members]);

  const [transform, setTransform] = useState<CanvasTransform>({
    x: 0,
    y: 0,
    zoom: 1,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Center tree on mount / when members change
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !members.length) return;
    const { cx, cy } = getCenter();
    const viewW = el.clientWidth;
    const viewH = el.clientHeight;
    // Position so tree center lands in the middle of the viewport
    setTransform({ x: viewW / 2 - cx, y: viewH / 2 - cy, zoom: 1 });
    setHasInitialized(true);
  }, [members.length > 0 ? 'ready' : 'empty', getCenter]);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  // GSAP Animated Toolbar actions
  const animateTransform = (targetX: number, targetY: number, targetZoom: number) => {
    const obj = { ...transform };
    gsap.to(obj, {
      x: targetX,
      y: targetY,
      zoom: targetZoom,
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: () => {
        setTransform({ x: obj.x, y: obj.y, zoom: obj.zoom });
      },
    });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(transform.zoom * 1.2, 2.2);
    animateTransform(transform.x, transform.y, newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(transform.zoom * 0.8, 0.4);
    animateTransform(transform.x, transform.y, newZoom);
  };

  const handleFitScreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const { cx, cy } = getCenter();
    animateTransform(el.clientWidth / 2 - cx, el.clientHeight / 2 - cy, 1);
  };

  const handleReset = () => {
    handleFitScreen();
  };

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="ml-[320px] flex-1 h-[calc(100vh-4rem)] relative overflow-hidden parchment-grid select-none cursor-grab active:cursor-grabbing"
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
        className="absolute left-0 top-0 w-0 h-0"
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
