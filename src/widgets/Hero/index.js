// src/widgets/Hero/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const Hero = ({ setCurrentPage }) => {
  const handleCTA = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo(0, 750); // smooth scroll down a bit
  };

  const handleBooking = () => {
    setCurrentPage('booking');
    window.scrollTo(0, 0);
  };

  return html`
    <section className="relative w-full min-h-screen flex items-center justify-center bg-maroon-dark text-white overflow-hidden pt-[80px]">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="./assets/hero-bridal.png" 
          alt="Bridal Luxury Couture" 
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-[zoom_25s_infinite_ease-in-out]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark via-maroon/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark via-transparent to-maroon/20"></div>
      </div>

      <!-- Luxury Animated Gradients & Overlay Sparkles -->
      <div className="absolute top-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-maroon-light/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-10 py-20 flex flex-col items-start justify-center">
        
        <div className="flex items-center space-x-3 mb-6 animate-fade-in opacity-0 [animation-delay:0.2s]">
          <div className="w-8 h-[1px] bg-gold"></div>
          <span className="font-poppins text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            Est. 2012 | Chennai's Premier Bridal Studio
          </span>
        </div>

        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide leading-tight max-w-4xl text-white drop-shadow-lg mb-6 animate-slide-up opacity-0 [animation-delay:0.4s]">
          Luxury Bridal <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold font-normal italic">
            Tailoring & Designer
          </span> <br />
          Aari Zari Embroidery
        </h1>

        <p className="font-poppins text-sm sm:text-base text-white/80 max-w-xl leading-relaxed mb-10 animate-slide-up opacity-0 [animation-delay:0.6s]">
          Crafting bespoke Indian ethnic masterpieces. Each blouse, lehenga, and maggam work outfit is sculpted precisely to your custom measurements and embellished by traditional hand-embroidery masters.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto animate-slide-up opacity-0 [animation-delay:0.8s]">
          <button 
            onClick=${handleBooking}
            className="font-poppins text-xs uppercase tracking-widest font-semibold bg-gold hover:bg-gold-dark text-maroon hover:shadow-glow hover:-translate-y-1 py-4 px-8 rounded-full border border-gold transition-all duration-300 text-center"
          >
            Book Free Consultation
          </button>
          
          <button 
            onClick=${() => handleCTA('customizer')}
            className="font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent hover:bg-white/10 text-white hover:text-gold py-4 px-8 rounded-full border border-white/30 hover:border-gold hover:-translate-y-1 transition-all duration-300 text-center"
          >
            Design Your Blouse Live
          </button>
        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300" onClick=${() => window.scrollTo(0, window.innerHeight - 100)}>
        <span className="font-poppins text-[9px] uppercase tracking-[0.25em] text-gold/80 mb-2">Discover Mahathi</span>
        <div className="w-[18px] h-[30px] rounded-full border border-gold/40 flex items-start justify-center p-1">
          <div className="w-[2px] h-[6px] bg-gold rounded-full animate-[bounce_1.5s_infinite]"></div>
        </div>
      </div>

    </section>
  `;
};

// Add custom zoom animation styles to head via dynamic style insertion or inline
const style = document.createElement('style');
style.textContent = `
  @keyframes zoom {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.12) translate(-1%, -1%); }
  }
`;
document.head.appendChild(style);
export default Hero;

