'use client';

// src/app/custom-tailoring/page.tsx
import React from 'react';
import { BlouseCustomizer } from '../../features/BlouseCustomizer';

export default function CustomizerPage() {
  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Bespoke Customization
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon leading-tight">
            Design Your Blouse Live
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs text-maroon/70 max-w-md mx-auto">
            Select your desired neck cuts, sleeve parameters, and embroidery details. Upload your reference fabric or sketch to get a pricing estimate and save your styling profile.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <BlouseCustomizer />
        </div>

      </div>
    </section>
  );
}
