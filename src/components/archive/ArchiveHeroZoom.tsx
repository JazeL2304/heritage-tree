'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ArchiveHeroZoomProps {
  onScrollToGallery: () => void;
  onOpenAddModal: () => void;
}

export const ArchiveHeroZoom: React.FC<ArchiveHeroZoomProps> = ({
  onScrollToGallery,
  onOpenAddModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);

  // Collage photo refs for Jesper Landberg style 3D explosion zoom
  const centerPhotoRef = useRef<HTMLDivElement>(null);
  const topLeftPhotoRef = useRef<HTMLDivElement>(null);
  const topRightPhotoRef = useRef<HTMLDivElement>(null);
  const bottomLeftPhotoRef = useRef<HTMLDivElement>(null);
  const bottomRightPhotoRef = useRef<HTMLDivElement>(null);

  const heroTextRef = useRef<HTMLDivElement>(null);
  const revealTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinnedRef.current) return;

    // Use GSAP Context for safe React lifecycle & automatic cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth inertia scroll-scrubbing
        },
      });

      // 1. Center photo zooms forward into screen
      tl.to(
        centerPhotoRef.current,
        {
          scale: 3.8,
          opacity: 0.15,
          rotation: 4,
          ease: 'none',
        },
        0
      );

      // 2. Surrounding photos burst outward in 3D space (Jesper Landberg signature effect)
      tl.to(
        topLeftPhotoRef.current,
        {
          x: '-65vw',
          y: '-65vh',
          scale: 2.5,
          rotation: -35,
          opacity: 0,
          ease: 'none',
        },
        0
      );

      tl.to(
        topRightPhotoRef.current,
        {
          x: '65vw',
          y: '-65vh',
          scale: 2.5,
          rotation: 35,
          opacity: 0,
          ease: 'none',
        },
        0
      );

      tl.to(
        bottomLeftPhotoRef.current,
        {
          x: '-65vw',
          y: '65vh',
          scale: 2.5,
          rotation: 25,
          opacity: 0,
          ease: 'none',
        },
        0
      );

      tl.to(
        bottomRightPhotoRef.current,
        {
          x: '65vw',
          y: '65vh',
          scale: 2.5,
          rotation: -25,
          opacity: 0,
          ease: 'none',
        },
        0
      );

      // 3. Hero intro text fades away
      tl.to(
        heroTextRef.current,
        {
          scale: 0.7,
          opacity: 0,
          y: -80,
          ease: 'none',
        },
        0
      );

      // 4. Reveal prompt appears as zoom finishes
      tl.fromTo(
        revealTextRef.current,
        { opacity: 0, scale: 0.85, y: 40 },
        { opacity: 1, scale: 1, y: 0, ease: 'power2.out' },
        0.55
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] mb-12 select-none">
      {/* Pinned Viewport Container */}
      <div
        ref={pinnedRef}
        className="sticky top-0 h-[85vh] min-h-[550px] w-full rounded-2xl overflow-hidden border-2 border-[#8e1616] shadow-2xl bg-[#120b0a] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120b0a] via-black/50 to-[#120b0a]/80 z-20 pointer-events-none" />

        {/* 1. Center Featured Photo Frame */}
        <div
          ref={centerPhotoRef}
          className="absolute z-10 w-[320px] md:w-[460px] h-[220px] md:h-[300px] rounded-xl overflow-hidden shadow-2xl border-2 border-[#fed65b] bg-[#221815]"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&auto=format&fit=crop&q=80"
            alt="Foto Utama Silsilah Trah Li"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. Top-Left Photo Frame */}
        <div
          ref={topLeftPhotoRef}
          className="absolute z-10 w-[200px] md:w-[280px] h-[140px] md:h-[180px] -top-8 -left-8 rounded-lg overflow-hidden shadow-xl border border-white/30 bg-[#221815]"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80"
            alt="Dokumen Bersejarah"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3. Top-Right Photo Frame */}
        <div
          ref={topRightPhotoRef}
          className="absolute z-10 w-[210px] md:w-[290px] h-[150px] md:h-[190px] -top-6 -right-6 rounded-lg overflow-hidden shadow-xl border border-white/30 bg-[#221815]"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80"
            alt="Momen Silaturahmi"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4. Bottom-Left Photo Frame */}
        <div
          ref={bottomLeftPhotoRef}
          className="absolute z-10 w-[190px] md:w-[270px] h-[130px] md:h-[170px] -bottom-8 -left-6 rounded-lg overflow-hidden shadow-xl border border-white/30 bg-[#221815]"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
            alt="Naskah Kuno Zupu"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 5. Bottom-Right Photo Frame */}
        <div
          ref={bottomRightPhotoRef}
          className="absolute z-10 w-[220px] md:w-[300px] h-[150px] md:h-[190px] -bottom-6 -right-8 rounded-lg overflow-hidden shadow-xl border border-white/30 bg-[#221815]"
          style={{ willChange: 'transform, opacity' }}
        >
          <img
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80"
            alt="Kenangan Leluhur"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Initial Hero Content (Fades out during scroll zoom) */}
        <div
          ref={heroTextRef}
          className="relative z-30 max-w-xl w-full bg-[#1b1210]/85 border-2 border-[#fed65b]/70 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-2xl text-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8e1616] text-[#fed65b] rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>GSAP ScrollTrigger Showcase</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white font-['Poppins'] tracking-tight">
            Warisan & Kenangan Silsilah Keluarga
          </h2>

          <p className="text-xs md:text-sm text-[#e8dfd5]/90 mt-2.5 leading-relaxed max-w-md mx-auto">
            Gulir layar ke bawah untuk melihat efek GSAP ScrollTrigger 3D zoom dan masuk ke galeri koleksi arsip.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-[#fed65b] bg-black/40 py-2 px-4 rounded-lg border border-[#fed65b]/30 w-fit mx-auto">
            <span className="material-symbols-outlined text-[18px] animate-bounce">mouse</span>
            <span>Gulir Layar Ke Bawah Untuk Zoom 3D</span>
          </div>
        </div>

        {/* Reveal Prompt Content (Fades in when zoom completes) */}
        <div
          ref={revealTextRef}
          className="absolute z-30 max-w-md w-full bg-[#8e1616]/95 border-2 border-[#fed65b] rounded-xl p-6 shadow-2xl text-center text-white"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="w-12 h-12 rounded-full bg-[#fed65b] text-[#8e1616] flex items-center justify-center mx-auto mb-3 shadow">
            <span className="material-symbols-outlined text-[26px]">collections_bookmark</span>
          </div>

          <h3 className="text-xl font-bold font-['Poppins'] text-[#fed65b]">
            Koleksi Arsip Siap Dijejaki
          </h3>

          <p className="text-xs text-[#e8dfd5] mt-1.5 leading-relaxed">
            Eksplorasi foto jadul, dokumen bersejarah, dan kenangan keluarga di bawah ini.
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={onScrollToGallery}
              className="px-5 py-2.5 bg-[#fed65b] hover:bg-[#eac044] text-[#8e1616] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">south</span>
              <span>Masuk Ke Galeri Arsip</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-black/40 hover:bg-black/60 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all border border-white/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <span>Tambah Arsip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
