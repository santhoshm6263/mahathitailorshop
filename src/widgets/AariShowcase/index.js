// src/widgets/AariShowcase/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const AariShowcase = ({ setCurrentPage }) => {
  const [sliderPos, setSliderPos] = React.useState(50);
  const containerRef = React.useRef(null);
  const isDraggingRef = React.useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  React.useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return html`
    <section className="py-24 bg-maroon text-white relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-maroon-light/20 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
              Handcrafted Artistry
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Aari Zari Embroidery <br />
              <span className="text-gold italic font-normal">Transformation</span>
            </h2>
            <div className="w-12 h-[2px] bg-gold mb-6"></div>
            <p className="font-poppins text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
              Drag the golden slider to reveal the journey from our hand-sketched stenciling outline on raw silk fabric (before) to the final, opulent gold-threaded and stone-embellished Aari masterpiece (after).
            </p>

            <div 
              ref=${containerRef}
              className="slider-container w-full h-[320px] sm:h-[400px] rounded-2xl border border-gold/30 shadow-luxury"
              onMouseMove=${handleMouseMove}
              onTouchMove=${handleTouchMove}
              onClick=${(e) => handleMove(e.clientX)}
            >
              <div className="w-full h-full">
                <img 
                  src="./assets/aari-detail.png" 
                  alt="Aari Finished Gold Embroidery" 
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                <span className="absolute bottom-4 right-4 bg-maroon/80 border border-gold/40 text-gold font-poppins text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-md z-10">
                  After: Finished Embroidery
                </span>
              </div>

              <div 
                className="slider-before"
                style=${{ width: `${sliderPos}%` }}
              >
                <img 
                  src="./assets/aari-detail.png" 
                  alt="Aari Initial Hand Sketch stencil" 
                  className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none"
                  style=${{ 
                    filter: 'grayscale(100%) contrast(150%) brightness(110%) sepia(20%)',
                    width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                    maxWidth: 'none'
                  }}
                />
                <span className="absolute bottom-4 left-4 bg-black/60 border border-white/20 text-white font-poppins text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-md z-10">
                  Before: Hand Sketch Outline
                </span>
              </div>

              <div 
                className="slider-handle"
                style=${{ left: `${sliderPos}%` }}
                onMouseDown=${handleMouseDown}
                onTouchStart=${handleMouseDown}
              >
                <div className="slider-button select-none">
                  ↔
                </div>
              </div>
            </div>
            
            <p className="text-center font-poppins text-[10px] text-gold/80 italic mt-3">
              ↔ Click and drag the golden center divider back and forth
            </p>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <h3 className="font-playfair text-2xl sm:text-3xl font-medium text-gold mb-6">
              Our Couture Embroidery Specialties
            </h3>
            
            <div className="space-y-6">
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center flex-shrink-0 text-gold">
                  ✔
                </div>
                <div>
                  <h4 className="font-playfair text-lg font-semibold text-white mb-1">
                    Authentic Maggam Work
                  </h4>
                  <p className="font-poppins text-xs text-white/70 leading-relaxed">
                    Utilizing traditional wooden frames (Maggam) to stretch sarees or blouse panels tightly, allowing artisans to weave heavy beads, spring coils, and intricate metallic structures.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center flex-shrink-0 text-gold">
                  ✔
                </div>
                <div>
                  <h4 className="font-playfair text-lg font-semibold text-white mb-1">
                    Premium Kundan & Stone Settings
                  </h4>
                  <p className="font-poppins text-xs text-white/70 leading-relaxed">
                    Hand-soldering and setting high-grade sparkling Kundan glass gemstones and crystals directly into floral and leaf creepers for a majestic wedding glow.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center flex-shrink-0 text-gold">
                  ✔
                </div>
                <div>
                  <h4 className="font-playfair text-lg font-semibold text-white mb-1">
                    Exquisite Zardosi Spring Embroidery
                  </h4>
                  <p className="font-poppins text-xs text-white/70 leading-relaxed">
                    Intricate sewing of metallic coiled spring threads (Zardosi) in beautiful floral borders, peacock crests, and geometric jali lattices.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-6 flex flex-wrap items-center gap-4">
              <button 
                onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }}
                className="font-poppins text-xs uppercase tracking-widest font-semibold bg-gold hover:bg-white text-maroon hover:-translate-y-0.5 px-6 py-3 rounded-full transition-all duration-300"
              >
                Custom Design Studio
              </button>
              
              <button 
                onClick=${() => { setCurrentPage('aari'); window.scrollTo(0,0); }}
                className="font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent hover:bg-white/10 text-white hover:text-gold border border-gold/50 px-6 py-3 rounded-full transition-all duration-300"
              >
                View Full Aari Gallery
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
};
export default AariShowcase;

