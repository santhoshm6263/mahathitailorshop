// src/widgets/Navbar/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const Navbar = ({ currentPage, setCurrentPage, currentUser, setCurrentUser }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Collections', id: 'collections' },
    { label: 'Aari Work', id: 'aari' },
    { label: 'Bridal', id: 'bridal' },
    { label: 'Services', id: 'services' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello Mahathi Tailor Shop! I would like to enquire about designer blouse stitching and Aari embroidery services.");
    window.open(`https://wa.me/919840123456?text=${msg}`, '_blank');
  };

  return html`
    <header className=${`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-maroon shadow-luxury border-b border-gold/15 py-3' 
        : 'bg-maroon/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-transparent md:border-b-gold/10 py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        <div 
          onClick=${() => handleLinkClick('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gold/40 transition-all duration-500 group-hover:scale-105 group-hover:border-gold group-hover:shadow-gold">
            <div className="absolute inset-1 rounded-full border border-dashed border-gold/30"></div>
            <span className="font-playfair text-xl text-gold font-bold">M</span>
          </div>
          <div>
            <span className="font-playfair text-lg sm:text-xl font-semibold tracking-wide text-white block transition-colors duration-300 group-hover:text-gold">
              Mahathi Tailor Shop
            </span>
            <span className="font-poppins text-[9px] uppercase tracking-[0.25em] text-gold/80 block -mt-1">
              Luxury Boutique
            </span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center space-x-8">
          ${navLinks.map(link => html`
            <button
              key=${link.id}
              onClick=${() => handleLinkClick(link.id)}
              className=${`font-poppins text-xs uppercase tracking-widest transition-colors duration-300 ${
                currentPage === link.id
                  ? 'text-gold font-medium border-b border-gold pb-1'
                  : 'text-white/80 hover:text-gold luxury-link'
              }`}
            >
              ${link.label}
            </button>
          `)}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          
          <button 
            onClick=${handleWhatsApp}
            className="flex items-center justify-center p-2 rounded-full border border-gold/20 text-gold hover:text-white hover:bg-gold/10 transition-all duration-300"
            title="Chat on WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.022-.079-.186-.285-.438-.344l-2.079-1.033c-.252-.12-.526-.06-.7.094l-.887.876c-.34.336-.67.288-1.042.06a8.887 8.887 0 0 1-3.08-3.08c-.228-.372-.276-.702.06-1.042l.876-.887c.154-.174.214-.448.094-.7l-1.033-2.079c-.06-.252-.266-.416-.345-.438C8.91 5.993 4.96 5.62 4.417 8.423c-.352 1.81.42 4.316 2.052 5.948s4.138 2.404 5.948 2.052c2.803-.543 2.43-4.493 3.055-5.041z"/>
              <path d="M12.003 21c-1.636 0-3.176-.43-4.52-1.185l-4.568 1.2a1.002 1.002 0 0 1-1.218-1.218l1.2-4.568A8.958 8.958 0 0 1 1.8 11.997C1.8 7.02 5.824 3 10.8 3c4.978 0 9.003 4.02 9.003 8.997 0 4.978-4.025 9.003-9.003 9.003zm0-16.006c-3.86 0-7.003 3.14-7.003 7.003 0 1.344.383 2.628 1.1 3.722a1.001 1.001 0 0 1 .125.748l-.725 2.76 2.76-.725a1 1 0 0 1 .748.125c1.094.717 2.378 1.1 3.722 1.1 3.86 0 7.003-3.14 7.003-7.003 0-3.863-3.143-7.003-7.003-7.003z"/>
            </svg>
          </button>

          ${currentUser 
            ? html`
                <div className="flex items-center space-x-2">
                  <button 
                    onClick=${() => handleLinkClick(currentUser.role === 'admin' ? 'admin' : 'home')}
                    className="font-poppins text-xs uppercase tracking-widest font-semibold text-gold bg-gold/10 border border-gold/30 hover:bg-gold/25 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    ${currentUser.role === 'admin' ? 'Admin Panel' : 'My Account'}
                  </button>
                  <button 
                    onClick=${() => { setCurrentUser(null); handleLinkClick('home'); }}
                    className="text-white/60 hover:text-white text-xs font-poppins underline decoration-gold/40"
                  >
                    Logout
                  </button>
                </div>
              `
            : html`
                <button 
                  onClick=${() => handleLinkClick('login')}
                  className="font-poppins text-xs uppercase tracking-widest text-white hover:text-gold transition-colors duration-300 px-3 py-2"
                >
                  Login
                </button>
              `
          }

          <button 
            onClick=${() => handleLinkClick('booking')}
            className="font-poppins text-xs uppercase tracking-widest font-semibold bg-gold hover:bg-gold-dark text-maroon hover:shadow-glow hover:-translate-y-0.5 px-6 py-2.5 rounded-full border border-gold transition-all duration-300"
          >
            Book Appointment
          </button>
        </div>

        <button 
          onClick=${() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden text-gold hover:text-white p-2 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            ${isMobileMenuOpen 
              ? html`<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />` 
              : html`<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />`
            }
          </svg>
        </button>

      </div>

      ${isMobileMenuOpen && html`
        <div className="fixed inset-0 top-[70px] bg-maroon-dark/95 z-30 xl:hidden animate-fade-in flex flex-col justify-between p-8 border-t border-gold/15">
          <nav className="flex flex-col space-y-6">
            ${navLinks.map(link => html`
              <button
                key=${link.id}
                onClick=${() => handleLinkClick(link.id)}
                className=${`text-left font-playfair text-2xl tracking-wide ${
                  currentPage === link.id ? 'text-gold' : 'text-white/80'
                }`}
              >
                ${link.label}
              </button>
            `)}
          </nav>

          <div className="flex flex-col space-y-4 pt-8 border-t border-gold/10">
            <button 
              onClick=${() => handleLinkClick('booking')}
              className="w-full text-center font-poppins text-sm uppercase tracking-widest font-semibold bg-gold text-maroon py-3 rounded-full transition-colors duration-300"
            >
              Book Appointment
            </button>
            
            <div className="flex items-center justify-between">
              <button 
                onClick=${handleWhatsApp}
                className="flex items-center space-x-2 text-gold font-poppins text-xs uppercase tracking-wider"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.022-.079-.186-.285-.438-.344l-2.079-1.033c-.252-.12-.526-.06-.7.094l-.887.876c-.34.336-.67.288-1.042.06a8.887 8.887 0 0 1-3.08-3.08c-.228-.372-.276-.702.06-1.042l.876-.887c.154-.174.214-.448.094-.7l-1.033-2.079c-.06-.252-.266-.416-.345-.438C8.91 5.993 4.96 5.62 4.417 8.423c-.352 1.81.42 4.316 2.052 5.948s4.138 2.404 5.948 2.052c2.803-.543 2.43-4.493 3.055-5.041z"/>
                  <path d="M12.003 21c-1.636 0-3.176-.43-4.52-1.185l-4.568 1.2a1.002 1.002 0 0 1-1.218-1.218l1.2-4.568A8.958 8.958 0 0 1 1.8 11.997C1.8 7.02 5.824 3 10.8 3c4.978 0 9.003 4.02 9.003 8.997 0 4.978-4.025 9.003-9.003 9.003zm0-16.006c-3.86 0-7.003 3.14-7.003 7.003 0 1.344.383 2.628 1.1 3.722a1.001 1.001 0 0 1 .125.748l-.725 2.76 2.76-.725a1 1 0 0 1 .748.125c1.094.717 2.378 1.1 3.722 1.1 3.86 0 7.003-3.14 7.003-7.003 0-3.863-3.143-7.003-7.003-7.003z"/>
                </svg>
                <span>WhatsApp Consult</span>
              </button>

              ${currentUser 
                ? html`
                    <button 
                      onClick=${() => { setCurrentUser(null); handleLinkClick('home'); }}
                      className="text-white/60 hover:text-white text-xs font-poppins underline"
                    >
                      Logout (${currentUser.name})
                    </button>
                  `
                : html`
                    <button 
                      onClick=${() => handleLinkClick('login')}
                      className="text-white hover:text-gold font-poppins text-xs uppercase tracking-widest font-semibold"
                    >
                      Client Login
                    </button>
                  `
              }
            </div>
          </div>
        </div>
      `}
    </header>
  `;
};
export default Navbar;

