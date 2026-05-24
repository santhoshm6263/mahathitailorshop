// src/app/App.js
import { html } from '../shared/lib/html.js';
import { BoutiqueDB } from '../entities/BoutiqueDB.js';

const React = window.React;

/* ==========================================================================
   1. CORE RUNTIME ERROR BOUNDARY
   ========================================================================== */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Mahathi Tailor App Rendering Crash Captured:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return html`
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gold shadow-luxury space-y-6">
            <span className="text-4xl block">👑</span>
            <h2 className="font-playfair text-2xl font-bold text-maroon">Couture Rendering Variance</h2>
            <div className="w-10 h-[1px] bg-gold mx-auto"></div>
            <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
              We captured a minor component exception. Your measurements and orders remain perfectly safe in our database.
            </p>
            <div className="bg-maroon-soft text-left p-4 rounded-xl font-mono text-[9px] text-maroon overflow-x-auto max-h-[150px] border border-maroon/5 whitespace-pre">
              ${this.state.error ? this.state.error.stack || this.state.error.message : 'Unknown exception'}
            </div>
            <button 
              onClick=${() => { window.location.reload(); }}
              className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-3 rounded-full border border-gold transition-all duration-300"
            >
              Reset Atelier
            </button>
          </div>
        </div>
      `;
    }
    return this.props.children;
  }
}

/* ==========================================================================
   2. REUSABLE ATELIER WIDGETS & SECTIONS
   ========================================================================== */

