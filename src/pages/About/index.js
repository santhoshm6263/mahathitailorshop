// src/pages/About/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const AboutPage = ({ setCurrentPage }) => {
  return html`
    <section className="py-24 bg-cream/20 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Our Legacy
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            The Story of Mahathi
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-20">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-maroon">
              Crafting Flawless Silhouettes Since 2012
            </h2>
            <div className="w-10 h-[1px] bg-gold"></div>
            <p className="font-poppins text-xs leading-relaxed text-maroon/80">
              Established in Chennai’s premium bridal shopping district T. Nagar, <strong>Mahathi Tailor Shop</strong> has emerged as a premier atelier for luxury Indian ethnic fashion. Over the past 14 years, we have designed and stitched more than 12,000 outfits, specializing in bespoke designer bridal blouses and heavy handcrafted Aari embroidery.
            </p>
            <p className="font-poppins text-xs leading-relaxed text-maroon/80">
              Our studio is founded on two core pillars: <strong>Exquisite Handcrafted Ornamentation</strong> and <strong>Pattern Engineering Precision</strong>. We believe a blouse or lehenga is not merely clothing; it is a sculpted heirloom that reflects cultural majesty. That is why our senior pattern cutting masters use ergonomic body measurements to craft customized frames, ensuring a slip-proof, pristine fit.
            </p>
          </div>

          <div className="lg:col-span-5 h-[350px] relative rounded-3xl overflow-hidden shadow-luxury border border-gold/20">
            <img src="./assets/hero-bridal.png" className="absolute inset-0 w-full h-full object-cover" />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-maroon/5">
          <div className="space-y-3 p-6">
            <span className="text-4xl block">✨</span>
            <h4 className="font-playfair text-lg font-bold text-maroon">Heritage Craft</h4>
            <p className="font-poppins text-xs text-maroon/70 leading-relaxed">Maintaining traditional hand needle embroidery techniques passed down through generations of artisans.</p>
          </div>

          <div className="space-y-3 p-6">
            <span className="text-4xl block">📏</span>
            <h4 className="font-playfair text-lg font-bold text-maroon">Flawless Fit</h4>
            <p className="font-poppins text-xs text-maroon/70 leading-relaxed">Mapping over 18 body variables in your profile for a guarantee fit that looks pristine and feels extremely comfortable.</p>
          </div>

          <div className="space-y-3 p-6">
            <span className="text-4xl block">👑</span>
            <h4 className="font-playfair text-lg font-bold text-maroon">Bridal Specialties</h4>
            <p className="font-poppins text-xs text-maroon/70 leading-relaxed">Providing private wedding consultation lounges, multiple trial checkpoints, and secure timely delivery schedules.</p>
          </div>
        </div>

      </div>
    </section>
  `;
};
export default AboutPage;

