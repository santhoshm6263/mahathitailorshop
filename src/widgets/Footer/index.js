// src/widgets/Footer/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const Footer = ({ setCurrentPage }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const handleLinkClick = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo(0, 0);
  };

  return html`
    <footer className="bg-maroon-dark text-white pt-16 pb-8 border-t border-gold/15 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-maroon/40 via-maroon-dark to-maroon-dark">
      
      <div className="absolute right-0 bottom-0 w-80 h-80 opacity-5 pointer-events-none transform translate-x-20 translate-y-20 border border-gold rounded-full"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick=${() => handleLinkClick('home')}>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-gold/40">
                <div className="absolute inset-1 rounded-full border border-dashed border-gold/30"></div>
                <span className="font-playfair text-2xl text-gold font-bold">M</span>
              </div>
              <div>
                <span className="font-playfair text-xl font-semibold tracking-wide text-white block">
                  Mahathi Tailor Shop
                </span>
                <span className="font-poppins text-[10px] uppercase tracking-[0.2em] text-gold/80 block -mt-1">
                  Luxury Boutique & Aari Studio
                </span>
              </div>
            </div>
            <p className="font-poppins text-xs text-white/70 leading-relaxed max-w-xs">
              Specializing in bespoke designer bridal blouses, intricate handcrafted Aari embroidery, custom traditional lehengas, and royal wedding fashion ensembles that define elegance.
            </p>
            
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:text-white hover:border-gold hover:shadow-gold transition-all duration-300">
                <span className="text-xs">IG</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:text-white hover:border-gold hover:shadow-gold transition-all duration-300">
                <span className="text-xs">FB</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:text-white hover:border-gold hover:shadow-gold transition-all duration-300">
                <span className="text-xs">PT</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:text-white hover:border-gold hover:shadow-gold transition-all duration-300">
                <span className="text-xs">YT</span>
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-playfair text-base font-semibold tracking-wider text-gold uppercase">Quick Links</h4>
            <ul className="space-y-3 font-poppins text-xs text-white/70">
              <li><button onClick=${() => handleLinkClick('home')} className="hover:text-gold transition-colors duration-300 text-left">Home</button></li>
              <li><button onClick=${() => handleLinkClick('collections')} className="hover:text-gold transition-colors duration-300 text-left">Boutique Collections</button></li>
              <li><button onClick=${() => handleLinkClick('aari')} className="hover:text-gold transition-colors duration-300 text-left">Aari Embroidery</button></li>
              <li><button onClick=${() => handleLinkClick('bridal')} className="hover:text-gold transition-colors duration-300 text-left">Bridal Couture</button></li>
              <li><button onClick=${() => handleLinkClick('customizer')} className="hover:text-gold transition-colors duration-300 text-left">Design Your Blouse</button></li>
              <li><button onClick=${() => handleLinkClick('about')} className="hover:text-gold transition-colors duration-300 text-left">About Studio</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-playfair text-base font-semibold tracking-wider text-gold uppercase">Flagship Studio</h4>
            <div className="font-poppins text-xs text-white/70 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-gold font-bold">📍</span>
                <span className="leading-relaxed">
                  mahathi tailor shop,mpp ponnangur primary school,
                  Adavibhudhugur road,Mallanur,Kuppam,AP (517425)<br />
                  Tamil Nadu, India.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gold font-bold">📞</span>
                <span>+91 98401 23456 | +91 44 2434 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gold font-bold">✉️</span>
                <span>contact@mahathitailors.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gold font-bold">⏰</span>
                <span>Mon - Sun: 10:00 AM - 09:00 PM</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-playfair text-base font-semibold tracking-wider text-gold uppercase">Exclusive Updates</h4>
            <p className="font-poppins text-xs text-white/70">
              Subscribe to receive curated bridal lookbooks, festive stitching slots, and private catalog releases.
            </p>
            <form onSubmit=${handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value=${email}
                  onChange=${(e) => setEmail(e.target.value)}
                  className="w-full bg-maroon border border-gold/20 text-white placeholder-white/40 text-xs px-4 py-3 rounded-full focus:outline-none focus:border-gold transition-colors duration-300"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-gold text-maroon hover:bg-white font-poppins text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-full transition-all duration-300"
                >
                  Join
                </button>
              </div>
            </form>
            
            ${subscribed && html`
              <p className="font-poppins text-[11px] text-gold animate-fade-in">
                Thank you! You are now subscribed to our luxury mailing list.
              </p>
            `}

            <div className="pt-2">
              <h5 className="font-poppins text-[10px] uppercase tracking-widest text-gold/80 mb-3">Instagram Lookbook</h5>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-12 bg-maroon rounded border border-gold/15 overflow-hidden group relative">
                  <img src="./assets/designer-blouse.png" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="h-12 bg-maroon rounded border border-gold/15 overflow-hidden group relative">
                  <img src="./assets/aari-detail.png" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="h-12 bg-maroon rounded border border-gold/15 overflow-hidden group relative">
                  <img src="./assets/hero-bridal.png" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="h-12 bg-maroon rounded border border-gold/15 overflow-hidden group relative">
                  <img src="./assets/designer-blouse.png" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between text-[11px] font-poppins text-white/50 space-y-4 md:space-y-0">
          <p>© 2026 Mahathi Tailor Shop. All Rights Reserved. Specializing in Luxury Aari Zari Embroidery.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Measurement Policy</a>
          </div>
        </div>

      </div>
    </footer>
  `;
};
export default Footer;

