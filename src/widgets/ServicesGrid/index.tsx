'use client';

// src/widgets/ServicesGrid/index.tsx
import React from 'react';
import Link from 'next/link';

export const ServicesGrid: React.FC = () => {
  const services = [
    { title: 'Designer Blouse Stitching', price: '₹1,500 - ₹5,000', desc: 'Custom padding, sweetheart necks, designer cuts, and lining alignments.', image: '/assets/designer-blouse.png' },
    { title: 'Handcrafted Aari Embroidery', price: '₹4,000 - ₹35,000', desc: 'Bridal backneck, elbow sleeve borders, kundan gemstones, and zardosi work.', image: '/assets/aari-detail.png' },
    { title: 'Bridal Couture Tailoring', price: '₹5,000 - ₹25,000', desc: 'Exquisite reception lehengas, wedding coordinates, and coordinate matching.', image: '/assets/hero-bridal.png' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Our Studio</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Our Premium Services</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, idx) => (
            <div key={idx} className="bg-cream/40 rounded-2xl p-8 border border-maroon/5 hover:border-gold/30 hover:bg-cream/70 shadow-luxury flex flex-col justify-between transition-all group duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl">✂</span>
                  <span className="font-poppins text-[10px] font-bold text-gold uppercase bg-gold/10 px-3 py-1 rounded-full">{s.price}</span>
                </div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon mb-3 group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed mb-6">{s.desc}</p>
              </div>
              <Link 
                href={`/booking?service=${encodeURIComponent(s.title)}`}
                className="w-full text-center font-poppins text-[10px] uppercase font-bold tracking-widest border border-maroon/20 py-3 rounded-full hover:bg-maroon hover:text-gold transition-all cursor-pointer"
              >
                Book Service
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesGrid;
