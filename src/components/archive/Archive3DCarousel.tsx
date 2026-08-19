'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ArchivalItem } from './ArchiveView';

interface Archive3DCarouselProps {
  items: ArchivalItem[];
  onSelectItem: (item: ArchivalItem) => void;
}

export const Archive3DCarousel: React.FC<Archive3DCarouselProps> = ({
  items,
  onSelectItem,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag pan state
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Compute 3D Transform parameters for each card relative to active index
  const get3DStyle = useCallback(
    (index: number, activeIdx: number) => {
      const total = items.length;
      if (total === 0) return { x: 0, z: 0, rotationY: 0, scale: 1, opacity: 1, zIndex: 1 };

      const diff = index - activeIdx;
      const absDiff = Math.abs(diff);

      if (diff === 0) {
        return {
          x: 0,
          z: 220,
          rotationY: 0,
          scale: 1.1,
          opacity: 1,
          zIndex: 40,
        };
      }

      const direction = diff > 0 ? 1 : -1;
      // Curved 3D positioning
      const rotationY = -direction * Math.min(55, 30 + absDiff * 10);
      const z = 200 - absDiff * 130;
      const x = diff * 210;
      const scale = Math.max(0.55, 1 - absDiff * 0.18);
      const opacity = Math.max(0.15, 1 - absDiff * 0.35);
      const zIndex = Math.max(1, 40 - absDiff * 5);

      return { x, z, rotationY, scale, opacity, zIndex };
    },
    [items.length]
  );

  // Animate cards with GSAP when activeIndex changes
  const updateCardPositions = useCallback(
    (targetActiveIndex: number) => {
      cardRefs.current.forEach((cardEl, i) => {
        if (!cardEl) return;
        const transform = get3DStyle(i, targetActiveIndex);

        gsap.to(cardEl, {
          x: transform.x,
          z: transform.z,
          rotationY: transform.rotationY,
          scale: transform.scale,
          opacity: transform.opacity,
          zIndex: transform.zIndex,
          duration: 0.65,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    },
    [get3DStyle]
  );

  useEffect(() => {
    updateCardPositions(activeIndex);
  }, [activeIndex, updateCardPositions, items]);

  const handleNext = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Wheel scroll navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 20) handleNext();
      else if (e.deltaX < -20) handlePrev();
    } else {
      if (e.deltaY > 20) handleNext();
      else if (e.deltaY < -20) handlePrev();
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diffX = e.clientX - startX.current;
    if (diffX < -40) handleNext();
    else if (diffX > 40) handlePrev();
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - startX.current;
    if (diffX < -40) handleNext();
    else if (diffX > 40) handlePrev();
  };

  if (items.length === 0) return null;

  const currentItem = items[activeIndex];

  return (
    <div className="w-full bg-[#181210] border-2 border-[#8e1616] rounded-2xl p-6 shadow-2xl relative overflow-hidden select-none">
      {/* Ambient Decorative Header */}
      <div className="flex justify-between items-center mb-4 border-b border-[#8e1616]/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#fed65b] animate-pulse"></span>
          <h3 className="text-sm font-bold text-[#fed65b] uppercase tracking-widest font-['Poppins']">
            ✨ Galeri 3D Showcase (GSAP Coverflow)
          </h3>
        </div>
        <div className="text-xs font-semibold text-[#e8dfd5]/70 flex items-center gap-2">
          <span>Scroll atau Drag Kiri/Kanan untuk Memutar 3D</span>
          <span className="material-symbols-outlined text-[16px] text-[#fed65b]">3d_rotation</span>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[340px] md:h-[400px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => {
                if (isActive) {
                  onSelectItem(item);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{
                position: 'absolute',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
              }}
              className={`w-[260px] md:w-[310px] h-[310px] md:h-[350px] rounded-xl overflow-hidden shadow-2xl border-2 transition-shadow duration-300 cursor-pointer ${
                isActive
                  ? 'border-[#fed65b] shadow-[0_0_30px_rgba(254,214,91,0.4)]'
                  : 'border-[#8e1616]/60 hover:border-[#fed65b]/60'
              }`}
            >
              {/* Photo Image */}
              <div className="relative w-full h-[65%] bg-[#251d1a]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-3 left-3 bg-[#8e1616] text-[#fed65b] text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase">
                  {item.category === 'events'
                    ? 'Pertemuan'
                    : item.category === 'childhood'
                    ? 'Masa Kecil'
                    : item.category === 'photos'
                    ? 'Foto Jadul'
                    : 'Lainnya'}
                </div>
              </div>

              {/* Card Information */}
              <div className="p-3.5 bg-[#241a17] h-[35%] flex flex-col justify-between text-white border-t border-[#8e1616]/30">
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-[#fed65b] line-clamp-1 font-['Poppins']">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#e8dfd5]/80 mt-1 line-clamp-2 leading-relaxed">
                    {item.description || 'Tidak ada deskripsi singkat.'}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#e8dfd5]/60 pt-1 border-t border-white/10">
                  <span>📅 {item.date || 'Tahun N/A'}</span>
                  {isActive && (
                    <span className="text-[#fed65b] font-bold flex items-center gap-0.5">
                      Lihat Detail <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Counter */}
      <div className="flex items-center justify-between pt-4 border-t border-[#8e1616]/40 text-xs">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-[#8e1616] hover:bg-[#6b0f0f] text-white font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          <span>Sebelumnya</span>
        </button>

        <div className="text-center font-bold text-[#fed65b]">
          <span className="text-sm">{activeIndex + 1}</span>
          <span className="text-white/40 mx-1">/</span>
          <span className="text-white/60 text-xs">{items.length} Arsip</span>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-[#8e1616] hover:bg-[#6b0f0f] text-white font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow"
        >
          <span>Berikutnya</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
