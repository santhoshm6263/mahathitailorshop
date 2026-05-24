// src/widgets/WhyChooseUs/index.js
import { html } from '../../shared/lib/html.js';
const React = window.React;

export const WhyChooseUs = () => {
  const [counts, setCounts] = React.useState({
    legacy: 0,
    outfits: 0,
    artisans: 0,
    rating: 0
  });

  React.useEffect(() => {
    // Elegant counter increment animation on load
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        legacy: Math.min(Math.round((14 / steps) * step), 14),
        outfits: Math.min(Math.round((12000 / steps) * step), 12000),
        artisans: Math.min(Math.round((18 / steps) * step), 18),
        rating: Number(Math.min((4.9 / steps) * step, 4.9).toFixed(1))
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const trustPillars = [
    {
      title: 'Traditional Handcraft',
      desc: 'No machine approximations. 100% of our Aari, Maggam, and Zardosi works are intricately handcrafted with fine needles by second-generation master embroiderers.',
      icon: '✨'
    },
    {
      title: 'Premium Pattern Engineering',
      desc: 'Our pattern cutting masters use exact ergonomic math to sculpt armholes, neck drops, and padding contours for unparalleled comfort and posture alignment.',
      icon: '📐'
    },
    {
      title: 'Bridal Couture Specialists',
      desc: 'Over a decade of experience designing coordinated marriage catalogs, bridesmaids fabrics, and heavy backneck structures that remain pristine throughout your rituals.',
      icon: '👑'
    },
    {
      title: 'Exacting Body Profiling',
      desc: 'We map over 18 individual measurement variables (front/back neck depth, shoulder slope, arm rotation) to archive in your permanent customer boutique profile.',
      icon: '📏'
    },
    {
      title: 'Prompt Delivery Guarantee',
      desc: 'We secure your wedding dates. Orders are processed systematically across production queues and handed over with a complete trial checkout 7 days prior.',
      icon: '📦'
    },
    {
      title: 'Luxury Finishing Touches',
      desc: 'Premium cotton-mulmul interlining, heavy copper-alloy Japanese side zippers, invisible hem stitching, and handcrafted matching fabric latkan hanging tassels.',
      icon: '💎'
    }
  ];

  return html`
    <section className="py-24 bg-maroon-soft relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block mb-3">
            Boutique Credibility
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-maroon mb-6 leading-tight">
            Why Choose Mahathi
          </h2>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          ${trustPillars.map((p, i) => html`
            <div 
              key=${i}
              className="bg-white rounded-2xl p-8 border border-maroon/5 shadow-luxury hover:shadow-gold hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold mb-6 text-xl group-hover:bg-maroon group-hover:text-gold transition-colors duration-300">
                ${p.icon}
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-maroon mb-3 group-hover:text-gold transition-colors duration-300">
                ${p.title}
              </h3>
              <p className="font-poppins text-xs text-maroon/70 leading-relaxed">
                ${p.desc}
              </p>
            </div>
          `)}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-maroon text-gold rounded-3xl p-10 sm:p-12 border border-gold/20 shadow-luxury text-center relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(gold_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="space-y-2 relative z-10">
            <h4 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              ${counts.legacy}+
            </h4>
            <p className="font-poppins text-[10px] sm:text-xs text-gold/80 uppercase tracking-widest">
              Years of Legacy
            </p>
          </div>

          <div className="space-y-2 relative z-10">
            <h4 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              ${counts.outfits.toLocaleString()}+
            </h4>
            <p className="font-poppins text-[10px] sm:text-xs text-gold/80 uppercase tracking-widest">
              Outfits Crafted
            </p>
          </div>

          <div className="space-y-2 relative z-10">
            <h4 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              ${counts.artisans}+
            </h4>
            <p className="font-poppins text-[10px] sm:text-xs text-gold/80 uppercase tracking-widest">
              Master Artisans
            </p>
          </div>

          <div className="space-y-2 relative z-10">
            <h4 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              ${counts.rating} ★
            </h4>
            <p className="font-poppins text-[10px] sm:text-xs text-gold/80 uppercase tracking-widest">
              Client Rating
            </p>
          </div>

        </div>

      </div>
    </section>
  `;
};
export default WhyChooseUs;

