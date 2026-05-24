// src/widgets/CollectionsGrid/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const CollectionsGrid = ({ setCurrentPage, setSelectedCategoryFilter }) => {
  
  const categories = [
    {
      id: 'bridal-blouses',
      title: 'Bridal Blouses',
      description: 'Heavily hand-crafted royal back neck blouses, custom zardosi work, and rich sleeve details.',
      image: './assets/designer-blouse.png',
      count: '150+ Designs'
    },
    {
      id: 'aari-work',
      title: 'Aari Embroidery',
      description: 'Precision needle embroidery work utilizing metallic zari thread, pearls, and premium gemstones.',
      image: './assets/aari-detail.png',
      count: '280+ Patterns'
    },
    {
      id: 'wedding-collection',
      title: 'Wedding Collection',
      description: 'Complete family bridal matching, groom coordinate designs, and royal luxury silk alignments.',
      image: './assets/hero-bridal.png',
      count: '90+ Ensembles'
    },
    {
      id: 'party-wear',
      title: 'Party Wear Blouses',
      description: 'Elegant contemporary ethnic blouses with subtle stone alignments and minimalistic sleeve highlights.',
      image: './assets/designer-blouse.png',
      count: '120+ Styles'
    },
    {
      id: 'kids-fashion',
      title: 'Kids Fashion',
      description: 'Delightful ethnic pattu pavadai sets, designer frocks, and girls traditional couture stitching.',
      image: './assets/hero-bridal.png',
      count: '60+ Dresses'
    },
    {
      id: 'lehengas',
      title: 'Designer Lehengas',
      description: 'Flowing bridal cholis, high-flair ethnic skirts, custom tassels, and intricate dupatta border embroidery.',
      image: './assets/hero-bridal.png',
      count: '45+ Masterpieces'
    }
  ];

  const handleCategoryClick = (catName) => {
    if (setSelectedCategoryFilter) {
      setSelectedCategoryFilter(catName);
    }
    setCurrentPage('collections');
    window.scrollTo(0, 0);
  };

  return html`
    <section className="py-24 bg-cream relative">
      
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10 bg-[radial-gradient(maroon_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block mb-3">
            Bespoke Portfolios
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-maroon mb-6 leading-tight">
            Featured Collections
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mb-6"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70 leading-relaxed">
            Explore our curated masterpieces tailored for the modern Indian woman who appreciates authentic heritage craftsmanship and modern editorial silhouettes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          ${categories.map(cat => html`
            <div 
              key=${cat.id}
              onClick=${() => handleCategoryClick(cat.title)}
              className="group bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-gold border border-maroon/5 hover:border-gold/30 transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-[280px] overflow-hidden bg-maroon-dark">
                <img 
                  src=${cat.image} 
                  alt=${cat.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/60 via-transparent to-transparent"></div>
                
                <span className="absolute top-4 right-4 bg-maroon text-gold font-poppins text-[10px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-gold/30">
                  ${cat.count}
                </span>

                <div className="absolute inset-0 flex items-center justify-center bg-maroon/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-gold bg-maroon/85 border border-gold px-5 py-2.5 rounded-full shadow-glow">
                    View Portfolio
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-medium text-maroon mb-3 group-hover:text-gold transition-colors duration-300">
                    ${cat.title}
                  </h3>
                  <p className="font-poppins text-xs text-maroon/75 leading-relaxed">
                    ${cat.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-gold font-poppins text-[10px] font-bold uppercase tracking-wider pt-6 group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>Explore Designs</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          `)}
        </div>

      </div>
    </section>
  `;
};
export default CollectionsGrid;

