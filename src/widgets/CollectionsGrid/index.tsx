'use client';

// src/widgets/CollectionsGrid/index.tsx
import React from 'react';
import Link from 'next/link';

export const CollectionsGrid: React.FC = () => {
  const items = [
    { title: 'Bridal Blouses', desc: 'Heavily hand-crafted royal backnecks and zardosi sleeves.', image: '/assets/designer-blouse.png', count: '150+ Designs', query: 'Bridal Blouses' },
    { title: 'Aari Work', desc: 'Precision needlework with metallic zari threads, pearls, and kundan.', image: '/assets/aari-detail.png', count: '280+ Patterns', query: 'Aari Work' },
    { title: 'Wedding Collection', desc: 'Complete wedding sarees coordination and matching silhouettes.', image: '/assets/hero-bridal.png', count: '95+ Masterpieces', query: 'Wedding Collection' }
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Atelier Lookbooks</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Featured Collections</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <Link 
              key={idx} 
              href={`/collections?category=${encodeURIComponent(it.query)}`}
              className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-gold border border-maroon/5 hover:border-gold/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-64 overflow-hidden relative bg-maroon-dark">
                <img 
                  src={it.image} 
                  alt={it.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <span className="absolute top-4 right-4 bg-maroon text-gold border border-gold/25 font-poppins text-[9px] font-bold px-3 py-1.5 rounded-full">{it.count}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon group-hover:text-gold transition-colors duration-300">{it.title}</h3>
                  <p className="font-poppins text-xs text-maroon/70 leading-relaxed mt-2">{it.desc}</p>
                </div>
                <span className="text-gold font-poppins text-[10px] uppercase font-bold tracking-wide block">Explore Designs →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CollectionsGrid;
