'use client';

// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Hero } from '../widgets/Hero';
import { WhyChooseUs } from '../widgets/WhyChooseUs';
import { CollectionsGrid } from '../widgets/CollectionsGrid';
import { AariShowcase } from '../widgets/AariShowcase';
import { ServicesGrid } from '../widgets/ServicesGrid';
import { InstagramGallery } from '../widgets/InstagramGallery';
import { TestimonialsCarousel } from '../widgets/TestimonialsCarousel';

export default function HomePage() {
  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello Mahathi Tailor Shop! I would like to book a bridal coordinate consultation for my wedding.");
    window.open(`https://wa.me/919347001303?text=${msg}`, '_blank');
  };

  return (
    <div className="w-full bg-[#FFF8F0]/10 animate-fade-in">
      {/* 1. Hero Landing Page Banner */}
      <Hero />

      {/* 2. Brand Credibility Pillars */}
      <WhyChooseUs />

      {/* 3. Featured Categories Lookbook */}
      <CollectionsGrid />

      {/* 4. Interactive Before/After Trace Sketch comparison */}
      <AariShowcase />

      {/* 5. Pricing and Booking Services */}
      <ServicesGrid />

      {/* 6. Mid-page Banner call-to-action */}
      <section className="py-24 bg-maroon text-white relative overflow-hidden border-y border-gold/15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-maroon-light via-maroon to-maroon-dark">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(gold_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center relative z-10 space-y-8">
          <span className="font-poppins text-xs font-semibold tracking-[0.3em] text-gold uppercase block">
            Bespoke Bridal Couture
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto text-white">
            Design Your Dream Bridal Outfit <br />
            <span className="text-gold italic font-normal">With Mahathi Tailor Shop</span>
          </h2>
          <p className="font-poppins text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Coordinated wedding sets, matching sleeves embroidery patterns, and custom latkan tassels. Book a studio appointment or consult with our lead designers on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/custom-tailoring"
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-white text-maroon hover:shadow-glow hover:-translate-y-0.5 px-8 py-4 rounded-full border border-gold transition-all duration-300 w-full sm:w-auto text-center"
            >
              Start Customizing Live
            </Link>
            <button 
              onClick={handleWhatsApp}
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-transparent hover:bg-white/10 text-white hover:text-gold px-8 py-4 rounded-full border border-white/30 hover:border-gold hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-center cursor-pointer"
            >
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* 7. Pinterest Masonry Photo Gallery */}
      <InstagramGallery />

      {/* 8. Bridal Stacking Reviews */}
      <TestimonialsCarousel />

    </div>
  );
}
