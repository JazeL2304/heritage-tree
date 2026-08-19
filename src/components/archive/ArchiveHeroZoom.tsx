'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface ArchiveHeroZoomProps {
  onScrollToGallery: () => void;
  onOpenAddModal: () => void;
}

export const ArchiveHeroZoom: React.FC<ArchiveHeroZoomProps> = ({
  onScrollToGallery,
  onOpenAddModal,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const frameCardRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRef.current.offsetHeight;
      
      // Calculate scroll ratio (0 to 1) based on container position relative to viewport
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = heroHeight - windowHeight / 2;
      const progress = Math.min(1, Math.max(0, scrolled / maxScroll));
      setScrollProgress(progress);

      // GSAP smooth transform updates
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          scale: 1 + progress * 1.8,
          rotationX: progress * 12,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }

      if (frameCardRef.current) {
        gsap.to(frameCardRef.current, {
          scale: 1 + progress * 1.2,
          z: progress * 300,
          boxShadow: `0 ${20 + progress * 40}px ${30 + progress * 50}px rgba(0, 0, 0, ${0.4 + progress * 0.3})`,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }

      if (textOverlayRef.current) {
        gsap.to(textOverlayRef.current, {
          opacity: 1 - progress * 1.5,
          y: -progress * 80,
          scale: 1 - progress * 0.2,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-[75vh] min-h-[500px] rounded-2xl overflow-hidden border-2 border-[#8e1616] shadow-2xl bg-[#140e0c] select-none mb-8"
      style={{ perspective: '1000px' }}
    >
      {/* Background Hero Image with GSAP Zoom Effect */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-75"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&auto=format&fit=crop&q=80")',
          filter: 'brightness(0.65) contrast(1.1)',
          willChange: 'transform',
        }}
      />

      {/* Dark Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#140e0c] via-black/40 to-[#140e0c]/80 pointer-events-none" />

      {/* Centerpiece 3D Framed Memory Card */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
        <div
          ref={frameCardRef}
          className="relative max-w-xl w-full bg-[#1f1614]/90 border-2 border-[#fed65b]/80 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-2xl text-center transition-shadow"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8e1616] text-[#fed65b] rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>Galeri & Arsip Bersejarah Trah Li</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white font-['Poppins'] tracking-tight leading-tight">
            Warisan & Kenangan Silsilah Keluarga
          </h2>

          <p className="text-xs md:text-sm text-[#e8dfd5]/90 mt-3 leading-relaxed max-w-lg mx-auto">
            Abadikan momen berharga, dokumen silsilah leluhur, foto masa kecil, dan kegiatan silaturahmi keluarga besar dalam satu arsip digital.
          </p>

          {/* Action Buttons inside Hero */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <button
              onClick={onScrollToGallery}
              className="px-5 py-2.5 bg-[#8e1616] hover:bg-[#6b0f0f] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">collections</span>
              <span>Jelajahi Koleksi Arsip</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-[#eae8e4] hover:bg-[#e4e2de] text-[#1f1d1d] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <span>Unggah Foto Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator Badge */}
      <div
        ref={textOverlayRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/80 pointer-events-none"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
          Gulir Ke Bawah Untuk Zoom & Masuk Ke Arsip ({Math.round(scrollProgress * 100)}%)
        </span>
        <span className="material-symbols-outlined text-[24px] animate-bounce text-[#fed65b]">
          keyboard_double_arrow_down
        </span>
      </div>
    </div>
  );
};
