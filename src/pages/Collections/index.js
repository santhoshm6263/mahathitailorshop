// src/pages/Collections/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const CollectionsPage = ({ selectedCategoryFilter, setSelectedCategoryFilter }) => {
  const [gallery, setGallery] = React.useState([]);
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [lightboxItem, setLightboxItem] = React.useState(null);

  React.useEffect(() => {
    setGallery(BoutiqueDB.getGallery());
    if (selectedCategoryFilter) {
      setActiveFilter(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const categories = ['All', 'Bridal Blouses', 'Aari Work', 'Wedding Collection', 'Kids Fashion', 'Party Wear'];

  const filteredItems = activeFilter === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeFilter);

  const handleLike = (e, id) => {
    e.stopPropagation();
    BoutiqueDB.likeGalleryItem(id);
    setGallery(BoutiqueDB.getGallery());
  };

  const handleFilterClick = (catName) => {
    setActiveFilter(catName);
    if (setSelectedCategoryFilter) {
      setSelectedCategoryFilter(null); // Clear parent filter state once local selection takes over
    }
  };

  return html`
    <section className="py-24 bg-cream/20 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Luxurious Catalogs
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            Our Stitching Portfolio
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70">
            Browse our hand-embellished wedding blouses, heavy maggam frames, and girls ethnic outfits tailored meticulously to order.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 border-b border-maroon/5 pb-8">
          ${categories.map(cat => html`
            <button
              key=${cat}
              onClick=${() => handleFilterClick(cat)}
              className=${`font-poppins text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 ${
                activeFilter === cat 
                  ? 'bg-maroon text-gold font-bold shadow-luxury border border-maroon' 
                  : 'bg-white border border-maroon/5 text-maroon/80 hover:border-gold hover:text-gold'
              }`}
            >
              ${cat}
            </button>
          `)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${filteredItems.length === 0 ? html`
            <div className="col-span-3 text-center py-20 font-poppins text-xs text-maroon/40 italic">
              No portfolio designs published under this category yet.
            </div>
          ` : filteredItems.map(item => html`
            <div 
              key=${item.id}
              onClick=${() => setLightboxItem(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-gold border border-maroon/5 hover:border-gold/30 transition-all duration-500 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-[300px] overflow-hidden bg-maroon-dark">
                <img 
                  src=${item.image} 
                  alt=${item.title} 
                  className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                />
                
                <span className="absolute top-4 right-4 bg-maroon/90 text-gold border border-gold/25 font-poppins text-[10px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full z-10">
                  ${item.category}
                </span>

                <div className="absolute inset-0 bg-maroon/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-gold bg-maroon/85 border border-gold px-5 py-2.5 rounded-full shadow-glow">
                    View Details
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-semibold text-maroon mb-2 group-hover:text-gold transition-colors duration-300">
                    ${item.title}
                  </h3>
                  <p className="font-poppins text-xs text-maroon/60 leading-relaxed">
                    Sculpted to individual measurement variables. Embellished with fine copper-alloy zari, pearls, and glass mirror borders.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-maroon/5 pt-4 mt-6">
                  <button 
                    onClick=${(e) => handleLike(e, item.id)}
                    className="flex items-center space-x-1.5 text-maroon hover:text-gold transition-colors duration-200"
                  >
                    <span className="text-sm">❤️</span>
                    <span className="font-poppins text-[10px] font-bold">${item.likes} Likes</span>
                  </button>
                  <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold">
                    Custom Stitching On Quote
                  </span>
                </div>
              </div>
            </div>
          `)}
        </div>

      </div>

      ${lightboxItem && html`
        <div 
          className="fixed inset-0 bg-maroon-dark/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick=${() => setLightboxItem(null)}
        >
          <button className="absolute top-6 right-6 text-gold hover:text-white font-poppins text-3xl font-bold" onClick=${() => setLightboxItem(null)}>✕</button>

          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-glow border border-gold/20" onClick=${(e) => e.stopPropagation()}>
            <div className="md:w-3/5 bg-black h-[300px] md:h-auto"><img src=${lightboxItem.image} className="w-full h-full object-cover" /></div>
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-cream-light">
              <div className="space-y-6">
                <div>
                  <span className="font-poppins text-[10px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25 inline-block mb-3">${lightboxItem.category}</span>
                  <h3 className="font-playfair text-2xl font-bold text-maroon leading-tight">${lightboxItem.title}</h3>
                </div>
                <div className="w-10 h-[1px] bg-gold"></div>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed">This outfit represents our premier studio craftsmanship, fully customized to the client's body layout. Handcrafted from start to finish by our embroidery masters over a duration of 48 stitching hours.</p>
              </div>
              <div className="border-t border-maroon/10 pt-6 mt-8 flex items-center justify-between">
                <button onClick=${(e) => handleLike(e, lightboxItem.id)} className="flex items-center space-x-2 text-maroon hover:text-gold transition-colors duration-200">
                  <span className="text-xl">❤️</span>
                  <span className="font-poppins text-xs font-semibold">${lightboxItem.likes} Likes</span>
                </button>
                <a href=${`https://wa.me/919840123456?text=${encodeURIComponent(`Hello! I like this design: "${lightboxItem.title}" (${lightboxItem.category}). Can you give me a stitching quote?`)}`} target="_blank" className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-gold text-maroon px-5 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all duration-300">WhatsApp Query</a>
              </div>
            </div>
          </div>
        </div>
      `}
    </section>
  `;
};
export default CollectionsPage;

