'use client';

// src/widgets/WhyChooseUs/index.tsx
import React from 'react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    { title: 'Traditional Handcraft', desc: '100% of our embroidery structures are intricately handcrafted by master artisans using needles on tambour frames.', icon: '✨' },
    { title: 'Ergonomic Sizing Math', desc: 'Our cutting masters map over 18 body variable indicators, securing a slip-proof, perfect fitting profile.', icon: '📐' },
    { title: 'Bridal Couture Specialists', desc: 'Over a decade of legacy designing coordinates, matching lehengas, and heavy backneck structures.', icon: '👑' }
  ];

  return (
    <section className="py-24 bg-maroon-soft">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Boutique Credibility</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Why Choose Mahathi</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-maroon/5 shadow-luxury hover:-translate-y-1 transition-all group duration-300">
              <span className="text-3xl block mb-6">{p.icon}</span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon mb-3 group-hover:text-gold transition-colors duration-300">{p.title}</h3>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyChooseUs;
