'use client';

// src/widgets/Hero/index.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  useEffect(() => {
    // Add custom zoom animation styles to head dynamically if needed
    const styleId = 'tailwind-zoom-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes zoom {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.12) translate(-0.5%, -0.5%); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-maroon-dark text-white overflow-hidden pt-[80px]">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-bridal.png" 
          alt="Bridal Luxury Couture" 
          className="w-full h-full object-cover object-center opacity-45 scale-105 animate-zoom" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D0210] via-maroon/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D0210] via-transparent to-maroon/20"></div>
      </div>

      {/* Luxury Animated Gradients & Overlay Sparkles */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#800A2A]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-6 lg:px-12 relative z-10 py-20 flex flex-col items-start justify-center">
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-[1px] bg-gold"></div>
          <span className="font-poppins text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            Est. 2020 | Premier Bridal Studio
          </span>
        </div>

        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide leading-tight max-w-4xl text-white drop-shadow-lg mb-6">
          Luxury Bridal <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold font-normal italic">
            Tailoring & Designer
          </span> <br />
          Aari Zari Embroidery
        </h1>

        <p className="font-poppins text-sm sm:text-base text-white/80 max-w-xl leading-relaxed mb-10">
          Crafting bespoke Indian ethnic masterpieces. Each blouse, lehenga, and maggam work outfit is sculpted precisely to your custom measurements and embellished by traditional hand-embroidery masters.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <Link 
            href="/booking"
            className="font-poppins text-xs uppercase tracking-widest font-semibold bg-gold hover:bg-gold-dark text-maroon hover:shadow-glow hover:-translate-y-1 py-4 px-8 rounded-full border border-gold transition-all duration-300 text-center"
          >
            Book Free Consultation
          </Link>
          
          <Link 
            href="/custom-tailoring"
            className="font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent hover:bg-white/10 text-white hover:text-gold py-4 px-8 rounded-full border border-white/30 hover:border-gold hover:-translate-y-1 transition-all duration-300 text-center"
          >
            Design Your Blouse Live
          </Link>
        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300" onClick={() => window.scrollTo(0, window.innerHeight - 100)}>
        <span className="font-poppins text-[9px] uppercase tracking-[0.25em] text-gold/80 mb-2">Discover Mahathi</span>
        <div className="w-[18px] h-[30px] rounded-full border border-gold/40 flex items-start justify-center p-1">
          <div className="w-[2px] h-[6px] bg-gold rounded-full animate-bounce"></div>
        </div>
      </div>

    </section>
  );
};
export default Hero;
