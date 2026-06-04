'use client';

// src/app/aari-work/page.tsx
import React from 'react';
import Link from 'next/link';
import { AariShowcase } from '../../widgets/AariShowcase';

export default function AariWorkPage() {
  return (
    <div className="w-full min-h-screen pt-[80px] animate-fade-in">
      
      {/* 1. Header Intro */}
      <section className="bg-maroon text-white py-16 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-maroon-light via-maroon to-maroon-dark border-b border-gold/15">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Premium Hand-Craftsmanship
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
            Atelier Aari & Maggam Work
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs sm:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Our specialized hand-embroidery studio utilizes heavy tambour frames, metallic zari threads, glass kundan stones, and pearls to shape exquisite wedding blouse patterns.
          </p>
        </div>
      </section>

      {/* 2. Embedded Interactive Slider Showcase */}
      <AariShowcase />

      {/* 3. Deep Dive into Craft Details */}
      <section className="py-24 bg-[#FFF8F0]/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Technical Details</span>
            <h2 className="font-playfair text-3xl font-bold text-maroon">Our Embroidery Techniques</h2>
            <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury space-y-4">
              <span className="text-3xl block">🪡</span>
              <h4 className="font-playfair text-lg font-bold text-maroon">Tambour Needlework</h4>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                Using specialized hooked needles to draw continuous chain stitches of premium metallic gold threads, securing high durability and density.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury space-y-4">
              <span className="text-3xl block">💎</span>
              <h4 className="font-playfair text-lg font-bold text-maroon">Kundan Stone Settings</h4>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                Carefully gluing glass Kundan crystals inside zari borders, then securing them with metallic gold outline stitching to prevent falls.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury space-y-4">
              <span className="text-3xl block">💮</span>
              <h4 className="font-playfair text-lg font-bold text-maroon">Zardosi Spring spirals</h4>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                Threading delicate coiled wire springs (Zardosi) onto needles to stitch dimensional floral creepers, leaves, and peacock motifs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury space-y-4">
              <span className="text-3xl block">👑</span>
              <h4 className="font-playfair text-lg font-bold text-maroon">Heavy Jali Borders</h4>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                Stitching intricate grid networks (Jali) of gold beads and pearls, creating standard luxury sheer mesh patterns for bridal sleeves.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/custom-tailoring"
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-[#D4AF37] hover:bg-maroon text-maroon hover:text-gold border border-gold px-8 py-4 rounded-full transition-all inline-block shadow-luxury"
            >
              Configure Blouse Design Online
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
