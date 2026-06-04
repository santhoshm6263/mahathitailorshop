'use client';

// src/app/gallery/page.tsx
import React from 'react';
import { InstagramGallery } from '../../widgets/InstagramGallery';

export default function GalleryPage() {
  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Visual Catalog
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon leading-tight">
            Our Studio Gallery
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs text-maroon/70 max-w-md mx-auto">
            Take visual inspiration from our heavy zardosi sleeves, intricate pot necks, wedding sarees coordination sets, and accessories.
          </p>
        </div>

        <InstagramGallery />
      </div>
    </section>
  );
}
