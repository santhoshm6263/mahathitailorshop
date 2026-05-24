// src/pages/AariWork/index.js
import { html } from '../../shared/lib/html.js';
import { AariShowcase } from '../../widgets/AariShowcase/index.js';
const React = window.React;

export const AariWorkPage = ({ setCurrentPage }) => {
  return html`
    <div className="pt-[50px] animate-fade-in">
      
      <${AariShowcase} setCurrentPage=${setCurrentPage} />

      <section className="py-24 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
              Artisanal Intricacy
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon">
              Aari Zari Embroidery Details
            </h3>
            <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-poppins text-xs text-maroon/80 leading-relaxed">
            
            <div className="bg-cream-soft rounded-2xl p-8 border border-maroon/5 space-y-3">
              <h4 className="font-playfair text-lg font-bold text-maroon">1. Traditional Zardosi Springing</h4>
              <p>Zardosi is the ancient Persian art of sewing gold and silver metallic spring threads into fabrics. Our masters cut tiny coils of spring wires precisely and sew them to build three-dimensional leaves, floral structures, and peacock crests on heavy bridal backs.</p>
            </div>

            <div className="bg-cream-soft rounded-2xl p-8 border border-maroon/5 space-y-3">
              <h4 className="font-playfair text-lg font-bold text-maroon">2. Premium Kundan Stone settings</h4>
              <p>Kundan represents raw glass gemstones and sparkling crystals set carefully into designer blouse borders. We frame each stone using thin metallic borders and glue/stitch them securely so they provide a diamond-like glint under wedding hall spotlights.</p>
            </div>

            <div className="bg-cream-soft rounded-2xl p-8 border border-maroon/5 space-y-3">
              <h4 className="font-playfair text-lg font-bold text-maroon">3. Classic Pearl & Cutbead Meshwork</h4>
              <p>Meshwork (Jali) creates transparent net structures utilizing rows of tiny gold cutbeads, crystal beads, and authentic white seed pearls. This gives an airy, sophisticated sheer look to blouse elbows and back deep necklines.</p>
            </div>

            <div className="bg-cream-soft rounded-2xl p-8 border border-maroon/5 space-y-3">
              <h4 className="font-playfair text-lg font-bold text-maroon">4. Ethnic Maggam Work borders</h4>
              <p>Maggam needlework uses a thin crotchet-like tambour needle to pull threads and beads from underneath a tightly stretched fabric frame. This provides a highly dense, intricate chain stitch filling that lasts a lifetime without tearing.</p>
            </div>

          </div>

          <div className="pt-16 text-center">
            <button 
              onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }}
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon px-8 py-4 rounded-full border border-gold transition-all duration-300 shadow-luxury"
            >
              Configure Your Embroidery Blouse Online
            </button>
          </div>

        </div>
      </section>

    </div>
  `;
};
export default AariWorkPage;

