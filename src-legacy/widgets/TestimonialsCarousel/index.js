// src/widgets/TestimonialsCarousel/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Priya Dharshini K.',
      role: 'Bride (Dec 2025)',
      rating: 5,
      text: 'Mahathi Tailor Shop crafted my entire bridal lehenga and reception blouses. The Aari work on my maroon velvet blouse was absolutely magnificent! They did three fittings to ensure it sat like a second skin. All my wedding guests asked about my designer blouse back design. Kalyan Master is an absolute genius!',
      avatar: 'P'
    },
    {
      id: 2,
      name: 'Sushmitha Sen',
      role: 'Fashion Designer',
      rating: 5,
      text: 'I always recommend Mahathi to my premium clients. Their pattern cutters understand neck drops perfectly. The home measurement master was so polite, she recorded everything meticulously. They deliver what they promise. Their zardosi embroidery finish is extremely clean, without any rough threads.',
      avatar: 'S'
    },
    {
      id: 3,
      name: 'Ananya Krishnan',
      role: 'Boutique Customer',
      rating: 5,
      text: 'I had alterations done on two Kanchipuram sarees and ordered a custom designer high-neck blouse. The fit is phenomenal! It is extremely hard to find tailors who understand comfort and luxury simultaneously. The pricing is very reasonable for this quality of handcraft.',
      avatar: 'A'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return html`
    <section className="py-24 bg-cream/30 relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block mb-3">
            Bridal Testimonials
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-maroon mb-6 leading-tight">
            Client Experiences
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto relative px-8 sm:px-12 py-10 rounded-3xl bg-white border border-maroon/5 shadow-luxury">
          
          <span className="absolute top-6 left-8 font-playfair text-7xl text-gold/15 select-none">“</span>

          <div className="min-h-[220px] flex flex-col justify-between text-center sm:text-left">
            <div className="space-y-6">
              
              <div className="flex items-center justify-center sm:justify-start space-x-1 text-gold">
                ${Array.from({ length: reviews[activeIndex].rating }).map((_, i) => html`
                  <span key=${i} className="text-lg">★</span>
                `)}
              </div>

              <p className="font-playfair text-base sm:text-lg md:text-xl text-maroon/90 italic leading-relaxed">
                "${reviews[activeIndex].text}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t border-maroon/5 mt-8">
              <div className="w-12 h-12 rounded-full bg-maroon text-gold flex items-center justify-center font-playfair font-bold text-lg border border-gold/30">
                ${reviews[activeIndex].avatar}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-poppins text-sm font-semibold text-maroon">
                  ${reviews[activeIndex].name}
                </h4>
                <p className="font-poppins text-xs text-gold">
                  ${reviews[activeIndex].role}
                </p>
              </div>
            </div>

          </div>

          <button 
            onClick=${handlePrev}
            className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-maroon hover:bg-gold text-gold hover:text-maroon flex items-center justify-center shadow-luxury border border-gold/20 hover:border-maroon transition-all duration-300"
            aria-label="Previous review"
          >
            ←
          </button>
          
          <button 
            onClick=${handleNext}
            className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-maroon hover:bg-gold text-gold hover:text-maroon flex items-center justify-center shadow-luxury border border-gold/20 hover:border-maroon transition-all duration-300"
            aria-label="Next review"
          >
            →
          </button>

          <div className="flex items-center justify-center space-x-2.5 mt-8 pt-4">
            ${reviews.map((_, idx) => html`
              <button
                key=${idx}
                onClick=${() => setActiveIndex(idx)}
                className=${`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-gold' : 'bg-maroon/20'
                }`}
                aria-label=${`Go to review ${idx + 1}`}
              ></button>
            `)}
          </div>

        </div>

      </div>
    </section>
  `;
};
export default TestimonialsCarousel;

