// src/widgets/ServicesGrid/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const ServicesGrid = ({ setCurrentPage, setSelectedServiceFilter }) => {
  
  const services = [
    {
      id: 'blouse-stitching',
      title: 'Designer Blouse Stitching',
      price: '₹1,500 - ₹5,000',
      description: 'Custom lining, perfect-fit bust padding, designer neck shapes (Sweetheart, Queen Anne), and modern sleeve silhouettes.',
      image: './assets/designer-blouse.png',
      features: ['Perfect Fit Guarantee', 'Padded/Non-Padded Options', 'Custom Drapes & Tassels']
    },
    {
      id: 'bridal-tailoring',
      title: 'Bridal Tailoring',
      price: '₹5,000 - ₹25,000',
      description: 'Exclusive wedding lehengas, silk saree blouses, coordinated reception gowns, and matching waist belts (Vaddanam).',
      image: './assets/hero-bridal.png',
      features: ['Personal Fashion Designer', 'Multiple Fit Trials', 'Premium Silk Linings']
    },
    {
      id: 'aari-embroidery',
      title: 'Handcrafted Aari Embroidery',
      price: '₹4,000 - ₹35,000',
      description: 'Bespoke bridal backs, elbow sleeve heavy borders, Maggam work, zardosi coils, pearls, beads, and luxury stone work settings.',
      image: './assets/aari-detail.png',
      features: ['100% Traditional Handwork', 'Custom Motif Sketches', 'Lifetime Thread Guarantee']
    },
    {
      id: 'party-wear',
      title: 'Party Wear & Indo-Western',
      price: '₹2,000 - ₹8,000',
      description: 'Contemporary ethnic crop tops, designer skirts, cocktail dresses, drape blouses, and casual designer kurthis.',
      image: './assets/designer-blouse.png',
      features: ['Modern Indo-Western Cuts', 'Quick Delivery Slots', 'Fabric Guidance Consult']
    },
    {
      id: 'alterations',
      title: 'Premium Alterations',
      price: '₹300 - ₹1,500',
      description: 'Bust adjustments, waistline alterations, sleeve changes, and side zip fittings for your expensive designer outfits.',
      image: './assets/designer-blouse.png',
      features: ['Same-Day Available', 'Clean Invisible Seams', 'All Fabric Types Handled']
    },
    {
      id: 'home-measurement',
      title: 'Home Measurement Service',
      price: '₹500 / Free with Bridal',
      description: 'Can’t visit us? Our senior female measurement master visits your home to record precise body dimensions and collect fabrics.',
      image: './assets/hero-bridal.png',
      features: ['Female Master Tailor', 'Fabric Pickup Included', 'Catalog Consult at Home']
    }
  ];

  const handleBookService = (serviceName) => {
    if (setSelectedServiceFilter) {
      setSelectedServiceFilter(serviceName);
    }
    setCurrentPage('booking');
    window.scrollTo(0, 0);
  };

  return html`
    <section className="py-24 bg-white relative">
      
      <div className="absolute top-1/2 left-0 w-80 h-80 opacity-5 border border-maroon rounded-full pointer-events-none transform -translate-x-1/2"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block mb-3">
            Boutique Excellence
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-maroon mb-6 leading-tight">
            Our Premium Services
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mb-6"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70 leading-relaxed">
            From royal bridal fittings to expert restorations, we combine classic Indian embroidery techniques with modern pattern engineering for flawless silhouettes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          ${services.map(svc => html`
            <div 
              key=${svc.id}
              className="bg-cream/40 hover:bg-cream rounded-2xl border border-maroon/5 hover:border-gold/30 shadow-luxury hover:shadow-gold p-8 flex flex-col justify-between transition-all duration-500 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-maroon/5 group-hover:bg-maroon text-maroon group-hover:text-gold flex items-center justify-center transition-all duration-300">
                    <span className="text-lg font-bold">✂</span>
                  </div>
                  <span className="font-poppins text-xs font-bold text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    ${svc.price}
                  </span>
                </div>

                <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-maroon mb-3 group-hover:text-gold transition-colors duration-300">
                  ${svc.title}
                </h3>
                
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed mb-6">
                  ${svc.description}
                </p>

                <ul className="space-y-2 mb-8 font-poppins text-[11px] text-maroon/80 border-t border-maroon/5 pt-4">
                  ${svc.features.map((feat, idx) => html`
                    <li key=${idx} className="flex items-center space-x-2">
                      <span className="text-gold font-bold">✦</span>
                      <span>${feat}</span>
                    </li>
                  `)}
                </ul>
              </div>

              <button 
                onClick=${() => handleBookService(svc.title)}
                className="w-full font-poppins text-[11px] uppercase tracking-widest font-bold border border-maroon/20 group-hover:border-gold text-maroon group-hover:bg-maroon group-hover:text-gold py-3.5 rounded-full transition-all duration-300 text-center"
              >
                Book Service
              </button>

            </div>
          `)}
        </div>

      </div>
    </section>
  `;
};
export default ServicesGrid;

