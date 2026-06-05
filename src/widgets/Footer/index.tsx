'use client';

// src/widgets/Footer/index.tsx
import React from 'react';
import Link from 'next/link';
import { useBoutique } from '../../app/providers';

export const Footer: React.FC = () => {
  const { staff } = useBoutique(); // or config, but we can hardcode from BoutiqueDB config

  const config = {
    phone: '+91 93470 01303',
    whatsapp: '919347001303',
    instagram: 'https://instagram.com/mahathitailors',
    facebook: 'https://facebook.com/mahathitailors',
    address: 'Beside of MMP Primary School, Ponnangur, Adavibhudhugur Road, Mallanur, Kuppam, Chittoor, Andhra Pradesh - 517425',
    email: 'mahathitailorshop@gmail.com',
    hours: 'Welcoming you full week, Monday to Sunday, (9am - 9pm) Sunup to Sundown'
  };

  return (
    <footer className="bg-[#0F0F12] text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#8A3DFF]/15 via-[#0F0F12] to-[#0F0F12]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
        
        {/* Brand */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-gold text-lg">M</div>
            <div>
              <span className="font-playfair text-lg font-bold text-white block">Mahathi Tailors</span>
              <span className="font-poppins text-[8px] uppercase tracking-widest text-gold/80 block">Boutique & Aari work</span>
            </div>
          </Link>
          <p className="font-poppins text-xs text-white/70 leading-relaxed">
            Specializing in bespoke bridal blouses, heavy maggam frames, and ethnic lehengas tailored to fit flawlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3 font-poppins text-xs text-white/70">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li><Link href="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
            <li><Link href="/aari-work" className="hover:text-gold transition-colors">Aari Work</Link></li>
            <li><Link href="/custom-tailoring" className="hover:text-gold transition-colors">Blouse Designer</Link></li>
          </ul>
        </div>

        {/* Contact/Location */}
        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Our Studio</h4>
          <p className="font-poppins text-xs text-white/70 leading-relaxed">
            📍 {config.address}<br /><br />
            📞 {config.phone}<br />
            ✉️ {config.email}<br />
            ⏰ {config.hours}
          </p>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Newsletter</h4>
          <p className="font-poppins text-xs text-white/70">Subscribe to receive festive stitching slots notifications.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex border border-gold/20 rounded-full overflow-hidden bg-white/5 max-w-xs">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-transparent text-xs px-4 py-2 focus:outline-none w-2/3 placeholder-white/40 text-white" 
            />
            <button className="bg-gold text-maroon text-[10px] font-poppins uppercase font-bold px-4 py-2 w-1/3 hover:bg-white transition-all cursor-pointer">
              Join
            </button>
          </form>
        </div>

      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between text-[10px] font-poppins text-white/50">
        <p>© 2026 Mahathi Tailor Shop. All Rights Reserved.</p>
        <p>Luxury Couture Zardosi & Maggam Embroideries.</p>
      </div>
    </footer>
  );
};
export default Footer;