// --- 2.1 STICKY GLASSMORPHIC NAVBAR ---
const Navbar = ({ currentPage, setCurrentPage, currentUser, setCurrentUser, onCartOpen }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const config = BoutiqueDB.getConfig();

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'aari', label: 'Aari Work' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'services', label: 'Services' },
    { id: 'shop', label: 'Shop' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLink = (id) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isDarkBg = isScrolled || currentPage !== 'home';
  return html`
    <header className=${`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
      isDarkBg ? 'bg-maroon shadow-luxury py-3 border-b border-gold/15' : 'bg-maroon/90 md:bg-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        <div onClick=${() => handleLink('home')} className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center font-playfair text-xl text-gold font-bold transition-all group-hover:scale-105 group-hover:shadow-gold">M</div>
          <div>
            <span className="font-playfair text-lg font-semibold text-white block group-hover:text-gold transition-colors">Mahathi Tailor Shop</span>
            <span className="font-poppins text-[9px] uppercase tracking-[0.25em] text-gold/80 block -mt-1">Luxury Boutique</span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center space-x-8">
          ${links.map(l => html`
            <button
              key=${l.id}
              onClick=${() => handleLink(l.id)}
              className=${`font-poppins text-xs uppercase tracking-widest transition-colors ${
                currentPage === l.id ? 'text-gold font-medium border-b border-gold pb-1' : 'text-white/80 hover:text-gold luxury-link'
              }`}
            >
              ${l.label}
            </button>
          `)}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          <a href=${"https://wa.me/" + config.whatsapp} target="_blank" className="p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-all">💬</a>
          <button onClick=${onCartOpen} className="p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-all relative">
            🛒
            ${BoutiqueDB.getCart().length > 0 && html`
              <span className="absolute -top-1 -right-1 bg-gold text-maroon font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-maroon-dark">
                ${BoutiqueDB.getCart().reduce((sum, item) => sum + item.qty, 0)}
              </span>
            `}
          </button>
          <button onClick=${() => handleLink('wishlist')} className="p-2 rounded-full border border-gold/20 text-gold hover:bg-gold/10 transition-all relative">
            ❤️
            ${BoutiqueDB.getWishlist().length > 0 && html`
              <span className="absolute -top-1 -right-1 bg-gold text-maroon font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-maroon-dark">
                ${BoutiqueDB.getWishlist().length}
              </span>
            `}
          </button>
          ${currentUser 
            ? html`
                <div className="flex items-center space-x-3">
                  <button onClick=${() => handleLink(currentUser.role === 'admin' ? 'admin' : 'profile')} className="font-poppins text-xs uppercase tracking-widest font-semibold text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full hover:bg-gold/25 transition-all">
                    ${currentUser.role === 'admin' ? 'Admin Panel' : 'My Account'}
                  </button>
                  <button onClick=${() => { setCurrentUser(null); handleLink('home'); }} className="font-poppins text-xs uppercase tracking-widest text-gold hover:text-white font-semibold transition-colors underline">Logout</button>
                </div>
              `
            : html`<button onClick=${() => handleLink('login')} className="font-poppins text-xs uppercase tracking-widest px-3 text-white hover:text-gold transition-colors font-semibold">Login</button>`
          }
          <button onClick=${() => handleLink('booking')} className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-6 py-2.5 rounded-full border border-gold hover:bg-white hover:text-maroon transition-all shadow-luxury">
            Book Appointment
          </button>
        </div>

        <button onClick=${() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden text-gold p-2">
          <span className="text-2xl">${isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>

      </div>

      ${isMobileMenuOpen && html`
        <div className="fixed inset-0 top-[70px] bg-maroon-dark/95 z-30 xl:hidden flex flex-col justify-between p-8 border-t border-gold/15 animate-fade-in">
          <nav className="flex flex-col space-y-6">
            ${links.map(l => html`
              <button key=${l.id} onClick=${() => handleLink(l.id)} className=${`text-left font-playfair text-2xl ${currentPage === l.id ? 'text-gold' : 'text-white/80'}`}>
                ${l.label}
              </button>
            `)}
          </nav>
          <div className="pt-8 border-t border-gold/10 flex flex-col space-y-4">
            <button onClick=${() => { onCartOpen(); setIsMobileMenuOpen(false); }} className="w-full text-center font-poppins text-xs uppercase tracking-widest font-semibold border border-gold/30 text-gold py-3.5 rounded-full mb-2">
              🛒 View Atelier Bag (${BoutiqueDB.getCart().reduce((sum, item) => sum + item.qty, 0)})
            </button>
            <button onClick=${() => handleLink('booking')} className="w-full text-center font-poppins text-xs uppercase tracking-widest font-semibold bg-gold text-maroon py-3.5 rounded-full">
              Book Appointment
            </button>
          </div>
        </div>
      `}
    </header>
  `;
};

// --- 2.2 EDITORIAL PARALLAX HERO BANNER ---
const Hero = ({ setCurrentPage }) => {
  return html`
    <section className="relative w-full min-h-screen flex items-center justify-center bg-maroon-dark text-white overflow-hidden pt-[80px]">
      <div className="absolute inset-0 z-0">
        <img src="./assets/hero-bridal.png" className="w-full h-full object-cover opacity-40 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark via-maroon/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark via-transparent to-maroon/30"></div>
      </div>
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 relative z-10 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-[1px] bg-gold"></div>
          <span className="font-poppins text-xs tracking-[0.3em] text-gold uppercase">Est. 2012 | Chennai's Premier Bridal Studio</span>
        </div>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide leading-tight max-w-4xl text-white">
          Luxury Bridal <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold font-normal italic">Tailoring & Designer</span> <br />
          Aari Zari Embroidery
        </h1>
        <p className="font-poppins text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed mb-8">
          Crafting bespoke Indian ethnic masterpieces. Each bridal blouse and designer dress is shaped precisely to your measurement profile by second-generation embroidery masters.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button onClick=${() => { setCurrentPage('booking'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-8 py-4 rounded-full hover:bg-white hover:text-maroon transition-all shadow-luxury">
            Book Consultation
          </button>
          <button onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase tracking-widest font-bold bg-transparent text-white border border-white/40 px-8 py-4 rounded-full hover:bg-white/10 hover:text-gold transition-all">
            Design Your Blouse Live
          </button>
        </div>
      </div>
    </section>
  `;
};

// --- 2.3 TRUST PILLARS & STAT COUNTERS ---
const WhyChooseUs = () => {
  const pillars = [
    { title: 'Traditional Handcraft', desc: '100% of our embroidery structures are intricately handcrafted by master artisans using needles on tambour frames.', icon: '✨' },
    { title: 'Ergonomic Sizing math', desc: 'Our cutting masters map over 18 body variable indicators, securing a slip-proof, perfect fitting profile.', icon: '📐' },
    { title: 'Bridal Couture specialists', desc: 'Over a decade of legacy designing coordinates, matching lehengas, and heavy backneck structures.', icon: '👑' }
  ];
  return html`
    <section className="py-24 bg-maroon-soft">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Boutique Credibility</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Why Choose Mahathi</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${pillars.map((p, idx) => html`
            <div key=${idx} className="bg-white rounded-2xl p-8 border border-maroon/5 shadow-luxury hover:-translate-y-1 transition-all group">
              <span className="text-3xl block mb-6">${p.icon}</span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon mb-3 group-hover:text-gold transition-colors">${p.title}</h3>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">${p.desc}</p>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
};

// --- 2.4 FEATURED COLLECTIONS GRID ---
const CollectionsGrid = ({ setCurrentPage, setSelectedCategoryFilter }) => {
  const items = [
    { title: 'Bridal Blouses', desc: 'Heavily hand-crafted royal backnecks and zardosi sleeves.', image: './assets/designer-blouse.png', count: '150+ Designs' },
    { title: 'Aari Work', desc: 'Precision needlework with metallic zari threads, pearls, and kundan.', image: './assets/aari-detail.png', count: '280+ Patterns' },
    { title: 'Wedding Collection', desc: 'Complete wedding sarees coordination and matching silhouettes.', image: './assets/hero-bridal.png', count: '95+ Masterpieces' }
  ];
  const handleCategory = (title) => {
    setSelectedCategoryFilter(title);
    setCurrentPage('collections');
    window.scrollTo(0, 0);
  };
  return html`
    <section className="py-24 bg-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Atelier Lookbooks</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Featured Collections</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${items.map((it, idx) => html`
            <div key=${idx} onClick=${() => handleCategory(it.title)} className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-gold border border-maroon/5 hover:border-gold/30 transition-all cursor-pointer group flex flex-col justify-between">
              <div className="h-64 overflow-hidden relative bg-maroon-dark">
                <img src=${it.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-4 right-4 bg-maroon text-gold font-poppins text-[9px] font-bold px-3 py-1.5 rounded-full border border-gold/20">${it.count}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon group-hover:text-gold transition-colors">${it.title}</h3>
                  <p className="font-poppins text-xs text-maroon/70 leading-relaxed mt-2">${it.desc}</p>
                </div>
                <span className="text-gold font-poppins text-[10px] uppercase font-bold tracking-wide">Explore Designs →</span>
              </div>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
};

// --- 2.5 INTERACTIVE BEFORE/AFTER SLIDER SHOWCASE ---
const AariShowcase = ({ setCurrentPage }) => {
  const [pos, setPos] = React.useState(50);
  const containerRef = React.useRef(null);
  const dragging = React.useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setPos(percentage);
  };

  const handleTouch = (e) => {
    if (dragging.current && e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
  };
  const handleMouse = (e) => {
    if (dragging.current) handleMove(e.clientX);
  };

  React.useEffect(() => {
    const stopDrag = () => { dragging.current = false; };
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, []);

  return html`
    <section className="py-24 bg-maroon text-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Handcraft Lifecycle</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">Embroidery Transformation</h2>
          <div className="w-12 h-[2px] bg-gold"></div>
          <p className="font-poppins text-xs text-white/80 leading-relaxed mb-6">
            Drag the golden divider to see our stenciling pencil sketch drawn on raw silk (before) transform into the glistening, gold-threaded finished Aari work (after).
          </p>

          <div 
            ref=${containerRef}
            className="slider-container w-full h-[320px] rounded-2xl border border-gold/30 shadow-luxury"
            onMouseMove=${handleMouse}
            onTouchMove=${handleTouch}
            onClick=${(e) => handleMove(e.clientX)}
          >
            <div className="w-full h-full">
              <img src="./assets/aari-detail.png" className="w-full h-full object-cover select-none pointer-events-none" />
              <span className="absolute bottom-4 right-4 bg-maroon/80 border border-gold/20 text-gold font-poppins text-[9px] uppercase px-3 py-1 rounded">Finished Embroidery</span>
            </div>

            <div className="slider-before" style=${{ width: `${pos}%` }}>
              <img 
                src="./assets/aari-detail.png" 
                className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none" 
                style=${{ 
                  filter: 'grayscale(100%) contrast(150%) brightness(105%) sepia(20%)',
                  width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                  maxWidth: 'none'
                }}
              />
              <span className="absolute bottom-4 left-4 bg-black/60 border border-white/20 text-white font-poppins text-[9px] uppercase px-3 py-1 rounded">Tracing Sketch Outline</span>
            </div>

            <div 
              className="slider-handle" 
              style=${{ left: `${pos}%` }}
              onMouseDown=${() => { dragging.current = true; }}
              onTouchStart=${() => { dragging.current = true; }}
            >
              <div className="slider-button">↔</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-8">
          <h3 className="font-playfair text-2xl sm:text-3xl font-semibold text-gold">Handwork Specialties</h3>
          <div className="space-y-6 font-poppins text-xs text-white/80 leading-relaxed">
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Traditional Maggam Work:</strong> Woven tightly on custom wooden frames, accommodating heavy metallic spring wires and crystals.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Stone & Kundan Settings:</strong> Glass Kundan gemstones meticulously set inside floral lattices to add royal wedding sparkles.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gold text-lg">✦</span>
              <p><strong>Gold Zari Borders:</strong> Dual-border needlework mapping sleeve cuffs and backneck silhouettes with high-grade copper gold threads.</p>
            </div>
          </div>
          <div className="pt-4 flex items-center space-x-4">
            <button onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-6 py-3 rounded-full hover:bg-white transition-all">Start Designing Live</button>
          </div>
        </div>

      </div>
    </section>
  `;
};

// --- 2.6 SERVICES SHOWCASE ---
const ServicesGrid = ({ setCurrentPage, setSelectedServiceFilter }) => {
  const services = [
    { title: 'Designer Blouse Stitching', price: '₹1,500 - ₹5,000', desc: 'Custom padding, sweetheart necks, designer cuts, and lining alignments.', image: './assets/designer-blouse.png' },
    { title: 'Handcrafted Aari Embroidery', price: '₹4,000 - ₹35,000', desc: 'Bridal backneck, elbow sleeve borders, kundan gemstones, and zardosi work.', image: './assets/aari-detail.png' },
    { title: 'Bridal Couture Tailoring', price: '₹5,000 - ₹25,000', desc: 'Exquisite reception lehengas, wedding Coordinates, and coordinate matching.', image: './assets/hero-bridal.png' }
  ];
  const handleBooking = (title) => {
    setSelectedServiceFilter(title);
    setCurrentPage('booking');
    window.scrollTo(0,0);
  };
  return html`
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Flagship Atelier</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Our Premium Services</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${services.map((s, idx) => html`
            <div key=${idx} className="bg-cream/40 rounded-2xl p-8 border border-maroon/5 hover:border-gold/30 hover:bg-cream/70 shadow-luxury flex flex-col justify-between transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl">✂</span>
                  <span className="font-poppins text-[10px] font-bold text-gold uppercase bg-gold/10 px-3 py-1 rounded-full">${s.price}</span>
                </div>
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon mb-3 group-hover:text-gold transition-colors">${s.title}</h3>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed mb-6">${s.desc}</p>
              </div>
              <button onClick=${() => handleBooking(s.title)} className="w-full font-poppins text-[10px] uppercase font-bold tracking-widest border border-maroon/20 py-3 rounded-full hover:bg-maroon hover:text-gold transition-all">Book Service</button>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
};

// --- 2.7 PINTEREST MASONRY PHOTO GALLERY ---
const InstagramGallery = () => {
  const [gallery, setGallery] = React.useState(BoutiqueDB.getGallery());
  const [lightbox, setLightbox] = React.useState(null);

  const handleLike = (e, id) => {
    e.stopPropagation();
    BoutiqueDB.likeGalleryItem(id);
    setGallery(BoutiqueDB.getGallery());
  };

  return html`
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Visual lookbook</span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon">Our Studio Gallery</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        
        <div className="masonry-grid w-full">
          ${gallery.map(item => html`
            <div 
              key=${item.id}
              onClick=${() => setLightbox(item)}
              className="masonry-item group relative bg-cream rounded-2xl overflow-hidden border border-maroon/5 shadow-luxury hover:shadow-gold transition-all duration-300 cursor-pointer"
            >
              <img src=${item.image} className="w-full h-auto object-cover select-none pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold mb-1">${item.category}</span>
                <h4 className="font-playfair text-lg text-white mb-4">${item.title}</h4>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <button onClick=${(e) => handleLike(e, item.id)} className="flex items-center space-x-1.5 text-gold hover:text-white transition-colors">
                    <span>❤️</span>
                    <span className="font-poppins text-[10px] font-semibold">${item.likes} Likes</span>
                  </button>
                  <span className="font-poppins text-[9px] text-white/50">View Details →</span>
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>

      ${lightbox && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 animate-fade-in" onClick=${() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-gold text-3xl font-bold font-poppins" onClick=${() => setLightbox(null)}>✕</button>
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row border border-gold/20" onClick=${(e) => e.stopPropagation()}>
            <div className="md:w-3/5 bg-black h-[300px] md:h-auto"><img src=${lightbox.image} className="w-full h-full object-cover" /></div>
            <div className="md:w-2/5 p-8 flex flex-col justify-between bg-cream-light text-maroon">
              <div className="space-y-6">
                <div>
                  <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25 inline-block mb-3">${lightbox.category}</span>
                  <h3 className="font-playfair text-2xl font-bold leading-tight">${lightbox.title}</h3>
                </div>
                <div className="w-10 h-[1px] bg-gold"></div>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed">Each bridal backneck is hand-sketched on sheer silk patterns, sewn meticulously with metallic zari needles.</p>
              </div>
              <div className="border-t border-maroon/10 pt-6 mt-8 flex items-center justify-between">
                <button onClick=${(e) => handleLike(e, lightbox.id)} className="flex items-center space-x-2 hover:text-gold transition-colors">
                  <span className="text-xl">❤️</span>
                  <span className="font-poppins text-xs font-semibold">${lightbox.likes} Likes</span>
                </button>
                <a href=${`https://wa.me/919840123456?text=${encodeURIComponent(`Hello! I am enquiring about stitching design: "${lightbox.title}"`)}`} target="_blank" className="font-poppins text-[10px] uppercase font-bold tracking-widest bg-gold text-maroon px-5 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all">WhatsApp Consult</a>
              </div>
            </div>
          </div>
        </div>
      `}
    </section>
  `;
};

// --- 2.8 BRIDAL CLIENT TESTIMONIALS SLIDER ---
const TestimonialsCarousel = () => {
  const [index, setIndex] = React.useState(0);
  const list = [
    { name: 'Priya Dharshini K.', role: 'Bride (Dec 2025)', text: 'Mahathi tailored my entire wedding sarees collection. The heavy peacock Aari embroidery was masterfully finished! Ramu master did multiple fittings to ensure a slip-free shoulder fit.', avatar: 'P' },
    { name: 'Sushmitha Sen', role: 'Fashion Specialist', text: 'Their zardosi thread finish is extremely neat. Invisible copper-alloy zippers and mulmul piping highlights are perfect indicators of bespoke luxury tailoring.', avatar: 'S' }
  ];
  React.useEffect(() => {
    const timer = setInterval(() => { setIndex((prev) => (prev + 1) % list.length); }, 6000);
    return () => clearInterval(timer);
  }, []);
  return html`
    <section className="py-24 bg-maroon-soft/30">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block mb-3">Bridal Stories</span>
          <h2 className="font-playfair text-3xl font-bold text-maroon">Client Experiences</h2>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-maroon/5 shadow-luxury text-center space-y-6 relative">
          <span className="absolute top-6 left-8 font-playfair text-7xl text-gold/10 select-none">“</span>
          <p className="font-playfair text-lg sm:text-xl text-maroon/90 italic leading-relaxed relative z-10">"${list[index].text}"</p>
          <div className="flex items-center justify-center space-x-3 pt-6 border-t border-maroon/5 mt-6">
            <div className="w-10 h-10 rounded-full bg-maroon text-gold flex items-center justify-center font-playfair font-bold text-base border border-gold/25">${list[index].avatar}</div>
            <div className="text-left">
              <h4 className="font-poppins text-xs font-bold text-maroon">${list[index].name}</h4>
              <p className="font-poppins text-[10px] text-gold">${list[index].role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

// --- 2.9 LUXURY FOUR-COLUMN SITEMAP FOOTER ---
const Footer = ({ setCurrentPage }) => {
  const handleLink = (id) => {
    setCurrentPage(id);
    window.scrollTo(0,0);
  };
  const config = BoutiqueDB.getConfig();
  return html`
    <footer className="bg-maroon-dark text-white pt-16 pb-8 border-t border-gold/15 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-maroon/40 via-maroon-dark to-maroon-dark">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick=${() => handleLink('home')}>
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-gold text-lg">M</div>
            <div>
              <span className="font-playfair text-lg font-bold text-white block">Mahathi Tailors</span>
              <span className="font-poppins text-[8px] uppercase tracking-widest text-gold/80 block">Boutique & Aari work</span>
            </div>
          </div>
          <p className="font-poppins text-xs text-white/70 leading-relaxed">Specializing in bespoke bridal blouses, heavy maggam frames, and ethnic lehengas tailored to fit flawlessly.</p>
        </div>

        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3 font-poppins text-xs text-white/70">
            <li><button onClick=${() => handleLink('home')} className="hover:text-gold transition-colors text-left">Home</button></li>
            <li><button onClick=${() => handleLink('collections')} className="hover:text-gold transition-colors text-left">Collections</button></li>
            <li><button onClick=${() => handleLink('aari')} className="hover:text-gold transition-colors text-left">Aari work</button></li>
            <li><button onClick=${() => handleLink('customizer')} className="hover:text-gold transition-colors text-left">Blouse Designer</button></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Flagship Atelier</h4>
          <p className="font-poppins text-xs text-white/70 leading-relaxed">
            📍 ${config.address}<br /><br />
            📞 ${config.phone}<br />
            ✉️ ${config.email}<br />
            ⏰ ${config.hours}
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="font-playfair text-sm font-bold text-gold uppercase tracking-wider">Newsletter</h4>
          <p className="font-poppins text-xs text-white/70">Subscribe to receive festive stitching slots notifications.</p>
          <div className="flex border border-gold/20 rounded-full overflow-hidden bg-maroon max-w-xs">
            <input type="email" placeholder="Your email" className="bg-transparent text-xs px-4 py-2 focus:outline-none w-2/3 placeholder-white/40" />
            <button className="bg-gold text-maroon text-[10px] font-poppins uppercase font-bold px-4 py-2 w-1/3 hover:bg-white transition-all">Join</button>
          </div>
        </div>

      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between text-[10px] font-poppins text-white/50">
        <p>© 2026 Mahathi Tailor Shop. All Rights Reserved.</p>
        <p>Luxury Couture Zardosi & Maggam Embroideries.</p>
      </div>
    </footer>
  `;
};

/* ==========================================================================
   3. CUSTOM CHANNELS & INTERACTIVE FEATURES
   ========================================================================== */

// --- 3.1 STEP-BY-STEP BLOUSE CUSTOMIZER FEATURE ---
const BlouseCustomizer = ({ setCurrentPage }) => {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [fabric, setFabric] = React.useState('Raw Silk');
  const [notes, setNotes] = React.useState('');
  
  const [neck, setNeck] = React.useState('Round Neck');
  const [sleeve, setSleeve] = React.useState('Short Sleeve');
  const [embroidery, setEmbroidery] = React.useState('Minimalist Border');
  const [upload, setUpload] = React.useState(null);
  const [modal, setModal] = React.useState(null);

  const priceMap = {
    neck: { 'Round Neck': 0, 'Royal Pot Neck': 450, 'Boat Neck': 350, 'Sweetheart Neck': 500 },
    sleeve: { 'Short Sleeve': 0, 'Elbow Sleeve': 250, 'Full Sleeve': 400, 'Puff Sleeve': 300 },
    embroidery: { 'Minimalist Border': 2500, 'Medium Stone Work': 4500, 'Heavy Aari & Zardosi': 7500, 'Royal Maggam Work': 9500 }
  };

  const total = 1200 + (priceMap.neck[neck] || 0) + (priceMap.sleeve[sleeve] || 0) + (priceMap.embroidery[embroidery] || 0);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUpload(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please fill out Name and Phone to submit.');
      return;
    }
    
    // Auto profile customer
    const customers = BoutiqueDB.getCustomers();
    let cust = customers.find(c => c.phone === phone);
    if (!cust) {
      cust = BoutiqueDB.addCustomer({ name, phone, email: `${name.toLowerCase().replace(/\s+/g,'')}@example.com` });
    }

    const order = BoutiqueDB.addOrder({
      customerId: cust.id,
      customerName: cust.name,
      phone: cust.phone,
      stitchingItem: 'Custom Designer Blouse',
      neckStyle: neck,
      sleeveStyle: sleeve,
      embroideryStyle: embroidery,
      fabricNotes: `Fabric: ${fabric}. Notes: ${notes}`,
      cost: total,
      advancePaid: 0,
      dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
      inspirationImage: upload || './assets/designer-blouse.png',
      staffAssigned: 'Pending Assignment'
    });

    setModal(order);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello Mahathi! I designed a custom blouse online.\n*Order ID:* ${modal.id}\n*Neck:* ${neck}\n*Sleeve:* ${sleeve}\n*Embroidery:* ${embroidery}\n*Est. Price:* ₹${total}\n\nPlease confirm slot.`);
    window.open(`https://wa.me/919840123456?text=${msg}`, '_blank');
    setModal(null);
    setCurrentPage('home');
  };

  return html`
    <div className="w-full bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      
      <div className="lg:col-span-8 p-8 sm:p-10 space-y-8 max-h-[75vh] overflow-y-auto">
        <div className="flex items-center space-x-3 text-gold text-xs font-semibold uppercase tracking-wider">
          <span>Step ${step} of 4</span>
          <span>•</span>
          <span>${step === 1 ? 'Neck Selection' : step === 2 ? 'Sleeve Style' : step === 3 ? 'Embroidery Detail' : 'Contact & Submit'}</span>
        </div>

        ${step === 1 && html`
          <div className="space-y-6 animate-fade-in">
            <h4 className="font-playfair text-2xl font-bold text-maroon">Select Neck Silhouette</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${['Round Neck', 'Royal Pot Neck', 'Boat Neck', 'Sweetheart Neck'].map(n => html`
                <div key=${n} onClick=${() => setNeck(n)} className=${`p-5 rounded-2xl border-2 transition-all cursor-pointer ${neck === n ? 'border-gold bg-gold/5 shadow-gold' : 'border-maroon/5 bg-cream/10'}`}>
                  <h5 className="font-playfair text-base font-bold text-maroon">${n}</h5>
                  <span className="font-poppins text-xs font-bold text-gold mt-4 block">+ ₹${priceMap.neck[n]}</span>
                </div>
              `)}
            </div>
          </div>
        `}

        ${step === 2 && html`
          <div className="space-y-6 animate-fade-in">
            <h4 className="font-playfair text-2xl font-bold text-maroon">Select Sleeve Shape</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${['Short Sleeve', 'Elbow Sleeve', 'Puff Sleeve', 'Full Sleeve'].map(s => html`
                <div key=${s} onClick=${() => setSleeve(s)} className=${`p-5 rounded-2xl border-2 transition-all cursor-pointer ${sleeve === s ? 'border-gold bg-gold/5 shadow-gold' : 'border-maroon/5 bg-cream/10'}`}>
                  <h5 className="font-playfair text-base font-bold text-maroon">${s}</h5>
                  <span className="font-poppins text-xs font-bold text-gold mt-4 block">+ ₹${priceMap.sleeve[s]}</span>
                </div>
              `)}
            </div>
          </div>
        `}

        ${step === 3 && html`
          <div className="space-y-6 animate-fade-in">
            <h4 className="font-playfair text-2xl font-bold text-maroon">Select Embroidery Intensity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${['Minimalist Border', 'Medium Stone Work', 'Heavy Aari & Zardosi', 'Royal Maggam Work'].map(e => html`
                <div key=${e} onClick=${() => setEmbroidery(e)} className=${`p-5 rounded-2xl border-2 transition-all cursor-pointer ${embroidery === e ? 'border-gold bg-gold/5 shadow-gold' : 'border-maroon/5 bg-cream/10'}`}>
                  <h5 className="font-playfair text-base font-bold text-maroon">${e}</h5>
                  <span className="font-poppins text-xs font-bold text-gold mt-4 block">₹${priceMap.embroidery[e]}</span>
                </div>
              `)}
            </div>
          </div>
        `}

        ${step === 4 && html`
          <form onSubmit=${handleSubmit} className="space-y-6 animate-fade-in">
            <h4 className="font-playfair text-2xl font-bold text-maroon">Contact & Upload</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-xs">
              <div>
                <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Your Name *</label>
                <input type="text" placeholder="Enter name" value=${name} onChange=${(e) => setName(e.target.value)} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Contact Mobile *</label>
                <input type="tel" placeholder="Enter mobile" value=${phone} onChange=${(e) => setPhone(e.target.value)} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block font-poppins text-maroon font-bold uppercase tracking-wide text-[9px]">Upload Fabric Sketch (Optional)</label>
              <div className="border-2 border-dashed border-maroon/20 hover:border-gold rounded-2xl p-6 text-center bg-cream/10 relative transition-colors cursor-pointer">
                ${upload 
                  ? html`<div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-gold/30"><img src=${upload} className="w-full h-full object-cover" /></div>`
                  : html`<span className="font-poppins text-xs text-maroon/60">📷 Drag or click to upload fabric preview</span>`
                }
                <input type="file" accept="image/*" onChange=${handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="block font-poppins text-maroon font-bold uppercase tracking-wide text-[9px]">Special Stitching requests</label>
              <textarea placeholder="Notes on depths, linings, piping, sizes..." value=${notes} onChange=${(e) => setNotes(e.target.value)} className="w-full bg-cream/40 border border-maroon/10 rounded-xl p-4 focus:outline-none text-xs h-20"></textarea>
            </div>
          </form>
        `}

        <div className="flex items-center justify-between border-t border-maroon/5 pt-6 mt-8">
          <button onClick=${() => setStep(prev => Math.max(1, prev-1))} disabled=${step===1} className="font-poppins text-xs uppercase font-bold text-maroon/40 disabled:opacity-20 px-4 py-2">Back</button>
          ${step < 4 
            ? html`<button onClick=${() => setStep(prev => Math.min(4, prev+1))} className="font-poppins text-xs uppercase font-bold bg-maroon text-gold px-8 py-3 rounded-full hover:bg-gold hover:text-maroon transition-all">Next</button>`
            : html`<button onClick=${handleSubmit} className="font-poppins text-xs uppercase font-bold bg-gold text-maroon px-8 py-3 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all">Submit Design</button>`
          }
        </div>

      </div>

      <div className="lg:col-span-4 bg-maroon-soft p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-maroon/5 text-maroon">
        <div className="space-y-6">
          <h4 className="font-playfair text-xl font-bold pb-4 border-b border-maroon/10">Summary</h4>
          <div className="space-y-4 font-poppins text-xs">
            <div className="flex justify-between"><span>Neck:</span><strong className="text-right">${neck}</strong></div>
            <div className="flex justify-between"><span>Sleeve:</span><strong className="text-right">${sleeve}</strong></div>
            <div className="flex justify-between"><span>Embroidery:</span><strong className="text-right">${embroidery}</strong></div>
            <div className="flex justify-between"><span>Fabric:</span><strong className="text-right">${fabric}</strong></div>
          </div>
          <div className="border border-gold/15 bg-white rounded-2xl p-4 shadow-luxury flex items-center justify-center h-36 relative overflow-hidden">
            ${upload 
              ? html`<img src=${upload} className="w-full h-full object-cover rounded-xl" />` 
              : html`<span className="font-playfair font-bold text-sm text-center">${neck}<br/><span className="text-[10px] text-gold uppercase block mt-1">${sleeve}</span></span>`
            }
          </div>
        </div>
        
        <div className="border-t border-maroon/10 pt-6 mt-8">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-poppins text-xs text-maroon/60">Estimated Cost:</span>
            <span className="font-playfair text-3xl font-bold">₹${total.toLocaleString()}</span>
          </div>
          <p className="font-poppins text-[10px] text-maroon/40 leading-relaxed">*Base lining included. Prices finalized at fitting consultation.</p>
        </div>

      </div>

      ${modal && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-gold/20 shadow-glow space-y-6 text-maroon">
            <span className="text-4xl block">✔</span>
            <div className="space-y-1">
              <h3 className="font-playfair text-2xl font-bold">Design Submitted!</h3>
              <p className="font-poppins text-xs text-maroon/60">Archived with Order ID: <strong>${modal.id}</strong></p>
            </div>
            <div className="border-t border-b border-maroon/5 py-4 text-left font-poppins text-xs space-y-2 text-maroon/80">
              <div className="flex justify-between"><span>Customer Name:</span><strong>${name}</strong></div>
              <div className="flex justify-between"><span>Selections:</span><strong>${neck} + ${sleeve}</strong></div>
              <div className="flex justify-between"><span>Estimated Total:</span><strong>₹${total.toLocaleString()}</strong></div>
            </div>
            <div className="space-y-3 pt-2">
              <button onClick=${handleWhatsApp} className="w-full font-poppins text-xs uppercase font-bold bg-gold text-maroon py-3 rounded-full hover:bg-gold-dark border border-gold transition-all">Send Design on WhatsApp</button>
              <button onClick=${() => { setModal(null); setCurrentPage('home'); }} className="w-full font-poppins text-xs uppercase font-semibold text-maroon/70 py-3">Return Home</button>
            </div>
          </div>
        </div>
      `}

    </div>
  `;
};

// --- 3.2 APPOINTMENT BOOKING PLANNER MODULE ---
const AppointmentBooking = ({ preSelectedService }) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [date, setDate] = React.useState('');
  const [slot, setSlot] = React.useState('');
  const [type, setType] = React.useState('Bridal Consultation');
  const [notes, setNotes] = React.useState('');
  const [modal, setModal] = React.useState(null);

  const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

  React.useEffect(() => {
    if (preSelectedService) {
      setType(preSelectedService.includes('Bridal') || preSelectedService.includes('Aari') ? 'Bridal Consultation' : 'Boutique Visit');
      setNotes(`Interested in flagship service: ${preSelectedService}`);
    }
  }, [preSelectedService]);

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !date || !slot) {
      alert('Please fill out all required fields.');
      return;
    }
    const apt = BoutiqueDB.addAppointment({ name, phone, email, date, time: slot, type, notes });
    setModal(apt);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello Mahathi! I scheduled a consultation slot.\n*ID:* ${modal.id}\n*Name:* ${name}\n*Category:* ${type}\n*Time:* ${date} at ${slot}\n\nPlease confirm.`);
    window.open(`https://wa.me/919840123456?text=${msg}`, '_blank');
    setModal(null);
    setName(''); setPhone(''); setEmail(''); setDate(''); setSlot(''); setNotes('');
  };

  return html`
    <div className="w-full bg-cream-soft rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <form onSubmit=${handleSubmit} className="lg:col-span-8 space-y-6 text-maroon">
        <div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold">Book Consultation Slot</h3>
          <p className="font-poppins text-xs text-maroon/60 mt-1">Select date and timing for measurement profiling.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-xs">
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Your Name *</label>
            <input type="text" placeholder="Enter name" value=${name} onChange=${(e) => setName(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" required />
          </div>
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Contact Mobile *</label>
            <input type="tel" placeholder="Enter mobile" value=${phone} onChange=${(e) => setPhone(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-xs">
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Email Address</label>
            <input type="email" placeholder="Enter email address" value=${email} onChange=${(e) => setEmail(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Consult Category *</label>
            <select value=${type} onChange=${(e) => setType(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold font-semibold text-maroon">
              <option value="Bridal Consultation">Bridal Consultation (Free - 45 Mins)</option>
              <option value="Boutique Visit">Regular Measurement Visit (30 Mins)</option>
              <option value="Home Measurement">Home Measurement Visit (Charges: ₹500)</option>
              <option value="Trial Appointment">Finished Outfit Fitting Trial (20 Mins)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-xs">
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Select Date *</label>
            <input type="date" min=${getMinDate()} value=${date} onChange=${(e) => setDate(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold font-semibold text-maroon" required />
          </div>
          <div>
            <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Consultation Notes (Optional)</label>
            <input type="text" placeholder="e.g. Saree details, neck embroidery preferences..." value=${notes} onChange=${(e) => setNotes(e.target.value)} className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold text-xs" />
          </div>
        </div>

        <div>
          <label className="block font-poppins text-maroon font-bold uppercase tracking-wide text-[9px] mb-4">Select Timing *</label>
          ${!date 
            ? html`<p className="font-poppins text-xs text-maroon/40 italic">Please pick a date first to check active slots.</p>`
            : html`
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  ${times.map(t => {
                    const active = BoutiqueDB.getAppointments().some(a => a.date === date && a.time === t && a.status !== 'Cancelled');
                    return html`
                      <div
                        key=${t}
                        onClick=${() => !active && setSlot(t)}
                        className=${`p-3.5 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer transition-all duration-300 ${
                          active 
                            ? 'bg-maroon/5 border-maroon/5 text-maroon/20 line-through cursor-not-allowed'
                            : slot === t
                              ? 'bg-maroon border-maroon text-gold shadow-luxury'
                              : 'bg-white border-maroon/10 text-maroon hover:border-gold hover:bg-cream'
                        }`}
                      >
                        ${t}
                        ${active && html`<span className="block text-[8px] tracking-wide font-normal uppercase text-maroon/40 mt-1">Booked</span>`}
                      </div>
                    `;
                  })}
                </div>
              `
          }
        </div>

        <button type="submit" className="font-poppins text-xs uppercase tracking-widest font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon border border-maroon hover:border-gold py-4 px-8 rounded-full transition-all shadow-luxury w-full sm:w-auto">
          Confirm Scheduled Slot
        </button>
      </form>

      <div className="lg:col-span-4 bg-maroon text-white p-6 sm:p-8 rounded-2xl border border-gold/25 shadow-luxury flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(gold_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="space-y-6 relative z-10">
          <h4 className="font-playfair text-xl font-bold text-gold pb-4 border-b border-white/10">Flagship Atelier</h4>
          
          <div className="space-y-4 font-poppins text-xs text-white/80">
            <div className="flex items-start space-x-2"><span>📍</span><span>No. 14, Pondy Bazaar, T. Nagar, Chennai - 600017</span></div>
            <div className="flex items-start space-x-2"><span>📞</span><span>+91 98401 23456</span></div>
            <div className="flex items-start space-x-2"><span>⏰</span><span>Mon - Sun: 10:00 AM - 09:00 PM</span></div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <h5 className="font-playfair text-xs uppercase tracking-wider text-gold font-bold">Important Notes:</h5>
            <ul className="space-y-2 font-poppins text-[10px] text-white/80 leading-relaxed list-disc pl-4">
              <li>Home visits require a travel charge of ₹500, waived upon order confirmation.</li>
              <li>Please bring your matching coordinates or base fabric for exact color grading.</li>
              <li>Trials are 20 mins max to ensure seamless fitting queues.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6 relative z-10 font-poppins text-[10px] text-white/70 space-y-2">
          <span className="font-playfair text-sm text-gold block font-semibold">Bridal Consult Desk</span>
          <p>Coordinate fabric details directly for personalized designs proposal.</p>
          <a href="tel:+919840123456" className="text-gold uppercase font-bold tracking-wider hover:underline block pt-2">Call Designer Desk →</a>
        </div>
      </div>

      ${modal && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-gold/20 shadow-glow space-y-6 text-maroon">
            <span className="text-4xl block">📅</span>
            <div className="space-y-1">
              <h3 className="font-playfair text-2xl font-bold">Appointment Booked!</h3>
              <p className="font-poppins text-xs text-maroon/60">Scheduled with Booking ID: <strong>${modal.id}</strong></p>
            </div>
            <div className="border-t border-b border-maroon/5 py-4 text-left font-poppins text-xs space-y-2 text-maroon/80">
              <div className="flex justify-between"><span>Customer Name:</span><strong>${name}</strong></div>
              <div className="flex justify-between"><span>Category Slot:</span><strong>${type}</strong></div>
              <div className="flex justify-between"><span>Schedule:</span><strong>${date} at ${slot}</strong></div>
            </div>
            <div className="space-y-3 pt-2">
              <button onClick=${handleWhatsApp} className="w-full font-poppins text-xs uppercase font-bold bg-gold text-maroon py-3.5 rounded-full border border-gold hover:bg-gold-dark transition-all">Send confirmation on WhatsApp</button>
              <button onClick=${() => setModal(null)} className="w-full font-poppins text-xs uppercase font-semibold text-maroon/70 py-3">Return</button>
            </div>
          </div>
        </div>
      `}

    </div>
  `;
};

/* ==========================================================================
   4. DETAILED COMPOSITE PAGES
   ========================================================================== */

// --- 4.1 CUSTOMER HOME PAGE ---
const HomePage = ({ setCurrentPage, setSelectedCategoryFilter, setSelectedServiceFilter }) => {
  return html`
    <div className="w-full animate-fade-in">
      <${Hero} setCurrentPage=${setCurrentPage} />
      <${WhyChooseUs} />
      <${CollectionsGrid} setCurrentPage=${setCurrentPage} setSelectedCategoryFilter=${setSelectedCategoryFilter} />
      <${AariShowcase} setCurrentPage=${setCurrentPage} />
      <${ServicesGrid} setCurrentPage=${setCurrentPage} setSelectedServiceFilter=${setSelectedServiceFilter} />
      
      <section className="py-24 bg-maroon text-white relative overflow-hidden text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-maroon-light via-maroon to-maroon-dark border-y border-gold/15">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(gold_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 space-y-6">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Bespoke Bridal Couture</span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold">Design Your Wedding Outfit Online</h2>
          <p className="font-poppins text-xs text-white/70 max-w-xl mx-auto leading-relaxed">Coordinate bridal lehengas, silk blouses and maggam necklines directly with flagship designers.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-8 py-4 rounded-full border border-gold hover:bg-white transition-all shadow-luxury">Start Customizing Live</button>
            <a href="https://wa.me/919840123456" target="_blank" className="font-poppins text-xs uppercase tracking-widest font-bold bg-transparent text-white border border-white/30 px-8 py-4 rounded-full hover:bg-white/10 hover:text-gold transition-all">WhatsApp Designer Desk</a>
          </div>
        </div>
      </section>

      <${InstagramGallery} />
      <${TestimonialsCarousel} />
    </div>
  `;
};

// --- 4.2 COMPREHENSIVE FILTER PORTFOLIO COLLECTIONS PAGE ---
const CollectionsPage = ({ selectedCategoryFilter, setSelectedCategoryFilter }) => {
  const [gallery, setGallery] = React.useState(BoutiqueDB.getGallery());
  const [filter, setFilter] = React.useState('All');
  const [lightbox, setLightbox] = React.useState(null);

  React.useEffect(() => {
    if (selectedCategoryFilter) setFilter(selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  const categories = ['All', 'Bridal Blouses', 'Aari Work', 'Wedding Collection', 'Kids Fashion', 'Party Wear'];
  const filtered = filter === 'All' ? gallery : gallery.filter(g => g.category === filter);

  const handleLike = (e, id) => {
    e.stopPropagation();
    BoutiqueDB.likeGalleryItem(id);
    setGallery(BoutiqueDB.getGallery());
  };

  const handleTab = (catName) => {
    setFilter(catName);
    if (setSelectedCategoryFilter) setSelectedCategoryFilter(null);
  };

  return html`
    <section className="py-24 bg-cream/20 min-h-screen pt-[120px] animate-fade-in text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">luxurious catalogs</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Our Boutique Portfolio</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-maroon/5 pb-8">
          ${categories.map(c => html`
            <button key=${c} onClick=${() => handleTab(c)} className=${`font-poppins text-[10px] sm:text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all border ${filter === c ? 'bg-maroon border-maroon text-gold font-bold shadow-luxury' : 'bg-white border-maroon/10 text-maroon hover:border-gold hover:text-gold'}`}>
              ${c}
            </button>
          `)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${filtered.map(item => html`
            <div key=${item.id} onClick=${() => setLightbox(item)} className="bg-white rounded-2xl overflow-hidden shadow-luxury border border-maroon/5 hover:border-gold/30 transition-all cursor-pointer group flex flex-col justify-between">
              <div className="h-64 overflow-hidden bg-maroon-dark relative">
                <img src=${item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-4 right-4 bg-maroon/90 text-gold border border-gold/20 font-poppins text-[9px] font-bold px-3 py-1.5 rounded-full">${item.category}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-playfair text-lg font-bold leading-tight group-hover:text-gold transition-colors">${item.title}</h3>
                  <p className="font-poppins text-xs text-maroon/60 leading-relaxed mt-2">Precision stitched to custom sizing values. Premium silk piping, tassels, and kundan beadings.</p>
                </div>
                <div className="flex items-center justify-between border-t border-maroon/5 pt-4 mt-2">
                  <button onClick=${(e) => handleLike(e, item.id)} className="flex items-center space-x-1.5 text-maroon hover:text-gold transition-colors">
                    <span>❤️</span>
                    <span className="font-poppins text-[10px] font-bold">${item.likes}</span>
                  </button>
                  <span className="font-poppins text-[8px] uppercase tracking-wide text-gold font-bold">Stitching On Quote</span>
                </div>
              </div>
            </div>
          `)}
        </div>

      </div>

      ${lightbox && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 animate-fade-in" onClick=${() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-gold text-3xl font-bold font-poppins" onClick=${() => setLightbox(null)}>✕</button>
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row border border-gold/20" onClick=${(e) => e.stopPropagation()}>
            <div className="md:w-3/5 bg-black h-[300px] md:h-auto"><img src=${lightbox.image} className="w-full h-full object-cover" /></div>
            <div className="md:w-2/5 p-8 flex flex-col justify-between bg-cream-light text-maroon">
              <div className="space-y-6">
                <div>
                  <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25 inline-block mb-3">${lightbox.category}</span>
                  <h3 className="font-playfair text-2xl font-bold leading-tight">${lightbox.title}</h3>
                </div>
                <div className="w-10 h-[1px] bg-gold"></div>
                <p className="font-poppins text-xs text-maroon/70 leading-relaxed">Each backneck is hand-sketched on silk patterns, sewn meticulously with metallic zari needles.</p>
              </div>
              <div className="border-t border-maroon/10 pt-6 mt-8 flex items-center justify-between">
                <button onClick=${(e) => handleLike(e, lightbox.id)} className="flex items-center space-x-2 hover:text-gold transition-colors">
                  <span className="text-xl">❤️</span>
                  <span className="font-poppins text-xs font-semibold">${lightbox.likes} Likes</span>
                </button>
                <a href=${`https://wa.me/919840123456?text=${encodeURIComponent(`Hello! I like design: "${lightbox.title}"`)}`} target="_blank" className="font-poppins text-[10px] uppercase font-bold tracking-widest bg-gold text-maroon px-5 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all">WhatsApp Query</a>
              </div>
            </div>
          </div>
        </div>
      `}
    </section>
  `;
};

// --- 4.3 COUTURE SERVICES PAGE ---
const ServicesPage = ({ setCurrentPage, setSelectedServiceFilter }) => {
  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <${ServicesGrid} setCurrentPage=${setCurrentPage} setSelectedServiceFilter=${setSelectedServiceFilter} />
      </div>
    </section>
  `;
};

// --- 4.4 INTERACTIVE SCHEDULER BOOKING CONTAINER ---
const BookingPage = ({ selectedServiceFilter }) => {
  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 text-maroon">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Boutique Schedule</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Consultation Booking</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-luxury border border-maroon/5">
          <${AppointmentBooking} preSelectedService=${selectedServiceFilter} />
        </div>
      </div>
    </section>
  `;
};

// --- 4.5 DESIGN STUDIO CONTAINER PAGE ---
const CustomizerPage = ({ setCurrentPage }) => {
  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 text-maroon">
          <span className="font-poppins text-xs font-semibold tracking-[0.2em] text-gold uppercase block">Couture studio</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Interactive Designer</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>
        <div className="max-w-5xl mx-auto">
          <${BlouseCustomizer} setCurrentPage=${setCurrentPage} />
        </div>
      </div>
    </section>
  `;
};

// --- 4.6 ABOUT LEGACY STORY PAGE ---
const AboutPage = () => {
  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Our Legacy</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">The Story of Mahathi</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold">Bespoke Fitting Since 2012</h2>
            <p className="font-poppins text-xs leading-relaxed text-maroon/80">Located in Pondy Bazaar (T. Nagar, Chennai), Mahathi Tailor Shop has catered to premium bridal clients for 14 years. We designed more than 12,000 outfits, specializing in custom Aari zari embroideries and heavy zardosi borders.</p>
            <p className="font-poppins text-xs leading-relaxed text-maroon/80">Our pattern masters record precise slope angles, arm rotations, and chest variables to create archival measurement profiles, ensuring the shoulder straps or sleeves sit comfortably and securely throughout your wedding rituals.</p>
          </div>
          <div className="lg:col-span-5 h-[320px] rounded-3xl overflow-hidden border border-gold/20 shadow-luxury"><img src="./assets/hero-bridal.png" className="w-full h-full object-cover" /></div>
        </div>
      </div>
    </section>
  `;
};

// --- 4.6.4 PRODUCT DETAIL QUICK VIEW MODAL ---
const ProductDetailModal = ({ product, onClose, onCartOpen, setCurrentPage }) => {
  if (!product) return null;
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState(product.sizes ? product.sizes[0] : 'Free Size');
  const [selectedColor, setSelectedColor] = React.useState(product.colors ? product.colors[0] : 'Default');
  const [wishlist, setWishlist] = React.useState(BoutiqueDB.getWishlist());
  
  // High-End Interactive Zoom Style State
  const [zoomStyle, setZoomStyle] = React.useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  const handleToggleWishlist = () => {
    BoutiqueDB.toggleWishlist(product.id);
    setWishlist(BoutiqueDB.getWishlist());
  };

  const handleAddToCart = () => {
    BoutiqueDB.addToCart({
      ...product,
      selectedSize,
      selectedColor
    }, 1);
    onClose();
    if (onCartOpen) onCartOpen();
  };

  const isWishlisted = wishlist.includes(product.id);

  const getArrivalDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + (product.deliveryDays || 5));
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const related = BoutiqueDB.getProducts()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 2);

  return html`
    <div className="fixed inset-0 bg-maroon-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in text-maroon font-poppins text-[10px]">
      <div className="absolute inset-0" onClick=${onClose}></div>
      <div className="bg-white rounded-3xl border border-gold/15 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-luxury animate-scale-in relative z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        <button onClick=${onClose} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-maroon/10 text-maroon hover:bg-cream flex items-center justify-center font-bold font-poppins shadow-md bg-white">✕</button>

        <div className="p-6 md:p-8 bg-cream/20 flex flex-col space-y-4 border-b md:border-b-0 md:border-r border-maroon/5 justify-center">
          <div 
            className="h-[280px] md:h-[360px] rounded-2xl overflow-hidden relative bg-white border border-maroon/5 shadow-inner cursor-zoom-in"
            onMouseMove=${handleMouseMove}
            onMouseLeave=${handleMouseLeave}
          >
            <img 
              src=${product.images && product.images[activeImgIdx] ? product.images[activeImgIdx] : product.image} 
              className="w-full h-full object-cover transition-transform duration-200" 
              style=${zoomStyle}
            />
            <span className="absolute top-4 left-4 bg-maroon text-gold text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold/20">
              ${product.category.replace(/-/g, ' ')}
            </span>
          </div>
          
          ${product.images && product.images.length > 1 && html`
            <div className="flex gap-2.5 overflow-x-auto py-1">
              ${product.images.map((img, idx) => html`
                <button 
                  key=${idx}
                  onClick=${() => setActiveImgIdx(idx)}
                  className=${`w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-white transition-all ${activeImgIdx === idx ? 'border-gold shadow-md' : 'border-maroon/10 hover:border-gold'}`}
                >
                  <img src=${img} className="w-full h-full object-cover" />
                </button>
              `)}
            </div>
          `}
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[8px] text-maroon/50 font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <span>⭐</span> <span className="text-maroon font-semibold">${product.rating}</span>
                <span className="normal-case">(${product.reviews ? product.reviews.length : 0} reviews)</span>
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">${product.stock} left</span>
            </div>

            <h2 className="font-playfair text-xl font-bold text-maroon leading-tight">${product.name}</h2>
            
            <div className="flex items-baseline space-x-3">
              <span className="font-playfair text-xl font-bold text-gold">₹${product.price.toLocaleString()}</span>
              ${product.discount > 0 && html`
                <span className="text-maroon/30 line-through text-[10px]">₹${(product.price * 100 / (100 - product.discount)).toFixed(0)}</span>
                <span className="bg-rose-50 border border-rose-100 text-rose-700 font-bold text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider">${product.discount}% OFF</span>
              `}
            </div>

            <p className="text-[9px] text-maroon/60 leading-relaxed">${product.description}</p>
            
            <div className="border-t border-maroon/5 pt-3 space-y-3">
              ${product.sizes && product.sizes.length > 0 && html`
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-maroon/50">Select Fit Size:</span>
                  <div className="flex flex-wrap gap-1.5">
                    ${product.sizes.map(s => html`
                      <button 
                        key=${s}
                        onClick=${() => setSelectedSize(s)}
                        className=${`min-w-8 h-7 px-1.5 rounded-full border text-[8px] font-semibold uppercase tracking-wider transition-all ${selectedSize === s ? 'bg-maroon text-gold border-gold shadow-md' : 'border-maroon/10 hover:border-gold text-maroon bg-white'}`}
                      >
                        ${s}
                      </button>
                    `)}
                  </div>
                </div>
              `}

              ${product.colors && product.colors.length > 0 && html`
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-maroon/50">Select Couture Shade:</span>
                  <div className="flex flex-wrap gap-1.5">
                    ${product.colors.map(c => html`
                      <button 
                        key=${c}
                        onClick=${() => setSelectedColor(c)}
                        className=${`px-2.5 py-1 rounded-full border text-[8px] font-semibold transition-all ${selectedColor === c ? 'bg-maroon text-gold border-gold' : 'border-maroon/10 hover:border-gold text-maroon bg-white'}`}
                      >
                        ${c}
                      </button>
                    `)}
                  </div>
                </div>
              `}

              <div className="text-[8px] space-y-1 pt-2 border-t border-maroon/5 text-maroon/70">
                <div>🧵 Fabric details: <strong>${product.fabric}</strong></div>
                <div>🚚 Delivery Estimate: <strong>Arrives by ${getArrivalDate()}</strong> (Express Shipping)</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-maroon/5">
            <div className="flex gap-2">
              <button 
                onClick=${handleAddToCart}
                className="flex-grow font-poppins text-[9px] uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-3 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury text-center"
              >
                Add to Atelier Bag
              </button>
              <button 
                onClick=${handleToggleWishlist}
                className=${`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all bg-white ${isWishlisted ? 'border-red-200 text-red-500 shadow-md bg-red-50' : 'border-maroon/10 hover:border-gold text-maroon/40'}`}
                title=${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                ❤️
              </button>
              <button 
                onClick=${() => { onClose(); setCurrentPage('customizer'); }}
                className="w-10 h-10 rounded-full border border-maroon/10 hover:border-gold text-maroon flex items-center justify-center font-bold text-sm bg-white"
                title="Bespoke custom tailoring customization"
              >
                ✂
              </button>
            </div>
          </div>

          ${related.length > 0 && html`
            <div className="pt-3 border-t border-maroon/5 space-y-1.5">
              <span className="block text-[7px] uppercase font-bold tracking-wider text-maroon/40">You May Also Admire:</span>
              <div className="flex gap-2">
                ${related.map(item => html`
                  <div key=${item.id} className="w-1/2 flex items-center space-x-2 bg-cream/20 p-2 rounded-xl border border-maroon/5 hover:border-gold/30 transition-all cursor-pointer bg-white" onClick=${() => { onClose(); setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-detail-modal', { detail: item }));
                  }, 100); }}>
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-maroon/5">
                      <img src=${item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-playfair text-[8px] font-bold text-maroon truncate leading-tight">${item.name}</h4>
                      <span className="text-[8px] text-gold font-bold">₹${item.price.toLocaleString()}</span>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          `}

        </div>

      </div>
    </div>
  `;
};

// --- 4.6.5 E-COMMERCE PRODUCTS CATALOG PAGE ---
const ShopPage = () => {
  const [filter, setFilter] = React.useState('all');
  const [products, setProducts] = React.useState(BoutiqueDB.getProducts());
  const [addedAlert, setAddedAlert] = React.useState(null);
  const [activeDetailProduct, setActiveDetailProduct] = React.useState(null);
  const [wishlist, setWishlist] = React.useState(BoutiqueDB.getWishlist());

  React.useEffect(() => {
    const handleOpenDetail = (e) => {
      setActiveDetailProduct(e.detail);
    };
    window.addEventListener('open-detail-modal', handleOpenDetail);
    
    // Subscribe to DB updates so adding to wishlist in the modal updates parent state reactively!
    const unsubscribe = BoutiqueDB.subscribe(() => {
      setProducts(BoutiqueDB.getProducts());
      setWishlist(BoutiqueDB.getWishlist());
    });

    return () => {
      window.removeEventListener('open-detail-modal', handleOpenDetail);
      unsubscribe();
    };
  }, []);

  const filtered = products.filter(p => filter === 'all' || p.category === filter);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Avoid launching detail modal when clicking cart button!
    BoutiqueDB.addToCart(product, 1);
    setAddedAlert(product.name);
    setTimeout(() => setAddedAlert(null), 3000);
  };

  const handleToggleWishlist = (e, productId) => {
    e.stopPropagation(); // Avoid launching detail modal when clicking heart!
    BoutiqueDB.toggleWishlist(productId);
    setWishlist(BoutiqueDB.getWishlist());
  };

  const categories = [
    { id: 'all', label: '✨ All Atelier' },
    { id: 'designer-blouses', label: '✂ Designer Blouses' },
    { id: 'ready-made-dresses', label: '👗 Ready Dresses' },
    { id: 'bridal-collections', label: '👑 Bridal Collection' },
    { id: 'party-wear-dresses', label: '🌸 Party Wear' },
    { id: 'kids-dresses', label: '🎀 Kids Outfits' },
    { id: 'ethnic-wear', label: '🏺 Ethnic Couture' },
    { id: 'aari-work-blouses', label: '🦚 Aari Embroidery' },
    { id: 'maggam-work-collections', label: '🪡 Maggam Crafts' },
    { id: 'sarees', label: '🏮 Pure Sarees' },
    { id: 'boutique-accessories', label: '👜 Accessories' }
  ];

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in text-maroon font-poppins text-xs">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Atelier Boutique Store</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Couture Outfits & Accessories</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>

        <!-- 10 E-Commerce Categories Scrolling Row -->
        <div className="overflow-x-auto whitespace-nowrap py-3 px-2 border-b border-maroon/5 flex md:justify-center items-center gap-3 no-scrollbar scroll-smooth">
          ${categories.map(cat => html`
            <button 
              key=${cat.id}
              onClick=${() => setFilter(cat.id)} 
              className=${`inline-block px-5 py-2.5 rounded-full border text-[9px] uppercase tracking-wider font-bold transition-all flex-shrink-0 ${filter === cat.id ? 'bg-maroon text-gold border-gold shadow-luxury' : 'border-maroon/10 hover:border-gold text-maroon bg-white'}`}
            >
              ${cat.label}
            </button>
          `)}
        </div>

        ${addedAlert && html`
          <p className="fixed bottom-6 right-6 z-50 text-emerald-700 bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-2xl shadow-luxury animate-slide-up flex items-center space-x-2 font-semibold">
            <span>✨</span> <span>Successfully added <strong>${addedAlert}</strong> to bag!</span>
          </p>
        `}

        <!-- Pinterest / Masonry-style Product Cards Grid -->
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          ${filtered.map(p => {
            const isWishlisted = wishlist.includes(p.id);
            return html`
              <div 
                key=${p.id} 
                onClick=${() => setActiveDetailProduct(p)}
                className="bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow relative cursor-pointer"
              >
                <!-- Discount Badge top-left -->
                ${p.discount > 0 && html`
                  <span className="absolute top-4 left-4 z-10 bg-rose-50 border border-rose-100 text-rose-700 text-[8px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    ${p.discount}% OFF
                  </span>
                `}
                
                <!-- Wishlist Heart top-right -->
                <button 
                  onClick=${(e) => handleToggleWishlist(e, p.id)} 
                  className=${`absolute top-4 right-4 z-10 w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm transition-all shadow-md ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500 scale-105' : 'bg-white/90 border-maroon/10 text-maroon/40 hover:text-red-500'}`}
                  title=${isWishlisted ? "Remove from Saved" : "Save to Wishlist"}
                >
                  ❤️
                </button>

                <div className="h-64 bg-cream flex items-center justify-center overflow-hidden relative border-b border-maroon/5">
                  <img src=${p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <!-- Quick add to cart overlay -->
                  <div className="absolute inset-0 bg-maroon-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button 
                      onClick=${(e) => handleAddToCart(e, p)} 
                      className="w-full font-poppins text-[9px] uppercase font-bold bg-white text-maroon hover:bg-gold hover:text-maroon py-3.5 rounded-full border border-maroon/5 shadow-lg transition-all"
                    >
                      ⚡ Quick Add to Bag
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] text-maroon/50 font-bold">
                      <span>${p.rating} ⭐</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">${p.stock} units left</span>
                    </div>
                    <h3 className="font-playfair text-base font-bold group-hover:text-gold transition-colors leading-tight truncate">${p.name}</h3>
                    <p className="text-[10px] text-maroon/60 leading-relaxed line-clamp-2">${p.description}</p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-maroon/5">
                    <div className="flex items-center justify-between font-playfair font-bold text-sm">
                      <span className="text-[9px] uppercase font-bold text-maroon/40 font-poppins">Atelier Price:</span>
                      <div className="flex items-center space-x-1.5">
                        ${p.discount > 0 && html`<span className="text-maroon/30 line-through text-[10px]">₹${(p.price * 100 / (100 - p.discount)).toFixed(0)}</span>`}
                        <span className="text-gold text-base">₹${p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          })}
        </div>

        <!-- Product Detail Modal Overlay Frame -->
        ${activeDetailProduct && html`
          <${ProductDetailModal} 
            product=${activeDetailProduct} 
            onClose=${() => setActiveDetailProduct(null)} 
            onCartOpen=${() => {
              // Open cart drawer from parent app
              const bagBtn = document.querySelector('[onClick*="CartOpen"]');
              if (bagBtn) bagBtn.click();
            }}
            setCurrentPage=${(page) => {
              // Re-route to customizer or wishlist
              const exitDesk = document.querySelector('[onClick*="setCurrentPage"]');
              window.scrollTo(0,0);
              // Trigger route transition!
              const routerEl = document.querySelector(`[onClick*="handleLink('${page}')"]`);
              if (routerEl) routerEl.click();
              else window.location.reload(); // Fallback reset
            }}
          />
        `}

      </div>
    </section>
  `;
};

// --- 4.6.6 ACTIVE CART & SIDE DRAWER PANEL ---
const CartDrawer = ({ isOpen, onClose, setCurrentPage }) => {
  if (!isOpen) return null;
  const cart = BoutiqueDB.getCart();
  const [shipping, setShipping] = React.useState({ name: '', phone: '', address: '' });
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [couponCode, setCouponCode] = React.useState('');
  const [appliedDiscount, setAppliedDiscount] = React.useState(0);
  const [couponMessage, setCouponMessage] = React.useState('');
  
  const [shippingMethod, setShippingMethod] = React.useState('express'); // pickup, express, artisan
  const [shippingCost, setShippingCost] = React.useState(150);

  const [paymentMethod, setPaymentMethod] = React.useState('cod'); // cod, upi, razorpay
  const [isPaying, setIsPaying] = React.useState(false);
  const [showQr, setShowQr] = React.useState(false);

  const [savedAddresses, setSavedAddresses] = React.useState(BoutiqueDB.getAddresses());
  const [selectedAddrId, setSelectedAddrId] = React.useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setCouponMessage('🎟️ WELCOME10 coupon: 10% discount applied!');
    } else if (code === 'ATELIER20') {
      const disc = Math.round(subtotal * 0.2);
      setAppliedDiscount(disc);
      setCouponMessage('🎟️ ATELIER20 coupon: 20% discount applied!');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('❌ Invalid coupon code. Try WELCOME10 or ATELIER20.');
    }
  };

  const handleShippingChange = (e) => {
    const val = e.target.value;
    setShippingMethod(val);
    if (val === 'pickup') setShippingCost(0);
    else if (val === 'express') setShippingCost(150);
    else if (val === 'artisan') setShippingCost(300);
  };

  const handleSelectAddress = (e) => {
    const id = e.target.value;
    setSelectedAddrId(id);
    const found = savedAddresses.find(a => a.id === id);
    if (found) {
      setShipping({
        name: found.name,
        phone: found.phone,
        address: found.address
      });
    }
  };

  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const completeCheckout = () => {
    cart.forEach(item => {
      BoutiqueDB.addOrder({
        customerName: shipping.name,
        phone: shipping.phone,
        stitchingItem: `${item.product.name} (E-Commerce Purchase)`,
        neckStyle: item.selectedSize ? `Fit: ${item.selectedSize}` : 'Standard Fit',
        sleeveStyle: item.selectedColor ? `Color: ${item.selectedColor}` : 'Standard Fit',
        embroideryStyle: 'Ready to Wear Boutique Outfit',
        fabricNotes: `Payment: ${paymentMethod.toUpperCase()}. Shipping: ${shippingMethod.toUpperCase()}. Address: ${shipping.address}`,
        cost: item.product.price * item.qty,
        advancePaid: item.product.price * item.qty,
        status: 'Pending'
      });
    });

    BoutiqueDB.clearCart();
    setSuccess(true);
    setShipping({ name: '', phone: '', address: '' });
    setIsCheckingOut(false);
    setShowQr(false);
    setIsPaying(false);
    setCouponCode('');
    setAppliedDiscount(0);
    setCouponMessage('');
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setCurrentPage('profile');
    }, 3000);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.address) return;

    BoutiqueDB.saveAddress(shipping);
    setSavedAddresses(BoutiqueDB.getAddresses());

    if (paymentMethod === 'upi') {
      setShowQr(true);
    } else if (paymentMethod === 'razorpay') {
      setIsPaying(true);
      setTimeout(() => {
        completeCheckout();
      }, 2000); // 2s simulated loader
    } else {
      completeCheckout();
    }
  };

  return html`
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins text-xs text-maroon animate-fade-in">
      <div className="absolute inset-0 bg-maroon-dark/60 backdrop-blur-sm" onClick=${onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white rounded-l-3xl shadow-luxury border-l border-gold/15 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-maroon to-gold"></div>
          
          <div className="px-6 py-6 border-b border-maroon/5 flex items-center justify-between bg-cream/10">
            <h2 className="font-playfair text-xl font-bold flex items-center space-x-2">
              <span>🛒</span> <span>Atelier Bag</span>
            </h2>
            <button onClick=${onClose} className="w-8 h-8 rounded-full border border-maroon/10 flex items-center justify-center font-bold hover:bg-cream">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            ${success ? html`
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <span className="text-4xl block">✨</span>
                <h3 className="font-playfair text-2xl font-bold text-maroon">Couture Order Confirmed!</h3>
                <p className="text-maroon/70 max-w-xs mx-auto leading-relaxed">Your selection has been registered inside our workshops. Sizing details are safely stored in your client cabinet profile.</p>
                <div className="w-10 h-[2px] bg-gold mx-auto"></div>
              </div>
            ` : cart.length === 0 ? html`
              <div className="text-center py-16 space-y-4 text-maroon/50">
                <span className="text-4xl block">🛍️</span>
                <p className="font-playfair font-bold text-sm">Your atelier bag is empty</p>
                <button onClick=${() => { onClose(); setCurrentPage('shop'); }} className="font-poppins text-[10px] uppercase font-bold text-gold bg-maroon px-6 py-3 rounded-full hover:bg-gold hover:text-maroon transition-all">Go Shopping →</button>
              </div>
            ` : showQr ? html`
              <div className="text-center py-10 space-y-6 animate-scale-in">
                <span className="text-4xl block">📱</span>
                <h3 className="font-playfair text-xl font-bold text-maroon">Scan UPI to Complete Order</h3>
                <div className="w-48 h-48 mx-auto bg-white border-2 border-gold p-3 rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
                  <!-- Simulated elegant boutique QR outline -->
                  <div className="w-full h-full border-4 border-dashed border-maroon/20 rounded-xl flex items-center justify-center">
                    <span className="font-playfair font-bold text-xl text-maroon">M</span>
                  </div>
                  <div className="absolute inset-0 bg-maroon/5 rounded-2xl flex items-center justify-center font-bold text-[8px] uppercase tracking-widest text-maroon text-center p-4">Simulated Boutique UPI QR Link</div>
                </div>
                <div className="text-[10px] text-maroon/60 max-w-xs mx-auto leading-relaxed">
                  Amount: <strong className="text-gold text-sm">₹${grandTotal.toLocaleString()}</strong><br />
                  Scan with GPay, PhonePe or Paytm to transfer securely directly to our flagship showroom accounts.
                </div>
                <button onClick=${completeCheckout} className="w-full font-poppins text-[10px] uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-3.5 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury">I have Scanned & Transferred</button>
                <button onClick=${() => setShowQr(false)} className="w-full text-center text-maroon/50 underline text-[9px] uppercase tracking-wider font-bold">Go Back</button>
              </div>
            ` : isPaying ? html`
              <div className="text-center py-20 space-y-6 animate-fade-in">
                <div className="w-16 h-16 border-4 border-gold border-t-maroon rounded-full animate-spin mx-auto"></div>
                <h3 className="font-playfair text-xl font-bold text-maroon">Simulating Razorpay Gateway...</h3>
                <p className="text-maroon/60 text-[10px]">Processing ₹${grandTotal.toLocaleString()} securely through card/netbanking channels. Please do not close this drawer.</p>
              </div>
            ` : html`
              <div className="space-y-4">
                <div className="space-y-3">
                  ${cart.map(item => html`
                    <div key=${item.product.id} className="flex items-center space-x-4 bg-cream/30 p-3 rounded-2xl border border-maroon/5 relative">
                      <div className="w-16 h-16 rounded-xl bg-maroon/10 border border-maroon/5 flex items-center justify-center font-playfair text-lg text-maroon font-bold overflow-hidden flex-shrink-0">
                        <img src=${item.product.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair font-bold text-sm truncate">${item.product.name}</h4>
                        <div className="text-[8px] text-maroon/50 font-semibold space-x-2 pt-0.5">
                          ${item.selectedSize && html`<span>Size: ${item.selectedSize}</span>`}
                          ${item.selectedColor && html`<span>Color: ${item.selectedColor}</span>`}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gold font-bold">₹${item.product.price.toLocaleString()}</span>
                          <div className="flex items-center space-x-2 border border-maroon/10 rounded-full px-2.5 py-1 bg-white">
                            <button onClick=${() => BoutiqueDB.updateCartQty(item.product.id, item.qty - 1)} className="font-bold hover:text-gold">-</button>
                            <span className="font-semibold px-1">${item.qty}</span>
                            <button onClick=${() => BoutiqueDB.updateCartQty(item.product.id, item.qty + 1)} className="font-bold hover:text-gold">+</button>
                          </div>
                        </div>
                      </div>
                      <button onClick=${() => BoutiqueDB.removeFromCart(item.product.id)} className="absolute top-2 right-2 text-maroon/30 hover:text-maroon">✕</button>
                    </div>
                  `)}
                </div>

                ${isCheckingOut && html`
                  <form onSubmit=${handleCheckoutSubmit} className="bg-cream/40 p-4 rounded-2xl border border-maroon/5 space-y-4 animate-fade-in mt-6 text-[10px]">
                    <h3 className="font-playfair text-base font-bold flex items-center justify-between">
                      <span>Atelier Delivery details</span>
                      ${savedAddresses.length > 0 && html`
                        <select onChange=${handleSelectAddress} className="text-[9px] bg-white border border-maroon/10 rounded px-2 py-1 max-w-[150px] focus:outline-none">
                          <option value="">-- Use Saved Address --</option>
                          ${savedAddresses.map(a => html`<option key=${a.id} value=${a.id}>${a.name}</option>`)}
                        </select>
                      `}
                    </h3>
                    
                    <div>
                      <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Your Name *</label>
                      <input type="text" placeholder="Enter name" value=${shipping.name} onChange=${(e) => setShipping({ ...shipping, name: e.target.value })} className="w-full bg-white border border-maroon/10 rounded-xl px-3 py-2 focus:outline-none text-[10px] text-maroon font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Mobile Phone *</label>
                      <input type="tel" placeholder="Enter phone" value=${shipping.phone} onChange=${(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full bg-white border border-maroon/10 rounded-xl px-3 py-2 focus:outline-none text-[10px] text-maroon font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Delivery Address *</label>
                      <textarea placeholder="Enter street, city, pincode..." value=${shipping.address} onChange=${(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full bg-white border border-maroon/10 rounded-xl p-3 focus:outline-none text-[10px] text-maroon font-semibold h-16" required></textarea>
                    </div>

                    <!-- Shipping options -->
                    <div className="space-y-2">
                      <label className="block text-maroon font-bold uppercase tracking-wide text-[8px]">Select Shipping Method:</label>
                      <div className="space-y-1 text-[9px]">
                        <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-maroon/5 cursor-pointer">
                          <input type="radio" name="shipping" value="pickup" checked=${shippingMethod === 'pickup'} onChange=${handleShippingChange} />
                          <span>Flagship Boutique Pickup (Free)</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-maroon/5 cursor-pointer">
                          <input type="radio" name="shipping" value="express" checked=${shippingMethod === 'express'} onChange=${handleShippingChange} />
                          <span>Express Courier Shipping (₹150)</span>
                        </label>
                        <label className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-maroon/5 cursor-pointer">
                          <input type="radio" name="shipping" value="artisan" checked=${shippingMethod === 'artisan'} onChange=${handleShippingChange} />
                          <span>Artisan Hand-Delivery (₹300)</span>
                        </label>
                      </div>
                    </div>

                    <!-- Payment Options -->
                    <div className="space-y-2 border-t border-maroon/5 pt-3">
                      <label className="block text-maroon font-bold uppercase tracking-wide text-[8px]">Select Payment Gateway:</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick=${() => setPaymentMethod('cod')} className=${`py-2 rounded-xl border font-bold uppercase tracking-wider text-[8px] transition-all ${paymentMethod === 'cod' ? 'bg-maroon text-gold border-gold' : 'bg-white border-maroon/10 text-maroon'}`}>Cash on Delivery</button>
                        <button type="button" onClick=${() => setPaymentMethod('upi')} className=${`py-2 rounded-xl border font-bold uppercase tracking-wider text-[8px] transition-all ${paymentMethod === 'upi' ? 'bg-maroon text-gold border-gold' : 'bg-white border-maroon/10 text-maroon'}`}>UPI Scanning</button>
                        <button type="button" onClick=${() => setPaymentMethod('razorpay')} className=${`py-2 rounded-xl border font-bold uppercase tracking-wider text-[8px] transition-all ${paymentMethod === 'razorpay' ? 'bg-maroon text-gold border-gold' : 'bg-white border-maroon/10 text-maroon'}`}>Razorpay Pay</button>
                      </div>
                    </div>

                    <button type="submit" className="w-full font-poppins text-[10px] uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-3.5 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury">
                      Confirm & Pay ₹${grandTotal.toLocaleString()}
                    </button>
                  </form>
                `}
              </div>
            `}
          </div>

          ${cart.length > 0 && !success && !showQr && !isPaying && html`
            <div className="p-6 border-t border-maroon/5 bg-cream/10 space-y-4">
              <!-- Coupon codes validator -->
              ${isCheckingOut && html`
                <form onSubmit=${handleApplyCoupon} className="flex gap-2 border-b border-maroon/5 pb-3">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon (WELCOME10 / ATELIER20)" 
                    value=${couponCode} 
                    onChange=${(e) => setCouponCode(e.target.value)}
                    className="flex-grow bg-white border border-maroon/10 rounded-xl px-3 py-2 text-[9px] uppercase tracking-wider focus:outline-none"
                  />
                  <button type="submit" className="font-poppins text-[9px] font-bold uppercase bg-maroon text-gold px-4 py-2 rounded-xl border border-maroon transition-all">Apply</button>
                </form>
              `}
              
              ${couponMessage && html`
                <p className="text-[9px] font-bold text-center -mt-2">${couponMessage}</p>
              `}

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="font-bold text-maroon">₹${subtotal.toLocaleString()}</span>
                </div>
                ${appliedDiscount > 0 && html`
                  <div className="flex items-center justify-between text-gold font-bold">
                    <span>Coupon Discount:</span>
                    <span>- ₹${appliedDiscount.toLocaleString()}</span>
                  </div>
                `}
                ${isCheckingOut && html`
                  <div className="flex items-center justify-between text-maroon/60">
                    <span>Shipping Charges (${shippingMethod.toUpperCase()}):</span>
                    <span>₹${shippingCost.toLocaleString()}</span>
                  </div>
                `}
                <div className="flex items-center justify-between font-playfair font-bold text-sm pt-2 border-t border-maroon/5">
                  <span>Total Amount:</span>
                  <span className="text-gold text-lg">₹${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="w-full flex gap-3">
                ${isCheckingOut ? html`
                  <button onClick=${() => setIsCheckingOut(false)} className="w-1/3 font-poppins text-[9px] uppercase font-bold border border-maroon/20 py-3.5 rounded-full hover:bg-cream transition-all">Cancel</button>
                ` : html`
                  <button onClick=${() => setIsCheckingOut(true)} className="w-full font-poppins text-[10px] uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury">Place Custom Order</button>
                `}
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

// --- 4.7 CONTACT & SHOWROOM INQUIRY PAGE ---
const ContactPage = () => {
  const [inquiry, setInquiry] = React.useState({ name: '', phone: '', msg: '' });
  const [success, setSuccess] = React.useState(false);
  const [config, setConfig] = React.useState(BoutiqueDB.getConfig());

  React.useEffect(() => {
    return BoutiqueDB.subscribe((state) => {
      if (state && state.config) {
        setConfig(state.config);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone) return;
    BoutiqueDB.addNotification({ title: 'New Customer Inquiry', message: `${inquiry.name} (${inquiry.phone}) sent inquiry: "${inquiry.msg.slice(0, 30)}..."` });
    setSuccess(true);
    setInquiry({ name: '', phone: '', msg: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Visit Showroom</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Connect With Designers</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <form onSubmit=${handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury space-y-6">
            <h3 className="font-playfair text-xl font-bold">Inquiry Message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins text-xs">
              <div>
                <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Your Name *</label>
                <input type="text" placeholder="Enter name" value=${inquiry.name} onChange=${(e) => setInquiry({ ...inquiry, name: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Mobile Phone *</label>
                <input type="tel" placeholder="Enter mobile" value=${inquiry.phone} onChange=${(e) => setInquiry({ ...inquiry, phone: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none" required />
              </div>
            </div>
            <div>
              <label className="block font-poppins text-maroon font-bold uppercase tracking-wide text-[9px] mb-2">Message *</label>
              <textarea placeholder="Describe outfit requirements, dates..." value=${inquiry.msg} onChange=${(e) => setInquiry({ ...inquiry, msg: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl p-4 focus:outline-none text-xs h-28" required></textarea>
            </div>
            <button type="submit" className="w-full font-poppins text-xs uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury">Send Message</button>
            ${success && html`<p className="text-emerald-700 font-poppins text-xs text-center mt-3 bg-emerald-50 py-3 rounded-xl border border-emerald-150 animate-fade-in">✦ Inquiry recorded! Desk designers will call within 2 hours.</p>`}
          </form>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-maroon text-white rounded-3xl p-8 border border-gold/20 shadow-luxury space-y-4">
              <h3 className="font-playfair text-xl text-gold font-bold">Studio Desk</h3>
              <p className="font-poppins text-xs leading-relaxed text-white/80">
                📍 ${config.address}.<br /><br />
                📞 ${config.phone}
              </p>
            </div>
            <div className="border border-maroon/5 bg-cream rounded-3xl p-6 h-48 flex items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(maroon_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="space-y-1 relative z-10 font-poppins text-[10px] text-maroon/70">
                <span className="text-2xl block mb-2">🗺️</span>
                <h4 className="font-playfair font-bold text-sm text-maroon">Flagship Showroom Map</h4>
                <a href="https://maps.google.com" target="_blank" className="text-gold-dark uppercase font-bold tracking-wider hover:underline pt-2 block">Open Google Maps →</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
};

// --- 4.8 AUTHENTICATION BYPASS PAGE ---
const LoginPage = ({ setCurrentPage, setCurrentUser }) => {
  const [isAdminLogin, setIsAdminLogin] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setLoading(false);
      if (isRegistering) {
        const customers = BoutiqueDB.getCustomers();
        const existing = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          setErrorMsg("This email is already registered.");
          return;
        }
        const newUser = BoutiqueDB.addCustomer({ name, email, password: pwd, role: 'customer' });
        setCurrentUser(newUser);
        setCurrentPage('profile');
      } else {
        if (isAdminLogin) {
          if (email === 'admin@mahathi.com' && pwd === 'admin123') {
            setCurrentUser({ name: 'Santhosh Kumar', email: 'admin@mahathi.com', role: 'admin' });
            setCurrentPage('admin');
          } else {
            setErrorMsg("Incorrect admin credentials.");
          }
        } else {
          const customers = BoutiqueDB.getCustomers();
          const matched = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
          if (matched) {
            if (matched.password && matched.password !== pwd) {
              setErrorMsg("Incorrect password.");
            } else {
              setCurrentUser(matched);
              setCurrentPage('profile');
            }
          } else {
            setErrorMsg("No account found with this email.");
          }
        }
      }
    }, 500);
  };

  const bypassAdmin = () => {
    setCurrentUser({ name: 'Santhosh Kumar', email: 'admin@mahathi.com', role: 'admin' });
    setCurrentPage('admin');
  };

  const bypassClient = () => {
    setCurrentUser({ name: 'Priya Dharshini', email: 'priya.d@gmail.com', role: 'customer', id: 'cust-1' });
    setCurrentPage('profile');
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] flex items-center justify-center animate-fade-in text-maroon font-poppins text-xs">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-maroon to-gold"></div>
          
          <div className="text-center space-y-2">
            <span className="font-playfair text-xl font-bold text-gold bg-maroon/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto">M</span>
            <h2 className="font-playfair text-2xl font-bold">
              ${isRegistering ? 'Create Profile' : isAdminLogin ? 'Atelier Secure Desk' : 'Boutique Cabinet'}
            </h2>
            <p className="text-maroon/60">
              ${isRegistering ? 'Register your private measurements and design files' : isAdminLogin ? 'Access flagship workshops and orders queues' : 'Access your custom orders and measurements profiles'}
            </p>
            ${isAdminLogin && !isRegistering && html`
              <p className="text-[10px] text-maroon bg-cream/80 py-2.5 px-4 rounded-xl border border-maroon/10 text-center font-semibold mt-2 animate-fade-in">
                💡 Demo Credentials: <span className="text-gold font-bold">admin@mahathi.com</span> / <span className="text-gold font-bold">admin123</span>
              </p>
            `}
          </div>

          ${!isRegistering && html`
            <div className="flex border-b border-maroon/5 pb-2">
              <button 
                onClick=${() => { setIsAdminLogin(false); setErrorMsg(''); }}
                className=${`w-1/2 text-center pb-2 font-semibold tracking-wider transition-colors ${!isAdminLogin ? 'text-gold border-b-2 border-gold font-bold' : 'text-maroon/40'}`}
              >
                Client Cabinet
              </button>
              <button 
                onClick=${() => { setIsAdminLogin(true); setErrorMsg(''); }}
                className=${`w-1/2 text-center pb-2 font-semibold tracking-wider transition-colors ${isAdminLogin ? 'text-gold border-b-2 border-gold font-bold' : 'text-maroon/40'}`}
              >
                Owner Desk
              </button>
            </div>
          `}

          <form onSubmit=${handleSubmit} className="space-y-4">
            ${isRegistering && html`
              <div>
                <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Full Name</label>
                <input type="text" placeholder="Enter full name" value=${name} onChange=${(e) => setName(e.target.value)} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none text-xs focus:border-gold" required />
              </div>
            `}
            <div>
              <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Email Address</label>
              <input type="email" placeholder="Enter email" value=${email} onChange=${(e) => setEmail(e.target.value)} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none text-xs focus:border-gold" required />
            </div>
            <div>
              <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Password</label>
              <input type="password" placeholder="Enter password" value=${pwd} onChange=${(e) => setPwd(e.target.value)} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none text-xs focus:border-gold" required />
            </div>

            ${errorMsg && html`
              <p className="text-red-600 text-[10px] font-semibold text-center bg-red-50 py-2.5 rounded-xl border border-red-100 animate-fade-in">${errorMsg}</p>
            `}

            <button type="submit" disabled=${loading} className="w-full font-poppins text-xs uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury disabled:opacity-50">
              ${loading ? 'Authenticating...' : isRegistering ? 'Register Profile' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-maroon/50 pt-2 font-semibold">
            <button onClick=${() => { setIsRegistering(!isRegistering); setIsAdminLogin(false); setErrorMsg(''); }} className="hover:text-gold transition-colors">
              ${isRegistering ? 'Already have an account? Sign In' : 'Create new profile / Register'}
            </button>
            ${!isRegistering && html`
              <button onClick=${() => setCurrentPage('forgot-password')} className="hover:text-gold transition-colors">
                Forgot Password?
              </button>
            `}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-maroon/5"></div>
            <span className="mx-3 font-poppins text-[9px] uppercase tracking-widest text-maroon/40 font-bold">One-Click Bypass</span>
            <div className="flex-grow border-t border-maroon/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick=${bypassAdmin} className="font-poppins text-[10px] uppercase font-bold bg-gold/15 text-gold-dark hover:bg-gold hover:text-maroon py-3 rounded-full border border-gold/30 transition-all text-center">Owner Desk</button>
            <button onClick=${bypassClient} className="font-poppins text-[10px] uppercase font-bold bg-maroon-soft text-maroon hover:bg-maroon hover:text-gold py-3 rounded-full border border-maroon/15 transition-all text-center">Client File</button>
          </div>

        </div>
      </div>
    </section>
  `;
};;

// --- 4.9 SEPARATE PROFESSIONAL SAAS OWNER PANEL ---
const AdminPage = ({ setCurrentPage }) => {
  const [tab, setTab] = React.useState('analytics');
  const [orders, setOrders] = React.useState(BoutiqueDB.getOrders());
  const [appointments, setAppointments] = React.useState(BoutiqueDB.getAppointments());
  const [customers, setCustomers] = React.useState(BoutiqueDB.getCustomers());
  const [staff] = React.useState(BoutiqueDB.getState().staff);
  const [notifications, setNotifications] = React.useState(BoutiqueDB.getNotifications());
  const [products, setProducts] = React.useState(BoutiqueDB.getProducts());
  
  const [orderSearch, setOrderSearch] = React.useState('');
  const [custSearch, setCustSearch] = React.useState('');
  const [selectedCust, setSelectedCust] = React.useState(null);
  const [measureForm, setMeasureForm] = React.useState(null);
  const [settingsForm, setSettingsForm] = React.useState(BoutiqueDB.getConfig());

  const canvasRef = React.useRef(null);

  const reloadData = () => {
    setOrders(BoutiqueDB.getOrders());
    setAppointments(BoutiqueDB.getAppointments());
    setCustomers(BoutiqueDB.getCustomers());
    setNotifications(BoutiqueDB.getNotifications());
    setProducts(BoutiqueDB.getProducts());
  };

  const [editingProduct, setEditingProduct] = React.useState(null); // null, 'new', or product ID
  const [prodForm, setProdForm] = React.useState({
    name: '', category: 'designer-blouses', price: '', discount: 0, stock: '', description: '', fabric: '', sizes: 'XS, S, M, L, XL', colors: 'Red, Gold, Green', image: './assets/designer-blouse.png'
  });

  const handleOpenAdd = () => {
    setEditingProduct('new');
    setProdForm({
      name: '', category: 'designer-blouses', price: '', discount: 0, stock: '', description: '', fabric: 'Pure Raw Silk with cotton backing', sizes: 'XS, S, M, L, XL', colors: 'Royal Crimson, Antique Gold, Forest Green', image: './assets/designer-blouse.png'
    });
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p.id);
    setProdForm({
      name: p.name,
      category: p.category,
      price: p.price,
      discount: p.discount || 0,
      stock: p.stock,
      description: p.description,
      fabric: p.fabric || 'Pure Southern Silk',
      sizes: p.sizes ? p.sizes.join(', ') : 'XS, S, M, L, XL',
      colors: p.colors ? p.colors.join(', ') : 'Royal Crimson, Antique Gold, Forest Green',
      image: p.image
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formatted = {
      name: prodForm.name,
      category: prodForm.category,
      price: parseFloat(prodForm.price) || 0,
      discount: parseInt(prodForm.discount) || 0,
      stock: parseInt(prodForm.stock) || 0,
      description: prodForm.description,
      fabric: prodForm.fabric,
      sizes: prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: prodForm.colors.split(',').map(c => c.trim()).filter(Boolean),
      image: prodForm.image
    };

    if (editingProduct === 'new') {
      BoutiqueDB.addProduct(formatted);
      alert('⚡ Dynamic new product created successfully inside the Boutique catalog!');
    } else {
      BoutiqueDB.updateProduct(editingProduct, formatted);
      alert('⚡ Product updated successfully in the Boutique database!');
    }

    setEditingProduct(null);
    reloadData();
  };

  const handleDeleteProduct = (prodId) => {
    if (confirm('🚨 Are you absolutely sure you want to purge this premium item from your Atelier Boutique Store catalog?')) {
      BoutiqueDB.deleteProduct(prodId);
      reloadData();
    }
  };

  // Re-draw Canvas chart dynamically
  React.useEffect(() => {
    if (tab === 'analytics' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const metrics = BoutiqueDB.getRevenueMetrics();
      const statusCounts = metrics.statusCounts;
      const statuses = ['Pending', 'Measuring', 'Cutting', 'Embroidery', 'Stitching', 'Trial', 'Completed'];
      const counts = statuses.map(s => statusCounts[s] || 0);

      const margin = { top: 30, right: 20, bottom: 40, left: 40 };
      const w = canvas.width - margin.left - margin.right;
      const h = canvas.height - margin.top - margin.bottom;

      // Axes
      ctx.strokeStyle = 'rgba(92, 6, 30, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + h);
      ctx.lineTo(margin.left + w, margin.top + h);
      ctx.stroke();

      const max = Math.max(...counts, 4);
      const barW = w / statuses.length - 15;

      statuses.forEach((s, idx) => {
        const val = counts[idx];
        const barH = (val / max) * h;
        const x = margin.left + idx * (w / statuses.length) + 7.5;
        const y = margin.top + h - barH;

        // Gradient
        const grad = ctx.createLinearGradient(x, y, x, margin.top + h);
        grad.addColorStop(0, '#D4AF37');
        grad.addColorStop(1, '#5C061E');
        ctx.fillStyle = grad;

        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        else ctx.rect(x, y, barW, barH);
        ctx.fill();

        ctx.fillStyle = '#3D0210';
        ctx.font = 'bold 10px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(val.toString(), x + barW/2, y - 8);

        ctx.fillStyle = 'rgba(61, 2, 16, 0.6)';
        ctx.font = '9px Poppins';
        ctx.fillText(s, x + barW/2, margin.top + h + 20);
      });
    }
  }, [tab, orders]);

  const handleStatus = (id, newStatus) => {
    BoutiqueDB.updateOrderStatus(id, newStatus);
    reloadData();
  };

  const handleStaff = (id, staffName) => {
    BoutiqueDB.updateOrderStaff(id, staffName);
    reloadData();
  };

  const handleAptStatus = (id, newStatus) => {
    BoutiqueDB.updateAppointmentStatus(id, newStatus);
    reloadData();
  };

  const handleOpenCust = (c) => {
    setSelectedCust(c);
    setMeasureForm({ ...c.measurements });
  };

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    if (!selectedCust || !measureForm) return;
    BoutiqueDB.updateCustomerMeasurements(selectedCust.id, measureForm);
    alert('Measurements card updated in database successfully!');
    setSelectedCust(null);
    reloadData();
  };

  const metrics = BoutiqueDB.getRevenueMetrics();

  const filteredOrders = orders.filter(o => {
    return o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase());
  });

  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch);
  });

  const sidebarLinks = [
    { id: 'analytics', label: '📊 Dashboard' },
    { id: 'orders', label: '✂ Stitching Orders' },
    { id: 'appointments', label: '📅 Scheduled slots' },
    { id: 'customers', label: '📏 Sizing Cards' },
    { id: 'staff', label: '👑 Workshop Artisans' },
    { id: 'products', label: '🛍️ Store Products' },
    { id: 'settings', label: '⚙ Settings Config' }
  ];

  return html`
    <div className="min-h-screen bg-cream/30 pt-[70px] flex">
      
      <aside className="w-64 bg-maroon text-white border-r border-gold/15 hidden md:flex flex-col justify-between shrink-0 font-poppins">
        <div className="p-6 border-b border-gold/10">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-gold text-sm">M</span>
            <span className="font-playfair text-base font-bold text-white block">Owner Workspace</span>
          </div>
          <span className="font-poppins text-[8px] uppercase tracking-widest text-gold block mt-1">Mahathi Tailors</span>
        </div>

        <nav className="flex-grow py-6 px-4 space-y-1.5 text-xs uppercase tracking-wider font-semibold">
          ${sidebarLinks.map(l => html`
            <button key=${l.id} onClick=${() => setTab(l.id)} className=${`w-full text-left p-3.5 rounded-xl transition-all ${tab === l.id ? 'bg-gold text-maroon font-bold shadow-luxury' : 'hover:bg-white/5 text-white/80 font-medium'}`}>
              ${l.label}
            </button>
          `)}
        </nav>

        <div className="p-6 border-t border-gold/10">
          <button onClick=${() => { setCurrentPage('home'); window.scrollTo(0,0); }} className="w-full text-center text-[9px] uppercase tracking-widest font-bold text-gold hover:text-white">← Exit Owner Desk</button>
        </div>
      </aside>

      <main className="flex-grow p-6 sm:p-10 max-w-[1200px] mx-auto overflow-x-hidden">
        
        <div className="flex md:hidden items-center justify-between bg-maroon text-gold p-4 rounded-xl mb-6 font-poppins text-xs font-semibold">
          <span>Owner Workspace</span>
          <select value=${tab} onChange=${(e) => setTab(e.target.value)} className="bg-maroon-dark text-gold border border-gold/20 px-3 py-1.5 rounded focus:outline-none">
            <option value="analytics">Dashboard</option>
            <option value="orders">Orders</option>
            <option value="appointments">Appointments</option>
            <option value="customers">Measurements</option>
            <option value="staff">Artisans</option>
            <option value="products">Store Products</option>
            <option value="settings">Settings Config</option>
          </select>
        </div>

        ${tab === 'analytics' && html`
          <div className="space-y-10 animate-fade-in text-maroon">
            <div>
              <h2 className="font-playfair text-3xl font-bold">Revenue Analytics</h2>
              <p className="font-poppins text-xs text-maroon/60 mt-1">Live studio balance distributions and queue load capacities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/60 font-semibold">Estimated Gross Sales</span>
                <h4 className="font-playfair text-3xl font-bold mt-2">₹${metrics.totalSales.toLocaleString()}</h4>
                <p className="font-poppins text-[9px] text-gold mt-1">Calculated base + embroidery additions</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/60 font-semibold">Advances collected</span>
                <h4 className="font-playfair text-3xl font-bold text-emerald-700 mt-2">₹${metrics.advancePaid.toLocaleString()}</h4>
                <p className="font-poppins text-[9px] text-emerald-500 mt-1">Active cash flow deposits</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <span className="font-poppins text-[9px] uppercase tracking-wider text-maroon/60 font-semibold">Outstanding Collections</span>
                <h4 className="font-playfair text-3xl font-bold text-amber-600 mt-2">₹${metrics.pendingCollections.toLocaleString()}</h4>
                <p className="font-poppins text-[9px] text-amber-500 mt-1">Due balance collections on delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury">
                <h3 className="font-playfair text-lg font-bold mb-6">Active Stitching Queue Distribution</h3>
                <div className="w-full overflow-x-auto">
                  <canvas ref=${canvasRef} width="520" height="260" className="mx-auto"></canvas>
                </div>
              </div>
              <div className="lg:col-span-4 bg-maroon text-white rounded-2xl p-6 border border-gold/20 shadow-luxury flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-base font-bold text-gold mb-6">Queue work loads</h3>
                  <div className="space-y-4 font-poppins text-xs">
                    <div className="flex justify-between"><span>Embroidery Masters:</span><strong className="text-gold">${orders.filter(o => o.status === 'Embroidery').length} Active</strong></div>
                    <div className="flex justify-between"><span>Machine Tailors:</span><strong className="text-gold">${orders.filter(o => o.status === 'Stitching').length} Active</strong></div>
                    <div className="flex justify-between"><span>Finished (Trials):</span><strong className="text-gold">${orders.filter(o => o.status === 'Trial').length} Done</strong></div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 mt-6 text-center font-poppins">
                  <span className="bg-gold/10 text-gold border border-gold/20 text-[9px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full inline-block">Atelier Capacity: 84% load</span>
                </div>
              </div>
            </div>
          </div>
        `}

        ${tab === 'orders' && html`
          <div className="space-y-8 animate-fade-in text-maroon">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-playfair text-3xl font-bold">Stitching queue</h2>
                <p className="font-poppins text-xs text-maroon/60 mt-1">Assign masters, configure dimensions, update queue parameters.</p>
              </div>
              <input type="text" placeholder="Search customer ID or Name..." value=${orderSearch} onChange=${(e) => setOrderSearch(e.target.value)} className="bg-white border border-maroon/10 rounded-xl px-4 py-2 text-xs focus:outline-none w-64" />
            </div>

            <div className="bg-white rounded-2xl border border-maroon/5 shadow-luxury overflow-hidden font-poppins text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-maroon text-gold uppercase text-[9px] tracking-wider border-b border-gold/15">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Garment Specifications</th>
                      <th className="p-4">Delivery Due</th>
                      <th className="p-4">Assign Artisan</th>
                      <th className="p-4">Work Queue</th>
                      <th className="p-4 text-right">Quote</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-maroon/5 text-maroon">
                    ${filteredOrders.map(o => html`
                      <tr key=${o.id} className="hover:bg-maroon-soft/30 transition-colors">
                        <td className="p-4 font-bold text-gold-dark">${o.id}</td>
                        <td className="p-4">
                          <span className="font-semibold block">${o.customerName}</span>
                          <span className="text-[10px] text-maroon/40">${o.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold block">${o.stitchingItem}</span>
                          <span className="text-[10px] text-maroon/40 block">Neck: ${o.neckStyle} | Sleeve: ${o.sleeveStyle}</span>
                        </td>
                        <td className="p-4 font-semibold">${o.dueDate}</td>
                        <td className="p-4">
                          <select value=${o.staffAssigned || 'Pending'} onChange=${(e) => handleStaff(o.id, e.target.value)} className="bg-cream/40 border border-maroon/10 p-1.5 rounded-lg text-[10px] focus:outline-none">
                            <option value="Pending">Pending Assignment</option>
                            ${staff.map(s => html`<option key=${s.id} value=${`${s.name} (${s.role})`}>${s.name} (${s.role})</option>`)}
                          </select>
                        </td>
                        <td className="p-4">
                          <select value=${o.status} onChange=${(e) => handleStatus(o.id, e.target.value)} className="bg-cream/40 border border-maroon/10 p-1.5 rounded-lg text-[10px] font-bold focus:outline-none">
                            <option value="Pending">Pending</option>
                            <option value="Measuring">Measuring</option>
                            <option value="Cutting">Cutting</option>
                            <option value="Embroidery">Embroidery</option>
                            <option value="Stitching">Stitching</option>
                            <option value="Trial">Trial</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right font-bold">₹${o.cost.toLocaleString()}</td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `}

        ${tab === 'appointments' && html`
          <div className="space-y-8 animate-fade-in text-maroon">
            <div>
              <h2 className="font-playfair text-3xl font-bold">Showroom Bookings</h2>
              <p className="font-poppins text-xs text-maroon/60 mt-1">Approve scheduled trials, wedding consultation slots, or home measurement requests.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 font-poppins text-xs">
              ${appointments.map(a => html`
                <div key=${a.id} className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gold/30 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gold/10 text-gold-dark font-bold uppercase tracking-wider text-[8px] px-3 py-1 rounded-full border border-gold/20">${a.status}</span>
                      <span className="text-[10px] text-maroon/40 font-bold">${a.id}</span>
                    </div>
                    <h4 className="font-playfair text-lg font-bold">${a.name}</h4>
                    <p className="text-maroon/60">Phone: ${a.phone} | Consult: <strong>${a.type}</strong></p>
                    <p className="text-gold font-semibold text-[10px]">📅 Date: ${a.date} at ${a.time}</p>
                    ${a.notes && html`<p className="text-[10px] text-maroon/40 block mt-1 italic">Notes: "${a.notes}"</p>`}
                  </div>
                  <div className="flex items-center space-x-2 pt-4 sm:pt-0 w-full sm:w-auto border-t sm:border-t-0 border-maroon/5">
                    ${a.status === 'Pending' && html`<button onClick=${() => handleAptStatus(a.id, 'Confirmed')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-[8px] px-4 py-2.5 rounded-full transition-all w-full sm:w-auto text-center">Confirm Slot</button>`}
                    ${a.status === 'Confirmed' && html`<button onClick=${() => handleAptStatus(a.id, 'Completed')} className="bg-maroon border border-gold hover:bg-gold hover:text-maroon text-gold font-bold uppercase tracking-wider text-[8px] px-4 py-2.5 rounded-full transition-all w-full sm:w-auto text-center">Mark Done</button>`}
                    <button onClick=${() => handleAptStatus(a.id, 'Cancelled')} className="text-red-600 font-semibold uppercase tracking-wider text-[8px] px-4 py-2.5 hover:bg-red-50 rounded-full transition-colors w-full sm:w-auto text-center">Cancel</button>
                  </div>
                </div>
              `)}
            </div>
          </div>
        `}

        ${tab === 'customers' && html`
          <div className="space-y-8 animate-fade-in text-maroon">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-playfair text-3xl font-bold">Measurement Cards</h2>
                <p className="font-poppins text-xs text-maroon/60 mt-1">Archive exact sizing variable records for bridal contours.</p>
              </div>
              <input type="text" placeholder="Search customer phone or name..." value=${custSearch} onChange=${(e) => setCustSearch(e.target.value)} className="bg-white border border-maroon/10 rounded-xl px-4 py-2 text-xs focus:outline-none w-64" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              ${filteredCustomers.map(c => html`
                <div key=${c.id} className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury hover:border-gold/30 transition-colors flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between font-poppins text-[9px] text-maroon/40 font-bold"><span>${c.id}</span><span>Joined: ${c.joinedDate}</span></div>
                    <div>
                      <h4 className="font-playfair text-lg font-bold">${c.name}</h4>
                      <p className="font-poppins text-xs text-maroon/60">Phone: ${c.phone} | Email: ${c.email}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-maroon-soft/30 p-3 rounded-xl border border-maroon/5 font-poppins text-[9px] text-maroon/80">
                      <div>Chest: <strong>${c.measurements.chest || 0}"</strong></div>
                      <div>Waist: <strong>${c.measurements.waist || 0}"</strong></div>
                      <div>Blouse L: <strong>${c.measurements.blouseLength || 0}"</strong></div>
                      <div>Shoulder: <strong>${c.measurements.shoulder || 0}"</strong></div>
                      <div>Front N: <strong>${c.measurements.frontNeck || 0}"</strong></div>
                      <div>Back N: <strong>${c.measurements.backNeck || 0}"</strong></div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-maroon/5 mt-4">
                    <button onClick=${() => handleOpenCust(c)} className="w-full text-center font-poppins text-[9px] font-bold uppercase tracking-widest bg-maroon text-gold py-2.5 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all">Modify Sizing Card</button>
                  </div>
                </div>
              `)}
            </div>

            ${selectedCust && html`
              <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-maroon">
                <div className="bg-white rounded-3xl p-8 max-w-xl w-full border border-gold/25 shadow-glow" onClick=${(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between pb-6 border-b border-maroon/10 mb-6">
                    <div>
                      <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold">Measurement Sheet</span>
                      <h3 className="font-playfair text-xl font-bold">Card: ${selectedCust.name}</h3>
                    </div>
                    <button onClick=${() => setSelectedCust(null)} className="text-maroon hover:text-gold text-2xl font-bold">✕</button>
                  </div>

                  <form onSubmit=${handleSaveMeasurements} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 font-poppins text-xs">
                      ${['chest', 'waist', 'blouseLength', 'shoulder', 'frontNeck', 'backNeck', 'sleeveLength', 'sleeveRound', 'armHole'].map(field => html`
                        <div key=${field}>
                          <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-1">${field} (in)</label>
                          <input 
                            type="number" step="0.25"
                            value=${measureForm[field]}
                            onChange=${(e) => setMeasureForm({ ...measureForm, [field]: Number(e.target.value) })}
                            className="w-full bg-cream/40 border border-maroon/10 rounded-lg p-2.5 focus:outline-none"
                          />
                        </div>
                      `)}
                    </div>
                    <div className="pt-6 border-t border-maroon/10 flex justify-end space-x-4">
                      <button type="button" onClick=${() => setSelectedCust(null)} className="font-poppins text-xs uppercase font-bold text-maroon/50 px-6 py-2">Cancel</button>
                      <button type="submit" className="font-poppins text-xs uppercase font-bold bg-gold text-maroon px-8 py-3 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all">Save Sheet</button>
                    </div>
                  </form>
                </div>
              </div>
            `}

          </div>
        `}

        ${tab === 'staff' && html`
          <div className="space-y-8 animate-fade-in text-maroon">
            <div>
              <h2 className="font-playfair text-3xl font-bold">Atelier Artisans</h2>
              <p className="font-poppins text-xs text-maroon/60 mt-1">Supervise active stitching loads and coordinate cutter assignments.</p>
            </div>
            <div className="bg-white rounded-2xl border border-maroon/5 shadow-luxury overflow-hidden font-poppins text-xs text-maroon">
              <table className="w-full text-left">
                <thead className="bg-maroon text-gold uppercase text-[9px] tracking-wider border-b border-gold/15">
                  <tr>
                    <th className="p-4">Artisan ID</th>
                    <th className="p-4">Artisan Name</th>
                    <th className="p-4">Atelier Role</th>
                    <th className="p-4">Active Stitching</th>
                    <th className="p-4 text-right">Work status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maroon/5">
                  ${staff.map(s => html`
                    <tr key=${s.id} className="hover:bg-maroon-soft/30 transition-colors">
                      <td className="p-4 font-bold text-gold-dark">${s.id}</td>
                      <td className="p-4 font-semibold">${s.name}</td>
                      <td className="p-4">${s.role}</td>
                      <td className="p-4"><strong>${s.ordersCount} Active Orders</strong> <span className="text-[10px] text-maroon/40 block">Studio capacity limit: 5</span></td>
                      <td className="p-4 text-right"><span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3.5 py-1 rounded-full text-[9px]">Active / Available</span></td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          </div>
        `}

        ${tab === 'settings' && html`
          <div className="space-y-8 animate-fade-in text-maroon font-poppins text-xs">
            <div>
              <h2 className="font-playfair text-3xl font-bold">Atelier Settings</h2>
              <p className="text-maroon/60 mt-1">Configure global contact numbers, flagship addresses, and social links dynamically.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury">
              <form onSubmit=${(e) => {
                e.preventDefault();
                BoutiqueDB.updateConfig(settingsForm);
                alert('Global boutique configurations saved and updated dynamically!');
                window.location.reload();
              }} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins text-xs">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Display Phone Number *</label>
                    <input type="text" value=${settingsForm.phone} onChange=${(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">WhatsApp Number (e.g. 919840123456) *</label>
                    <input type="text" value=${settingsForm.whatsapp} onChange=${(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins text-xs">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Instagram Link</label>
                    <input type="url" value=${settingsForm.instagram} onChange=${(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Facebook Page Link</label>
                    <input type="url" value=${settingsForm.facebook} onChange=${(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins text-xs">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Business Email Address *</label>
                    <input type="email" value=${settingsForm.email} onChange=${(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Working Hours *</label>
                    <input type="text" value=${settingsForm.hours} onChange=${(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold" required />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">Flagship Showroom Address *</label>
                  <textarea value=${settingsForm.address} onChange=${(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full bg-cream/40 border border-maroon/10 rounded-xl p-4 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold h-20" required></textarea>
                </div>

                <div className="pt-6 border-t border-maroon/5 flex justify-end">
                  <button type="submit" className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-8 py-3.5 rounded-full hover:bg-maroon hover:text-gold transition-all shadow-luxury">
                    Save Global Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        `}

        ${tab === 'products' && html`
          <div className="space-y-6 animate-fade-in text-maroon font-poppins text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-3xl font-bold">Manage Store Products</h2>
                <p className="text-maroon/60 mt-1">Review catalog items, adjust retail pricing, and update warehouse inventory stock counts.</p>
              </div>
              <button 
                onClick=${handleOpenAdd}
                className="font-poppins text-[10px] uppercase tracking-widest font-bold bg-gold text-maroon border border-gold hover:bg-maroon hover:text-gold px-5 py-3 rounded-full transition-all shadow-luxury"
              >
                ✦ Add New Product
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-maroon text-gold uppercase tracking-wider font-bold">
                      <th className="p-4 rounded-tl-2xl">Item Photo</th>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Retail Price (₹)</th>
                      <th className="p-4">Stock (Units)</th>
                      <th className="p-4 rounded-tr-2xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-maroon/5">
                    ${products.map(p => {
                      return html`
                        <tr key=${p.id} className="hover:bg-cream/20 transition-colors">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-xl bg-cream border border-maroon/5 overflow-hidden flex items-center justify-center">
                              <img src=${p.image} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <h4 className="font-playfair text-xs font-bold text-maroon">${p.name}</h4>
                            <p className="text-[9px] text-maroon/50 truncate max-w-xs">${p.description}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-maroon/5 border border-maroon/10 text-maroon font-bold uppercase tracking-wider text-[8px] px-2.5 py-1 rounded-full">
                              ${p.category.replace(/-/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4 font-semibold">
                            <div className="flex items-center space-x-1">
                              <span className="text-gold font-bold">₹${p.price.toLocaleString()}</span>
                              ${p.discount > 0 && html`<span className="text-maroon/40 text-[9px] bg-rose-50 px-1 rounded font-normal">(-${p.discount}%)</span>`}
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-maroon">
                            <span>${p.stock} units</span>
                          </td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            <button 
                              onClick=${() => handleOpenEdit(p)}
                              className="font-poppins text-[8px] uppercase font-bold border border-maroon/20 hover:border-gold px-3.5 py-2 rounded-full transition-all bg-white"
                            >
                              Edit
                            </button>
                            <button 
                              onClick=${() => handleDeleteProduct(p.id)}
                              className="font-poppins text-[8px] uppercase font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3.5 py-2 rounded-full transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      `;
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Add/Edit Product Modal Form Overlay -->
            ${editingProduct && html`
              <div className="fixed inset-0 bg-maroon-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-[10px]">
                <div className="absolute inset-0" onClick=${() => setEditingProduct(null)}></div>
                <form onSubmit=${handleSaveProduct} className="bg-white rounded-3xl border border-gold/15 max-w-xl w-full p-6 sm:p-8 shadow-luxury space-y-4 relative z-10 max-h-[95vh] overflow-y-auto animate-scale-in">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-maroon to-gold"></div>
                  
                  <div className="flex items-center justify-between border-b border-maroon/5 pb-3">
                    <h3 className="font-playfair text-lg font-bold text-maroon">
                      ${editingProduct === 'new' ? "✦ Add New Boutique Product" : "✏ Edit Product Specifications"}
                    </h3>
                    <button type="button" onClick=${() => setEditingProduct(null)} className="w-8 h-8 rounded-full border border-maroon/10 text-maroon hover:bg-cream flex items-center justify-center font-bold font-poppins bg-white">✕</button>
                  </div>

                  <div className="space-y-4 font-poppins">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Product Name *</label>
                        <input type="text" placeholder="e.g. Royal Maroon Saree" value=${prodForm.name} onChange=${(e) => setProdForm({ ...prodForm, name: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none font-semibold text-maroon text-[10px]" required />
                      </div>
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Category *</label>
                        <select value=${prodForm.category} onChange=${(e) => setProdForm({ ...prodForm, category: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none font-semibold text-maroon text-[10px]" required>
                          <option value="designer-blouses">Designer Blouses</option>
                          <option value="ready-made-dresses">Ready Dresses</option>
                          <option value="bridal-collections">Bridal Collection</option>
                          <option value="party-wear-dresses">Party Wear</option>
                          <option value="kids-dresses">Kids Outfits</option>
                          <option value="ethnic-wear">Ethnic Couture</option>
                          <option value="aari-work-blouses">Aari Embroidery</option>
                          <option value="maggam-work-collections">Maggam Crafts</option>
                          <option value="sarees">Pure Sarees</option>
                          <option value="boutique-accessories">Boutique Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Retail Price (₹) *</label>
                        <input type="number" placeholder="e.g. 4500" value=${prodForm.price} onChange=${(e) => setProdForm({ ...prodForm, price: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none font-semibold text-maroon text-[10px]" required />
                      </div>
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Discount (%)</label>
                        <input type="number" placeholder="e.g. 10" value=${prodForm.discount} onChange=${(e) => setProdForm({ ...prodForm, discount: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none font-semibold text-maroon text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Stock Units *</label>
                        <input type="number" placeholder="e.g. 10" value=${prodForm.stock} onChange=${(e) => setProdForm({ ...prodForm, stock: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none font-semibold text-maroon text-[10px]" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Sizing Choices (comma separated)</label>
                        <input type="text" placeholder="XS, S, M, L, XL" value=${prodForm.sizes} onChange=${(e) => setProdForm({ ...prodForm, sizes: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none text-[10px]" />
                      </div>
                      <div>
                        <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Colors/Shades (comma separated)</label>
                        <input type="text" placeholder="Red, Gold, Green" value=${prodForm.colors} onChange=${(e) => setProdForm({ ...prodForm, colors: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none text-[10px]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Fabric & Care Details *</label>
                      <input type="text" placeholder="e.g. Pure Georgette fabric base, dry clean only" value=${prodForm.fabric} onChange=${(e) => setProdForm({ ...prodForm, fabric: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-3 py-2.5 focus:outline-none text-[10px] text-maroon font-semibold" required />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-3">
                        <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[8px]">Select Atelier Stock Image Preset:</label>
                      </div>
                      <button type="button" onClick=${() => setProdForm({ ...prodForm, image: './assets/designer-blouse.png' })} className=${`p-2 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${prodForm.image === './assets/designer-blouse.png' ? 'border-gold bg-maroon/5' : 'border-maroon/10'}`}>
                        <img src="./assets/designer-blouse.png" className="w-8 h-8 object-cover rounded" />
                        <span className="text-[7px] uppercase font-bold text-maroon">Blouse Outlines</span>
                      </button>
                      <button type="button" onClick=${() => setProdForm({ ...prodForm, image: './assets/aari-detail.png' })} className=${`p-2 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${prodForm.image === './assets/aari-detail.png' ? 'border-gold bg-maroon/5' : 'border-maroon/10'}`}>
                        <img src="./assets/aari-detail.png" className="w-8 h-8 object-cover rounded" />
                        <span className="text-[7px] uppercase font-bold text-maroon">Zardozi Motifs</span>
                      </button>
                      <button type="button" onClick=${() => setProdForm({ ...prodForm, image: './assets/hero-bridal.png' })} className=${`p-2 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${prodForm.image === './assets/hero-bridal.png' ? 'border-gold bg-maroon/5' : 'border-maroon/10'}`}>
                        <img src="./assets/hero-bridal.png" className="w-8 h-8 object-cover rounded" />
                        <span className="text-[7px] uppercase font-bold text-maroon">Bridal Lehenga</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-maroon font-bold mb-1 uppercase tracking-wide text-[8px]">Catalog Description *</label>
                      <textarea placeholder="Describe outfit style, zari spools details..." value=${prodForm.description} onChange=${(e) => setProdForm({ ...prodForm, description: e.target.value })} className="w-full bg-cream/30 border border-maroon/10 rounded-xl p-3 focus:outline-none text-[10px] h-16 text-maroon font-semibold" required></textarea>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-maroon/5 flex justify-end gap-3 text-[10px]">
                    <button type="button" onClick=${() => setEditingProduct(null)} className="font-poppins uppercase tracking-widest font-bold border border-maroon/20 hover:bg-cream px-6 py-3.5 rounded-full transition-all">Cancel</button>
                    <button type="submit" className="font-poppins uppercase tracking-widest font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon border border-maroon hover:border-gold px-8 py-3.5 rounded-full transition-all shadow-luxury">Save Product Specs</button>
                  </div>
                </form>
              </div>
            `}
          </div>
        `}

      </main>

    </div>
  `;
};

// --- Fallback additional pages inside master app to avoid split loading failures ---
const BridalPage = ({ setCurrentPage }) => html`
  <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in text-maroon">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">bridal couture</span>
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Luxury Bridal collections</h1>
        <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
      </div>
      <div className="bg-maroon text-white rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gold/25 shadow-glow mb-12">
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="font-poppins text-[9px] uppercase tracking-widest text-gold font-bold">Atelier Masterpieces</span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white">Handcrafted Royal Bridal Blouses</h2>
            <p className="font-poppins text-xs leading-relaxed text-white/80">Each wedding blouse back neck is an individual canvas, hand-sketched and stitched using fine zari threads, pearls, and kundan stones by traditional frame masters.</p>
          </div>
          <button onClick=${() => { setCurrentPage('booking'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-8 py-3.5 rounded-full border border-gold hover:bg-white hover:text-maroon transition-all shadow-luxury w-full sm:w-auto text-center">Book Consultation Slot</button>
        </div>
        <div className="lg:col-span-5 h-[300px] lg:h-auto min-h-[300px] relative"><img src="./assets/hero-bridal.png" className="absolute inset-0 w-full h-full object-cover" /></div>
      </div>
    </div>
  </section>
`;

const AariWorkPage = ({ setCurrentPage }) => html`
  <div className="pt-[50px] animate-fade-in">
    <${AariShowcase} setCurrentPage=${setCurrentPage} />
    <section className="py-24 bg-white text-maroon">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">Artisanal detailings</span>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold">Atelier Embroidery Categories</h3>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins text-xs text-maroon/80 leading-relaxed">
          <div className="bg-cream-soft rounded-2xl p-6 border border-maroon/5 space-y-2">
            <h4 className="font-playfair text-base font-bold text-maroon">1. Traditional Zardosi work</h4>
            <p>Antique Persian embroidery stitching gold coiled spring wires to build dimensional flowers, leaf panels, and royal peacock borders.</p>
          </div>
          <div className="bg-cream-soft rounded-2xl p-6 border border-maroon/5 space-y-2">
            <h4 className="font-playfair text-base font-bold text-maroon">2. Glass stone Kundan Settings</h4>
            <p>Soldered metallic glass stones and crystals set directly inside borders to gleam under boutique spotlights.</p>
          </div>
        </div>
        <div className="text-center pt-8">
          <button onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }} className="font-poppins text-xs uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon border border-gold px-8 py-4 rounded-full transition-all">Configure Blouse Online</button>
        </div>
      </div>
    </section>
  </div>
`;

// --- 4.8.0 WISHLIST CABINET VIEW ---
const WishlistPage = ({ setCurrentPage, onCartOpen }) => {
  const [wishlist, setWishlist] = React.useState(BoutiqueDB.getWishlist());
  const [products, setProducts] = React.useState(BoutiqueDB.getProducts());

  const reloadWishlist = () => {
    setWishlist(BoutiqueDB.getWishlist());
    setProducts(BoutiqueDB.getProducts());
  };

  const wishlistedItems = products.filter(p => wishlist.includes(p.id));

  const handleRemove = (productId) => {
    BoutiqueDB.toggleWishlist(productId);
    reloadWishlist();
  };

  const handleMoveToBag = (product) => {
    BoutiqueDB.addToCart(product, 1);
    BoutiqueDB.toggleWishlist(product.id);
    reloadWishlist();
    if (onCartOpen) onCartOpen();
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in text-maroon font-poppins text-xs">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-poppins text-xs tracking-[0.2em] text-gold uppercase block">My Saved Couture</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">My Wishlist</h1>
          <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
        </div>

        ${wishlistedItems.length === 0 
          ? html`
              <div className="bg-white rounded-3xl p-16 text-center border border-maroon/5 shadow-luxury space-y-6 max-w-lg mx-auto animate-fade-in">
                <span className="text-5xl block">❤️</span>
                <h3 className="font-playfair text-xl font-bold">Your Wishlist is Empty</h3>
                <p className="text-maroon/60 leading-relaxed text-xs">
                  Discover ready-made designer blouses, royal wedding lehengas, and ethnic kid-wear. Save your favorites here to explore later!
                </p>
                <button 
                  onClick=${() => { setCurrentPage('shop'); window.scrollTo(0,0); }} 
                  className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-8 py-3.5 rounded-full hover:bg-maroon hover:text-gold transition-all shadow-luxury"
                >
                  Start Exploring
                </button>
              </div>
            `
          : html`
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                ${wishlistedItems.map(p => html`
                  <div key=${p.id} className="bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow relative">
                    <button 
                      onClick=${() => handleRemove(p.id)} 
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-maroon/10 text-red-500 hover:bg-red-50 flex items-center justify-center font-bold transition-all shadow-md"
                      title="Remove from wishlist"
                    >
                      ✕
                    </button>
                    <span className="absolute top-4 left-4 z-10 bg-maroon/80 text-gold text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-gold/15">
                      ${p.category.replace(/-/g, ' ')}
                    </span>
                    <div className="h-64 bg-cream flex items-center justify-center overflow-hidden relative border-b border-maroon/5">
                      <img src=${p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-maroon/50 font-semibold">
                          <span>${p.rating} ⭐</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">${p.stock} left</span>
                        </div>
                        <h3 className="font-playfair text-base font-bold group-hover:text-gold transition-colors leading-tight truncate">${p.name}</h3>
                        <p className="text-[10px] text-maroon/60 leading-relaxed line-clamp-2">${p.description}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between font-playfair font-bold text-base">
                          <span>Price:</span>
                          <div className="flex items-center space-x-1.5">
                            ${p.discount > 0 && html`<span className="text-maroon/30 line-through text-xs">₹${(p.price * 100 / (100 - p.discount)).toFixed(0)}</span>`}
                            <span className="text-gold">₹${p.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button 
                            onClick=${() => handleMoveToBag(p)} 
                            className="font-poppins text-[9px] uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-3 rounded-full border border-maroon hover:border-gold transition-all text-center shadow-luxury"
                          >
                            Add to Bag
                          </button>
                          <button 
                            onClick=${() => { setCurrentPage('customizer'); window.scrollTo(0,0); }} 
                            className="font-poppins text-[9px] uppercase font-bold bg-white text-maroon hover:bg-maroon hover:text-gold py-3 rounded-full border border-maroon transition-all text-center"
                          >
                            Custom Fit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `)}
              </div>
            `
        }
      </div>
    </section>
  `;
};

// --- 4.8.1 FORGOT PASSWORD VIEW ---
const ForgotPasswordPage = ({ setCurrentPage }) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Password reset simulation email dispatched successfully to: ${email}`);
    setCurrentPage('login');
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] flex items-center justify-center animate-fade-in text-maroon font-poppins text-xs">
      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-maroon to-gold"></div>
          
          <div className="text-center space-y-2">
            <span className="font-playfair text-xl font-bold text-gold bg-maroon/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto">M</span>
            <h2 className="font-playfair text-2xl font-bold">Reset Password</h2>
            <p className="text-maroon/60">Enter your email address to receive secure reset parameters</p>
          </div>

          <form onSubmit=${handleSubmit} className="space-y-4">
            <div>
              <label className="block text-maroon font-bold mb-2 uppercase tracking-wide text-[9px]">Email Address</label>
              <input type="email" placeholder="Enter email" value=${email} onChange=${(e) => setEmail(e.target.value)} className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none text-xs focus:border-gold" required />
            </div>
            <button type="submit" className="w-full font-poppins text-xs uppercase font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury">
              Send Reset Link
            </button>
            <button type="button" onClick=${() => setCurrentPage('login')} className="w-full text-center text-maroon/50 hover:text-maroon underline pt-2 block font-semibold text-[10px]">
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
};

// --- 4.8.2 CUSTOMER PROFILE CABINET VIEW ---
const ProfilePage = ({ currentUser, setCurrentPage, setCurrentUser, onCartOpen }) => {
  const [activeTab, setActiveTab] = React.useState('orders');
  const [profile, setProfile] = React.useState(null);
  const [measureForm, setMeasureForm] = React.useState(null);

  React.useEffect(() => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }
    const customers = BoutiqueDB.getCustomers();
    let record = customers.find(c => c.email.toLowerCase() === currentUser.email.toLowerCase());
    if (!record) {
      record = {
        id: 'cust-temp',
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '9840100000',
        notes: 'Newly registered customer profile.',
        measurements: {
          chest: 36, waist: 30, blouseLength: 14.5, shoulder: 14.0, frontNeck: 7.0, backNeck: 8.5, sleeveLength: 10.5, sleeveRound: 11.0, armHole: 15.5
        }
      };
    }
    setProfile(record);
    setMeasureForm({ ...record.measurements });
  }, [currentUser]);

  if (!profile) return html`<div className="min-h-screen pt-[120px] text-center font-poppins text-xs text-maroon">Loading couture file...</div>`;

  const orders = BoutiqueDB.getOrders().filter(o => o.phone === profile.phone || o.customerId === profile.id);
  const stitchingOrders = orders.filter(o => !o.stitchingItem.includes('(E-Commerce Purchase)'));
  const purchasedOrders = orders.filter(o => o.stitchingItem.includes('(E-Commerce Purchase)'));
  const appointments = BoutiqueDB.getAppointments().filter(a => a.phone === profile.phone || a.email === profile.email);

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    if (profile.id !== 'cust-temp') {
      BoutiqueDB.updateCustomerMeasurements(profile.id, measureForm);
    }
    alert('Dynamic sizing profile persisted successfully!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const getStatusBubble = (status) => {
    const bubbles = {
      'Pending': 'bg-rose-50 border-rose-200 text-rose-700',
      'Measuring': 'bg-sky-50 border-sky-200 text-sky-700',
      'Cutting': 'bg-purple-50 border-purple-200 text-purple-700',
      'Embroidery': 'bg-pink-50 border-pink-200 text-pink-700',
      'Stitching': 'bg-indigo-50 border-indigo-200 text-indigo-700',
      'Trial': 'bg-amber-50 border-amber-200 text-amber-700',
      'Completed': 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    return bubbles[status] || 'bg-slate-50 text-slate-700';
  };

  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] text-maroon font-poppins text-xs">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury space-y-6 self-start">
          <div className="flex items-center space-x-3 pb-6 border-b border-maroon/10">
            <div className="w-10 h-10 rounded-full bg-maroon text-gold flex items-center justify-center font-playfair font-bold text-lg border border-gold/30">
              ${profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-playfair text-base font-bold text-maroon leading-tight">${profile.name}</h4>
              <span className="text-[10px] text-maroon/50 block">${profile.email}</span>
            </div>
          </div>

          <nav className="flex flex-col space-y-2 uppercase tracking-wider font-semibold text-[10px]">
            <button onClick=${() => setActiveTab('orders')} className=${`w-full text-left p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-maroon text-gold shadow-luxury' : 'hover:bg-maroon-soft text-maroon'}`}>
              ✂ Stitching Orders (${stitchingOrders.length})
            </button>
            <button onClick=${() => setActiveTab('purchases')} className=${`w-full text-left p-3 rounded-xl transition-all ${activeTab === 'purchases' ? 'bg-maroon text-gold shadow-luxury' : 'hover:bg-maroon-soft text-maroon'}`}>
              🛍️ Boutique Purchases (${purchasedOrders.length})
            </button>
            <button onClick=${() => setActiveTab('shop')} className=${`w-full text-left p-3 rounded-xl transition-all ${activeTab === 'shop' ? 'bg-maroon text-gold shadow-luxury' : 'hover:bg-maroon-soft text-maroon'}`}>
              🛍️ Shop Boutique Outfits
            </button>
            <button onClick=${() => setActiveTab('appointments')} className=${`w-full text-left p-3 rounded-xl transition-all ${activeTab === 'appointments' ? 'bg-maroon text-gold shadow-luxury' : 'hover:bg-maroon-soft text-maroon'}`}>
              📅 Bookings Queue (${appointments.length})
            </button>
            <button onClick=${() => setActiveTab('measurements')} className=${`w-full text-left p-3 rounded-xl transition-all ${activeTab === 'measurements' ? 'bg-maroon text-gold shadow-luxury' : 'hover:bg-maroon-soft text-maroon'}`}>
              📏 My Sizing Card
            </button>
          </nav>
 
          <button onClick=${handleLogout} className="w-full font-bold uppercase tracking-widest text-[9px] border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors">
            Sign Out Session
          </button>
        </aside>
 
        <main className="lg:col-span-9 space-y-8">
          
          ${activeTab === 'orders' && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-playfair text-2xl font-bold">My Stitching Orders</h3>
                <p className="text-maroon/60 mt-1">Real-time status queue updates for your custom boutique creations.</p>
              </div>
 
              ${stitchingOrders.length === 0 
                ? html`
                    <div className="bg-white rounded-3xl p-12 text-center border border-maroon/5 shadow-luxury space-y-4">
                      <span className="text-4xl block">✂</span>
                      <h4 className="font-playfair text-lg font-bold">No custom orders found</h4>
                      <p className="text-maroon/60 max-w-sm mx-auto">Create a customized designer blouse to submit your first tailoring ticket or browse our ready-made boutique fashion catalog.</p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <button onClick=${() => setCurrentPage('customizer')} className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-6 py-3.5 rounded-full hover:bg-maroon hover:text-gold transition-all shadow-luxury w-full sm:w-auto text-center">Start Designing Now</button>
                        <button onClick=${() => setActiveTab('shop')} className="font-semibold uppercase tracking-widest bg-white text-maroon border border-maroon/20 px-6 py-3.5 rounded-full hover:bg-maroon hover:text-gold transition-all w-full sm:w-auto text-center">Shop Ready-made Outfits</button>
                      </div>
                    </div>
                  `
                : html`
                    <div className="space-y-4">
                      ${stitchingOrders.map(o => html`
                        <div key=${o.id} className="bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2 flex-grow">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-maroon/40 font-bold">${o.id}</span>
                              <span className=${`border font-bold uppercase tracking-wider text-[8px] px-3 py-1 rounded-full ${getStatusBubble(o.status)}`}>
                                ${o.status}
                              </span>
                            </div>
                            <h4 className="font-playfair text-lg font-bold">${o.stitchingItem}</h4>
                            <div className="text-[10px] text-maroon/60 flex flex-wrap gap-4 pt-1">
                              <span>Neck: <strong>${o.neckStyle}</strong></span>
                              <span>Sleeve: <strong>${o.sleeveStyle}</strong></span>
                              <span>Embroidery: <strong>${o.embroideryStyle}</strong></span>
                            </div>
                            ${o.dueDate && html`<span className="text-gold font-semibold text-[10px] block pt-2">📅 Target Delivery: ${o.dueDate}</span>`}
                          </div>
                          <div className="shrink-0 text-left md:text-right border-t md:border-t-0 border-maroon/5 pt-4 md:pt-0 w-full md:w-auto flex justify-between md:flex-col items-center md:items-end gap-2">
                            <div>
                              <span className="text-[10px] text-maroon/40 block">Est. Cost</span>
                              <span className="font-playfair text-lg font-bold text-maroon">₹${o.cost.toLocaleString()}</span>
                            </div>
                            <span className="font-semibold text-gold text-[9px] uppercase">Artisan: ${o.staffAssigned || 'Assigning...'}</span>
                          </div>
                        </div>
                      `)}
                    </div>
                  `
              }
            </div>
          `}

          ${activeTab === 'purchases' && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-playfair text-2xl font-bold">My Boutique Purchases</h3>
                <p className="text-maroon/60 mt-1">Dresses and tailoring craft kits purchased from our dynamic catalog.</p>
              </div>

              ${purchasedOrders.length === 0 
                ? html`
                    <div className="bg-white rounded-3xl p-12 text-center border border-maroon/5 shadow-luxury space-y-4">
                      <span className="text-4xl block">🛍️</span>
                      <h4 className="font-playfair text-lg font-bold">No product purchases yet</h4>
                      <p className="text-maroon/60 max-w-sm mx-auto">Explore our high-fashion ethnic collection and craft spools online.</p>
                      <button onClick=${() => { setCurrentPage('shop'); window.scrollTo(0,0); }} className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-6 py-3 rounded-full hover:bg-maroon hover:text-gold transition-all">Go to Boutique Store</button>
                    </div>
                  `
                : html`
                    <div className="space-y-4">
                      ${purchasedOrders.map(o => html`
                        <div key=${o.id} className="bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2 flex-grow">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-maroon/40 font-bold">Order ID: ${o.id}</span>
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider text-[8px] px-3 py-1 rounded-full">
                                Ready / Packing
                              </span>
                            </div>
                            <h4 className="font-playfair text-lg font-bold text-maroon-light">${o.stitchingItem.replace(' (E-Commerce Purchase)', '')}</h4>
                            <p className="text-[10px] text-maroon/60 leading-relaxed pt-1">${o.fabricNotes}</p>
                          </div>
                          <div className="shrink-0 text-left md:text-right border-t md:border-t-0 border-maroon/5 pt-4 md:pt-0 w-full md:w-auto flex justify-between md:flex-col items-center md:items-end gap-2 font-poppins">
                            <div>
                              <span className="text-[10px] text-maroon/40 block">Amount Paid</span>
                              <span className="font-playfair text-lg font-bold text-emerald-700">₹${o.cost.toLocaleString()}</span>
                            </div>
                            <span className="font-semibold text-gold text-[9px] uppercase">Shipping Express</span>
                          </div>
                        </div>
                      `)}
                    </div>
                  `
              }

              <!-- Direct Boutique Buying Grid inside Cabinet Purchases Tab -->
              <div className="pt-8 border-t border-maroon/10 mt-10 space-y-6">
                <div>
                  <h3 className="font-playfair text-xl font-bold flex items-center space-x-2">
                    <span>✨</span> <span>Shop Atelier Collections</span>
                  </h3>
                  <p className="text-maroon/60 mt-1">Acquire premium girls' ethnic dresses and tailoring crafts directly from your client cabinet dashboard.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  ${BoutiqueDB.getProducts().slice(0, 3).map(p => html`
                    <div key=${p.id} className="bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-glow transition-all duration-300 relative p-4">
                      <div className="relative h-44 rounded-2xl overflow-hidden bg-cream mb-4">
                        <img src=${p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 left-3 bg-maroon/80 text-gold text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-gold/15">
                          ${p.category === 'girls-couture' ? "Girls' Dress" : "Craft"}
                        </span>
                      </div>
                      <div className="space-y-2 flex-grow mb-4">
                        <div className="flex items-center justify-between text-[8px] text-maroon/50 font-semibold">
                          <span>${p.rating} ⭐</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">${p.stock} left</span>
                        </div>
                        <h4 className="font-playfair text-sm font-bold text-maroon leading-tight truncate">${p.name}</h4>
                        <p className="text-[9px] text-maroon/60 line-clamp-2 leading-relaxed">${p.description}</p>
                      </div>
                      <div className="pt-3 border-t border-maroon/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-maroon/40 font-bold uppercase">Price</span>
                          <span className="font-playfair font-bold text-gold text-sm">₹${p.price.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick=${() => {
                            BoutiqueDB.addToCart(p, 1);
                            if (onCartOpen) onCartOpen();
                          }} 
                          className="font-poppins text-[8px] uppercase tracking-widest font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon px-4 py-2 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          `}

          ${activeTab === 'shop' && html`
            <div className="space-y-6 animate-fade-in text-maroon font-poppins text-xs">
              <div>
                <h3 className="font-playfair text-2xl font-bold">Shop Atelier Collections</h3>
                <p className="text-maroon/60 mt-1">Acquire premium designer blouses, heavy bridal wear, ready-made outfits, and luxury boutique accessories directly from your client dashboard.</p>
              </div>

              <!-- Product Buying Grid inside Cabinet Shop Tab -->
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                ${BoutiqueDB.getProducts().map(p => {
                  return html`
                    <div 
                      key=${p.id} 
                      onClick=${() => {
                        window.dispatchEvent(new CustomEvent('open-detail-modal', { detail: p }));
                      }}
                      className="bg-white rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden flex flex-col justify-between group hover:shadow-glow transition-all duration-300 relative p-4 cursor-pointer animate-fade-in"
                    >
                      <!-- Discount Badge -->
                      ${p.discount > 0 && html`
                        <span className="absolute top-6 left-6 z-10 bg-rose-50 border border-rose-100 text-rose-700 text-[8px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          ${p.discount}% OFF
                        </span>
                      `}

                      <div className="relative h-44 rounded-2xl overflow-hidden bg-cream mb-4 border border-maroon/5">
                        <img src=${p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 right-3 bg-maroon/80 text-gold text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-gold/15">
                          ${p.category.replace(/-/g, ' ')}
                        </span>
                      </div>

                      <div className="space-y-2 flex-grow mb-4">
                        <div className="flex items-center justify-between text-[8px] text-maroon/50 font-bold">
                          <span>${p.rating} ⭐</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">${p.stock} units left</span>
                        </div>
                        <h4 className="font-playfair text-sm font-bold text-maroon leading-tight truncate group-hover:text-gold transition-colors">${p.name}</h4>
                        <p className="text-[9px] text-maroon/60 line-clamp-2 leading-relaxed">${p.description}</p>
                      </div>

                      <div className="pt-3 border-t border-maroon/5 flex items-center justify-between" onClick=${(e) => e.stopPropagation()}>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-maroon/40 font-bold uppercase">Price</span>
                          <span className="font-playfair font-bold text-gold text-sm">₹${p.price.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick=${() => {
                            BoutiqueDB.addToCart(p, 1);
                            if (onCartOpen) onCartOpen();
                          }} 
                          className="font-poppins text-[8px] uppercase tracking-widest font-bold bg-maroon text-gold hover:bg-gold hover:text-maroon px-4 py-2 rounded-full border border-maroon hover:border-gold transition-all shadow-luxury"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  `;
                })}
              </div>
            </div>
          `}

          ${activeTab === 'appointments' && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-playfair text-2xl font-bold">My Showroom Bookings</h3>
                <p className="text-maroon/60 mt-1">Calendar times booked for measurement fitting trials.</p>
              </div>

              ${appointments.length === 0 
                ? html`
                    <div className="bg-white rounded-3xl p-12 text-center border border-maroon/5 shadow-luxury space-y-4">
                      <span className="text-4xl block">📅</span>
                      <h4 className="font-playfair text-lg font-bold">No showroom slots scheduled</h4>
                      <p className="text-maroon/60 max-w-sm mx-auto">Pick a timing date window to organize design consultations.</p>
                      <button onClick=${() => setCurrentPage('booking')} className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-6 py-3 rounded-full hover:bg-maroon hover:text-gold transition-all">Schedule Slot Now</button>
                    </div>
                  `
                : html`
                    <div className="space-y-4">
                      ${appointments.map(a => html`
                        <div key=${a.id} className="bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-maroon/40 font-bold">${a.id}</span>
                              <span className="bg-gold/10 text-gold-dark font-bold uppercase tracking-wider text-[8px] px-3.5 py-1 rounded-full border border-gold/20">${a.status}</span>
                            </div>
                            <h4 className="font-playfair text-lg font-bold">${a.type}</h4>
                            <p className="text-gold font-semibold text-[10px] pt-1">📅 Scheduled Date: ${a.date} at ${a.time}</p>
                            ${a.notes && html`<p className="text-[10px] text-maroon/40 italic block mt-1">Notes: "${a.notes}"</p>`}
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <a href=${`https://wa.me/919840123456?text=${encodeURIComponent(`Hello Mahathi! Querying booking ${a.id} scheduled for ${a.date} at ${a.time}.`)}`} target="_blank" className="font-poppins text-[10px] uppercase font-bold tracking-widest border border-maroon/15 px-4 py-2.5 rounded-full hover:bg-maroon hover:text-gold transition-all">WhatsApp Enquiry</a>
                          </div>
                        </div>
                      `)}
                    </div>
                  `
              }
            </div>
          `}

          ${activeTab === 'measurements' && html`
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-playfair text-2xl font-bold">My Personal Sizing Card</h3>
                <p className="text-maroon/60 mt-1">Archive exact sizing values recorded for your ethnic fits.</p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury">
                <form onSubmit=${handleSaveMeasurements} className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    ${['chest', 'waist', 'blouseLength', 'shoulder', 'frontNeck', 'backNeck', 'sleeveLength', 'sleeveRound', 'armHole'].map(field => html`
                      <div key=${field}>
                        <label className="block text-[9px] uppercase font-bold text-maroon/60 mb-2">${field} (inches)</label>
                        <input 
                          type="number" step="0.25"
                          value=${measureForm[field] || 0}
                          onChange=${(e) => setMeasureForm({ ...measureForm, [field]: Number(e.target.value) })}
                          className="w-full bg-cream/40 border border-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors text-maroon font-semibold"
                        />
                      </div>
                    `)}
                  </div>
                  <div className="pt-6 border-t border-maroon/5 flex justify-end">
                    <button type="submit" className="font-semibold uppercase tracking-widest bg-gold text-maroon border border-gold px-8 py-3.5 rounded-full hover:bg-maroon hover:text-gold transition-all shadow-luxury">
                      Update Sizing Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          `}

        </main>
      </div>
    </section>
  `;
};

/* ==========================================================================
   5. CENTRAL ROUTER COORDINATOR (APP SHELL)
   ========================================================================== */
export const App = () => {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [currentUser, setCurrentUser] = React.useState(null); // null, { name, role: 'admin' | 'customer' }
  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = React.useState(null);
  const [dbState, setDbState] = React.useState(BoutiqueDB.getState());
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  React.useEffect(() => {
    return BoutiqueDB.subscribe((state) => {
      setDbState({ ...state });
    });
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Route Views Viewport switcher
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return html`<${HomePage} setCurrentPage=${setCurrentPage} setSelectedCategoryFilter=${setSelectedCategoryFilter} setSelectedServiceFilter=${setSelectedServiceFilter} />`;
      case 'collections':
        return html`<${CollectionsPage} selectedCategoryFilter=${selectedCategoryFilter} setSelectedCategoryFilter=${setSelectedCategoryFilter} />`;
      case 'aari':
        return html`<${AariWorkPage} setCurrentPage=${setCurrentPage} />`;
      case 'bridal':
        return html`<${BridalPage} setCurrentPage=${setCurrentPage} />`;
      case 'services':
        return html`<${ServicesPage} setCurrentPage=${setCurrentPage} setSelectedServiceFilter=${setSelectedServiceFilter} />`;
      case 'shop':
        return html`<${ShopPage} />`;
      case 'gallery':
        return html`
          <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <${InstagramGallery} />
            </div>
          </section>
        `;
      case 'about':
        return html`<${AboutPage} />`;
      case 'contact':
        return html`<${ContactPage} />`;
      case 'booking':
        return html`<${BookingPage} selectedServiceFilter=${selectedServiceFilter} />`;
      case 'customizer':
        return html`<${CustomizerPage} setCurrentPage=${setCurrentPage} />`;
      case 'login':
        return html`<${LoginPage} setCurrentPage=${setCurrentPage} setCurrentUser=${setCurrentUser} />`;
      case 'forgot-password':
        return html`<${ForgotPasswordPage} setCurrentPage=${setCurrentPage} />`;
      case 'wishlist':
        return html`<${WishlistPage} setCurrentPage=${setCurrentPage} onCartOpen=${() => setIsCartOpen(true)} />`;
      case 'profile':
        return html`<${ProfilePage} currentUser=${currentUser} setCurrentPage=${setCurrentPage} setCurrentUser=${setCurrentUser} onCartOpen=${() => setIsCartOpen(true)} />`;
      case 'admin':
        return html`<${AdminPage} setCurrentPage=${setCurrentPage} />`;
      default:
        return html`<div className="min-h-screen flex items-center justify-center p-20 font-playfair text-xl text-maroon">Couture Page Not Found</div>`;
    }
  };

  const isAdmin = currentPage === 'admin';

  return html`
    <${ErrorBoundary}>
      <div className="flex flex-col min-h-screen">
        
        ${!isAdmin && html`
          <${Navbar} 
            currentPage=${currentPage} 
            setCurrentPage=${setCurrentPage} 
            currentUser=${currentUser}
            setCurrentUser=${setCurrentUser}
            onCartOpen=${() => setIsCartOpen(true)}
          />
        `}

        <main className="flex-grow">
          ${renderPage()}
        </main>

        ${!isAdmin && html`
          <${Footer} setCurrentPage=${setCurrentPage} />
        `}

        <${CartDrawer} isOpen=${isCartOpen} onClose=${() => setIsCartOpen(false)} setCurrentPage=${setCurrentPage} />

      </div>
    </${ErrorBoundary}>
  `;
};

export default App;
