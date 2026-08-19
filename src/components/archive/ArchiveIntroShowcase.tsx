'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ArchivalItem } from './ArchiveView';

interface ArchiveIntroShowcaseProps {
  items: ArchivalItem[];
  onComplete: () => void;
}

export const ArchiveIntroShowcase: React.FC<ArchiveIntroShowcaseProps> = ({
  items,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFinish = useCallback(() => {
    if (!overlayRef.current) {
      onComplete();
      return;
    }
    gsap.to(overlayRef.current, {
      scale: 0.9,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete,
    });
  }, [onComplete]);

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current) return;
      if (targetIndex < 0) return;

      if (targetIndex >= items.length) {
        handleFinish();
        return;
      }

      isAnimatingRef.current = true;
      const prevIndex = currentIndex;
      const currentSlide = slideRefs.current[prevIndex];
      const nextSlide = slideRefs.current[targetIndex];
      const nextTitle = titleRefs.current[targetIndex];

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(targetIndex);
          isAnimatingRef.current = false;
        },
      });

      // 1. Current slide zooms out and fades
      if (currentSlide) {
        tl.to(
          currentSlide,
          {
            scale: 0.65,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // 2. Next slide zooms from 1.3 to 1 and fades in
      if (nextSlide) {
        tl.fromTo(
          nextSlide,
          { scale: 1.35, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            ease: 'power2.out',
          },
          0.1
        );
      }

      // 3. Next title slides in smoothly
      if (nextTitle) {
        tl.fromTo(
          nextTitle,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.4
        );
      }
    },
    [currentIndex, items.length, handleFinish]
  );

  // Wheel & touch navigation
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      if (e.deltaY > 25) {
        goToSlide(currentIndex + 1);
      } else if (e.deltaY < -25 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      if (diffY > 40) {
        goToSlide(currentIndex + 1);
      } else if (diffY < -40 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        goToSlide(currentIndex + 1);
      } else if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'Escape') {
        handleFinish();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, goToSlide, handleFinish]);

  if (items.length === 0) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#0c0807] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Top Bar Controls */}
      <div className="absolute top-6 left-6 right-6 z-30 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          <span className="material-symbols-outlined text-[16px] text-[#fed65b]">
            photo_library
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#fed65b]">
            Showcase Arsip Bersejarah
          </span>
        </div>

        <button
          onClick={handleFinish}
          className="px-4 py-2 bg-[#8e1616] hover:bg-[#6b0f0f] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow flex items-center gap-1.5"
        >
          <span>Lewati Intro</span>
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>

      {/* Fullscreen Photo Slides Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {items.map((item, index) => {
          const isInitialActive = index === 0;

          return (
            <div
              key={item.id}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              style={{
                visibility: isInitialActive ? 'visible' : 'hidden',
                opacity: isInitialActive ? 1 : 0,
                transform: 'scale(1)',
                willChange: 'transform, opacity',
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {/* Fullscreen Background Photo */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 pointer-events-none" />

              {/* Photo Information Caption Overlay */}
              <div
                ref={(el) => {
                  titleRefs.current[index] = el;
                }}
                className="absolute bottom-16 left-8 right-8 md:left-16 md:right-16 z-20 max-w-2xl text-white"
              >
                <div className="inline-block px-3 py-1 bg-[#8e1616] text-[#fed65b] text-[11px] font-bold uppercase tracking-widest rounded mb-3 shadow">
                  {item.category === 'events'
                    ? 'Foto Pertemuan & Acara'
                    : item.category === 'childhood'
                    ? 'Foto Masa Kecil'
                    : item.category === 'photos'
                    ? 'Foto Jadul & Kenangan'
                    : 'Dokumen Arsip'}
                </div>

                <h2 className="text-2xl md:text-4xl font-bold font-['Poppins'] text-white tracking-tight drop-shadow-md">
                  {item.title}
                </h2>

                <p className="text-xs md:text-sm text-[#e8dfd5] mt-2 line-clamp-3 leading-relaxed max-w-xl">
                  {item.description || 'Tidak ada keterangan tambahan.'}
                </p>

                <div className="mt-3 text-xs text-[#fed65b] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>Tanggal Dokumen: {item.date || 'Tahun N/A'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Scroll Prompt & Slide Counter */}
      <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-between items-center text-white/80 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold">
          <span>Acara {currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span>{items.length} Foto</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-[#fed65b]">
          <span>Gulir Layar Ke Bawah Untuk Zoom-Out Ke Foto Berikutnya</span>
          <span className="material-symbols-outlined text-[18px] animate-bounce">
            keyboard_double_arrow_down
          </span>
        </div>
      </div>
    </div>
  );
};
