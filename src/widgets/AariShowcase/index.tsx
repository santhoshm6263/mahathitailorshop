'use client';

// src/widgets/AariShowcase/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export const AariShowcase: React.FC = () => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setPos(percentage);
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (dragging.current && e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouse = (e: React.MouseEvent) => {
    if (dragging.current) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    const stopDrag = () => { dragging.current = false; };
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, []);

  return (
    <section className="py-24 bg-maroon text-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Interactive Before-After Slider */}
        <div className="lg:col-span-6 space-y-6">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Handcraft Lifecycle</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">Embroidery Transformation</h2>
          <div className="w-12 h-[2px] bg-gold"></div>
          <p className="font-poppins text-xs text-white/80 leading-relaxed mb-6">
            Drag the golden divider to see our stenciling pencil sketch drawn on raw silk (before) transform into the glistening, gold-threaded finished Aari work (after).
          </p>

          <div 
            ref={containerRef}
            className="slider-container w-full h-[320px] rounded-2xl border border-gold/30 shadow-luxury"
            onMouseMove={handleMouse}
            onTouchMove={handleTouch}
            onClick={(e) => handleMove(e.clientX)}
          >
            <div className="w-full h-full">
              <img src="/assets/aari-detail.png" className="w-full h-full object-cover select-none pointer-events-none" alt="Finished Embroidery" />
              <span className="absolute bottom-4 right-4 bg-maroon/80 border border-gold/20 text-gold font-poppins text-[9px] uppercase px-3 py-1 rounded">Finished Embroidery</span>
            </div>

            <div className="slider-before" style={{ width: `${pos}%` }}>
              <img 
                src="/assets/aari-detail.png" 
                className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none" 
                alt="Tracing sketch outline"
                style={{ 
                  filter: 'grayscale(100%) contrast(150%) brightness(105%) sepia(20%)',
                  width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                  maxWidth: 'none'
                }}
              />
              <span className="absolute bottom-4 left-4 bg-black/60 border border-white/20 text-white font-poppins text-[9px] uppercase px-3 py-1 rounded">Tracing Sketch Outline</span>
            </div>

            <div 
              className="slider-handle" 
              style={{ left: `${pos}%` }}
              onMouseDown={() => { dragging.current = true; }}
              onTouchStart={() => { dragging.current = true; }}
            >
              <div className="slider-button">↔</div>
            </div>
          </div>
        </div>

        {/* Right Column: Specialties list */}
        <div className="lg:col-span-6 space-y-8">
          <h3 className="font-playfair text-2xl sm:text-3xl font-semibold text-gold">Handwork Specialties</h3>
          <div className="space-y-6 font-poppins text-sm text-white/80 leading-relaxed">
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Traditional Maggam Work:</strong> Woven tightly on custom wooden frames, accommodating heavy metallic spring wires and crystals.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Stone & Kundan Settings:</strong> Glass Kundan gemstones meticulously set inside floral lattices to add royal wedding sparkles.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Gold Zari Borders:</strong> Dual-border needlework mapping sleeve cuffs and backneck silhouettes with high-grade copper gold threads.</p>
            </div>
          </div>
          <div className="pt-4 flex items-center space-x-4">
            <Link 
              href="/custom-tailoring"
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-6 py-3.5 rounded-full border border-gold hover:bg-white hover:text-maroon transition-all"
            >
              Start Designing Live
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
export default AariShowcase;
