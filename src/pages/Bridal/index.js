// src/pages/Bridal/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const BridalPage = ({ setCurrentPage }) => {
  const handleBooking = () => {
    setCurrentPage('booking');
    window.scrollTo(0, 0);
  };

  const designs = [
    { title: 'Royal Crimson Peacock Back', desc: 'Heavy peacock Aari motifs, pearls and mirror mesh borders.', image: './assets/designer-blouse.png' },
    { title: 'Lotus Zardosi Elbow Sleeve', desc: 'Detailed lotus creepers, gold spring coils on pure raw silk.', image: './assets/aari-detail.png' },
    { title: 'Pastel Lehenga Reception Set', desc: 'Sheer sleeve puff alignments, heavy stone spray details.', image: './assets/hero-bridal.png' }
  ];

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Bridal Specialization
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            Luxury Wedding Collections
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70">
            For the bride who demands perfection. Discover our flagship bridal blouses, coordinates, and custom heavy-flair lehengas.
          </p>
        </div>

        <div className="bg-maroon text-white rounded-3xl overflow-hidden border border-gold/25 shadow-glow mb-16 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="font-poppins text-[10px] uppercase tracking-widest text-gold font-bold">Bridal Masterpieces</span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight text-white">
                Handcrafted Royal Bridal Blouses
              </h2>
              <div className="w-10 h-[1px] bg-gold"></div>
              <p className="font-poppins text-xs leading-relaxed text-white/80">
                Each bridal blouse back is an individual canvas, hand-sketched by our senior masters and sewn by expert artisans over 40-70 stitching hours. We use high-grade zari threads, pearls, and kundan stones that stay glistening forever.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick=${handleBooking}
                className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-white text-maroon hover:shadow-glow px-8 py-3.5 rounded-full transition-all duration-300"
              >
                Book Bridal Consultation Slot
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 h-[300px] lg:h-auto min-h-[300px] relative">
            <img src="./assets/hero-bridal.png" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <h3 className="font-playfair text-2xl font-bold text-maroon mb-8 text-center">Flagship Bridal backneck Designs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${designs.map((ds, idx) => html`
            <div key=${idx} className="bg-white rounded-2xl overflow-hidden shadow-luxury border border-maroon/5 group">
              <div className="h-64 bg-maroon-dark overflow-hidden">
                <img src=${ds.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-2">
                <h4 className="font-playfair text-lg font-bold text-maroon">${ds.title}</h4>
                <p className="font-poppins text-xs text-maroon/70">${ds.desc}</p>
              </div>
            </div>
          `)}
        </div>

      </div>
    </section>
  `;
};
export default BridalPage;

