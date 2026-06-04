'use client';

// src/widgets/TestimonialsCarousel/index.tsx
import React, { useState, useEffect } from 'react';

export const TestimonialsCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const list = [
    { name: 'Priya Dharshini K.', role: 'Bride (Dec 2025)', text: 'Mahathi tailored my entire wedding sarees collection. The heavy peacock Aari embroidery was masterfully finished! Ramu master did multiple fittings to ensure a slip-free shoulder fit.', avatar: 'P' },
    { name: 'Sushmitha Sen', role: 'Fashion Specialist', text: 'Their zardosi thread finish is extremely neat. Invisible copper-alloy zippers and mulmul piping highlights are perfect indicators of bespoke luxury tailoring.', avatar: 'S' }
  ];

  useEffect(() => {
    const timer = setInterval(() => { 
      setIndex((prev) => (prev + 1) % list.length); 
    }, 6000);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <section className="py-24 bg-maroon-soft/30">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block mb-3">Bridal Stories</span>
          <h2 className="font-playfair text-3xl font-bold text-maroon">Client Experiences</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-maroon/5 shadow-luxury text-center space-y-6 relative">
          <span className="absolute top-6 left-8 font-playfair text-7xl text-gold/10 select-none">“</span>
          <p className="font-playfair text-lg sm:text-xl text-maroon/90 italic leading-relaxed relative z-10">
            &quot;{list[index].text}&quot;
          </p>
          <div className="flex items-center justify-center space-x-3 pt-6 border-t border-maroon/5 mt-6">
            <div className="w-10 h-10 rounded-full bg-maroon text-gold flex items-center justify-center font-playfair font-bold text-base border border-gold/25">
              {list[index].avatar}
            </div>
            <div className="text-left">
              <h4 className="font-poppins text-xs font-bold text-maroon">{list[index].name}</h4>
              <p className="font-poppins text-[10px] text-gold">{list[index].role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TestimonialsCarousel;
