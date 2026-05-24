// src/pages/Contact/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const ContactPage = () => {
  const [inquiry, setInquiry] = React.useState({ name: '', phone: '', email: '', message: '' });
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.phone) return;
    
    // Add a notification alert inside BoutiqueDB so the admin can see it in real-time
    BoutiqueDB.addNotification({
      title: 'New Customer Inquiry Received',
      message: `${inquiry.name} (${inquiry.phone}) sent an inquiry: "${inquiry.message.slice(0, 50)}..."`
    });

    setSuccess(true);
    setInquiry({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return html`
    <section className="py-24 bg-cream/20 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Visit Studio
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            Connect With Our Designers
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury">
            <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-maroon mb-6">Send An Inquiry</h3>
            
            <form onSubmit=${handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value=${inquiry.name}
                    onChange=${(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    placeholder="Your 10-digit phone"
                    value=${inquiry.phone}
                    onChange=${(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                    className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Your email address"
                  value=${inquiry.email}
                  onChange=${(e) => setInquiry({ ...inquiry, email: e.target.value })}
                  className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Message *</label>
                <textarea
                  placeholder="Describe your design requirement, wedding date or styling questions..."
                  value=${inquiry.message}
                  onChange=${(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  className="w-full bg-cream/30 border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold h-32"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-4 rounded-full border border-maroon hover:border-gold transition-all duration-300"
              >
                Send Inquiry Message
              </button>

            </form>

            ${success && html`
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-poppins p-4 rounded-xl mt-6 animate-fade-in text-center">
                ✦ Thank you! Your inquiry was sent to our designer desk. We will reach out within 2 hours.
              </div>
            `}
          </div>

          <div className="lg:col-span-5 space-y-8 font-poppins text-xs text-maroon/80">
            
            <div className="bg-maroon text-white rounded-3xl p-8 border border-gold/20 shadow-luxury space-y-6">
              <h3 className="font-playfair text-xl text-gold font-bold">Atelier Contact</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-gold">📍</span>
                  <span className="leading-relaxed">
                    No. 14, Pondy Bazaar, Near Residency Towers,<br />
                    T. Nagar, Chennai - 600017,<br />
                    Tamil Nadu, India.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gold">📞</span>
                  <span>+91 98401 23456 | +91 44 2434 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gold">✉️</span>
                  <span>contact@mahathitailors.com</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h5 className="font-playfair text-sm text-gold font-bold mb-2">WhatsApp Consult:</h5>
                <a 
                  href="https://wa.me/919840123456" 
                  target="_blank" 
                  className="font-poppins text-[10px] uppercase tracking-wider text-white hover:text-gold font-bold transition-colors"
                >
                  Direct Chat Desk →
                </a>
              </div>
            </div>

            <div className="border border-maroon/5 bg-cream rounded-3xl p-6 h-[200px] flex items-center justify-center text-center relative overflow-hidden shadow-luxury">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(maroon_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="space-y-2 z-10">
                <span className="text-3xl">🗺️</span>
                <h4 className="font-playfair text-base font-bold text-maroon">Flagship Showroom Map</h4>
                <p className="font-poppins text-[10px] text-maroon/60">T. Nagar Chennai Shop Map directions</p>
                <a href="https://maps.google.com" target="_blank" className="text-[10px] font-bold text-gold-dark hover:underline block pt-2">View on Google Maps</a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
};
export default ContactPage;

