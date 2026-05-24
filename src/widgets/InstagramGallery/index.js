// src/widgets/InstagramGallery/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const InstagramGallery = () => {
  const [galleryItems, setGalleryItems] = React.useState([]);
  const [lightboxItem, setLightboxItem] = React.useState(null);

  React.useEffect(() => {
    // Load from BoutiqueDB
    setGalleryItems(BoutiqueDB.getGallery());

    // Subscribe to DB changes
    const unsubscribe = BoutiqueDB.subscribe((state) => {
      setGalleryItems(state.gallery);
    });
    return unsubscribe;
  }, []);

  const handleLike = (e, itemId) => {
    e.stopPropagation();
    BoutiqueDB.likeGalleryItem(itemId);
  };

  const handleShareWhatsApp = (e, item) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Check out this beautiful design from Mahathi Tailor Shop: "${item.title}" - Specializing in Bridal Aari Embroidery!`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = (e, item) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    alert('Design page link copied to clipboard!');
  };

  return html`
    <section className="py-24 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block mb-3">
            Boutique Portfolio
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-maroon mb-6 leading-tight">
            Our Studio Work Gallery
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mb-6"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70 leading-relaxed">
            A visual showcase of finished designer bridal blouses, heavy maggam embroideries, girls pavadais, and handcraft previews captured in our Chennai fashion house.
          </p>
        </div>

        <div className="masonry-grid w-full">
          ${galleryItems.map(item => html`
            <div 
              key=${item.id}
              onClick=${() => setLightboxItem(item)}
              className="masonry-item group relative bg-cream rounded-2xl overflow-hidden border border-maroon/5 shadow-luxury hover:shadow-gold transition-all duration-500 cursor-pointer"
            >
              <img 
                src=${item.image} 
                alt=${item.title} 
                className="w-full h-auto object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold mb-1">
                  ${item.category}
                </span>
                
                <h4 className="font-playfair text-lg sm:text-xl font-medium text-white mb-4 leading-tight">
                  ${item.title}
                </h4>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  
                  <button 
                    onClick=${(e) => handleLike(e, item.id)}
                    className="flex items-center space-x-1 text-gold hover:text-white transition-colors duration-200"
                  >
                    <span className="text-sm">❤️</span>
                    <span className="font-poppins text-[10px] font-semibold">${item.likes} Likes</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick=${(e) => handleShareWhatsApp(e, item)}
                      className="text-[10px] font-poppins font-bold bg-gold/25 hover:bg-gold text-gold hover:text-maroon border border-gold/30 px-3 py-1.5 rounded-full transition-all duration-300"
                      title="Share on WhatsApp"
                    >
                      Share
                    </button>
                  </div>

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
          <button 
            className="absolute top-6 right-6 text-gold hover:text-white font-poppins text-3xl font-bold focus:outline-none"
            onClick=${() => setLightboxItem(null)}
          >
            ✕
          </button>

          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-glow border border-gold/20"
            onClick=${(e) => e.stopPropagation()}
          >
            
            <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden h-[300px] md:h-auto">
              <img 
                src=${lightboxItem.image} 
                alt=${lightboxItem.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-cream-light">
              <div className="space-y-6">
                <div>
                  <span className="font-poppins text-[10px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25 inline-block mb-3">
                    ${lightboxItem.category}
                  </span>
                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon leading-tight">
                    ${lightboxItem.title}
                  </h3>
                </div>

                <div className="w-10 h-[1px] bg-gold"></div>

                <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                  This outfit represents our premier studio craftsmanship, fully customized to the client's body layout. Handcrafted from start to finish by our embroidery masters over a duration of 48 stitching hours.
                </p>

                <div className="bg-maroon/5 rounded-xl p-4 border border-maroon/5 space-y-2">
                  <h5 className="font-poppins text-[10px] uppercase tracking-widest text-maroon font-bold">Stitching Details:</h5>
                  <ul className="space-y-1 font-poppins text-[11px] text-maroon/80">
                    <li>• Fabric: 100% Pure Silk / Velvet</li>
                    <li>• Needle Style: Traditional Aari Needle</li>
                    <li>• Accessories: Zardosi, Beads, Kundan Stones</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-maroon/10 pt-6 mt-8 flex items-center justify-between">
                
                <button 
                  onClick=${(e) => handleLike(e, lightboxItem.id)}
                  className="flex items-center space-x-2 text-maroon hover:text-gold transition-colors duration-200"
                >
                  <span className="text-xl">❤️</span>
                  <span className="font-poppins text-xs font-semibold">${lightboxItem.likes} Likes</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick=${(e) => handleShareWhatsApp(e, lightboxItem)}
                    className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-gold hover:bg-maroon text-maroon hover:text-gold px-4 py-2 rounded-full border border-gold transition-all duration-300"
                  >
                    WhatsApp Share
                  </button>
                  <button 
                    onClick=${(e) => handleCopyLink(e, lightboxItem)}
                    className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-transparent hover:bg-maroon/5 text-maroon px-4 py-2 rounded-full border border-maroon/20 transition-all duration-300"
                  >
                    Copy Link
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      `}

    </section>
  `;
};
export default InstagramGallery;

