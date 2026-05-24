// src/features/AppointmentBooking/index.js
import { html } from '../../shared/lib/html.js';
import { BoutiqueDB } from '../../entities/BoutiqueDB.js';
const React = window.React;

export const AppointmentBooking = ({ preSelectedService }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: '',
    type: 'Bridal Consultation', // Boutique Visit, Home Measurement, Bridal Consultation, Trial Appointment
    notes: ''
  });
  
  const [activeAppointments, setActiveAppointments] = React.useState([]);
  const [bookingConfirmed, setBookingConfirmed] = React.useState(null);

  React.useEffect(() => {
    setActiveAppointments(BoutiqueDB.getAppointments());
    if (preSelectedService) {
      setFormData(prev => ({ 
        ...prev, 
        type: preSelectedService.includes('Bridal') ? 'Bridal Consultation' : 'Boutique Visit',
        notes: `Interested in: ${preSelectedService}`
      }));
    }
  }, [preSelectedService]);

  // Standard time slots in boutique
  const availableSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM'
  ];

  // Helper to determine if a specific time slot on a chosen date is already booked
  const isSlotBooked = (date, slot) => {
    if (!date) return false;
    return activeAppointments.some(apt => apt.date === date && apt.time === slot && apt.status !== 'Cancelled');
  };

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.timeSlot) {
      alert('Please fill out all required fields: Name, Phone, Date, and Time Slot.');
      return;
    }

    const newApt = BoutiqueDB.addAppointment({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      time: formData.timeSlot,
      type: formData.type,
      notes: formData.notes
    });

    setBookingConfirmed(newApt);
  };

  const handleWhatsAppShare = () => {
    if (!bookingConfirmed) return;
    const msg = encodeURIComponent(
      `Hello Mahathi Tailor Shop! I have booked an appointment online.\n\n` +
      `*Booking ID:* ${bookingConfirmed.id}\n` +
      `*Name:* ${formData.name}\n` +
      `*Type:* ${formData.type}\n` +
      `*Schedule:* ${formData.date} at ${formData.timeSlot}\n\n` +
      `Please verify and confirm my slot.`
    );
    window.open(`https://wa.me/919840123456?text=${msg}`, '_blank');
    setBookingConfirmed(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      timeSlot: '',
      type: 'Bridal Consultation',
      notes: ''
    });
  };

  // Get current date formatted for date picker min attribute
  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return html`
    <div className="w-full bg-cream-soft rounded-3xl border border-maroon/5 shadow-luxury overflow-hidden p-6 sm:p-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <form onSubmit=${handleSubmitBooking} className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon mb-2">Book Your Appointment</h3>
            <p className="font-poppins text-xs text-maroon/60">Schedule your premium measurement session or bridal consult.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Your Name *</label>
              <input
                type="text"
                placeholder="Enter your name"
                value=${formData.name}
                onChange=${(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Mobile Phone *</label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile"
                value=${formData.phone}
                onChange=${(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value=${formData.email}
                onChange=${(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Consultation Category *</label>
              <select
                value=${formData.type}
                onChange=${(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
                required
              >
                <option value="Bridal Consultation">Bridal Consultation (Free - 45 Mins)</option>
                <option value="Boutique Visit">Regular Measurement Visit (30 Mins)</option>
                <option value="Home Measurement">Home Measurement Visit (Charges: ₹500)</option>
                <option value="Trial Appointment">Finished Outfit Fitting Trial (20 Mins)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Select Date *</label>
              <input
                type="date"
                min=${getMinDate()}
                value=${formData.date}
                onChange=${(e) => handleInputChange('date', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold text-maroon font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-2">Special Stitching Notes</label>
              <input
                type="text"
                placeholder="e.g. Wedding saree coordination notes"
                value=${formData.notes}
                onChange=${(e) => handleInputChange('notes', e.target.value)}
                className="w-full bg-white border border-maroon/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[10px] uppercase tracking-widest text-maroon font-semibold mb-4">Available Time Slots *</label>
            ${!formData.date 
              ? html`<p className="font-poppins text-xs text-maroon/40 italic">Please select a date first to view slot availability.</p>`
              : html`
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    ${availableSlots.map(slot => {
                      const booked = isSlotBooked(formData.date, slot);
                      return html`
                        <div
                          key=${slot}
                          onClick=${() => !booked && handleInputChange('timeSlot', slot)}
                          className=${`p-3.5 rounded-xl border text-center font-poppins text-xs font-semibold cursor-pointer transition-all duration-300 ${
                            booked 
                              ? 'bg-maroon/5 border-maroon/5 text-maroon/20 cursor-not-allowed line-through'
                              : formData.timeSlot === slot
                                ? 'bg-maroon border-maroon text-gold shadow-luxury'
                                : 'bg-white border-maroon/10 hover:border-gold text-maroon hover:bg-cream'
                          }`}
                        >
                          <span>${slot}</span>
                          ${booked && html`<span className="block text-[8px] tracking-wide font-normal uppercase text-maroon/40 mt-1">Booked</span>`}
                        </div>
                      `;
                    })}
                  </div>
                `
            }
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-4 px-8 rounded-full border border-maroon hover:border-gold transition-all duration-300 w-full sm:w-auto"
            >
              Confirm Appointment Slot
            </button>
          </div>
        </form>

        <div className="lg:col-span-4 bg-maroon text-white p-6 sm:p-8 rounded-2xl border border-gold/20 flex flex-col justify-between relative overflow-hidden shadow-luxury">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(gold_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="space-y-6 relative z-10">
            <h4 className="font-playfair text-xl font-semibold text-gold pb-4 border-b border-white/10">Boutique Details</h4>
            
            <div className="space-y-4 font-poppins text-xs">
              <div className="flex items-start space-x-3">
                <span className="text-gold">📍</span>
                <span className="leading-relaxed">No. 14, Pondy Bazaar, T. Nagar, Chennai - 600017</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold">📞</span>
                <span>+91 98401 23456</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold">⏰</span>
                <span>10:00 AM - 09:00 PM</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <h5 className="font-playfair text-base text-gold font-bold">Important Notes:</h5>
              <ul className="space-y-2 font-poppins text-[10px] text-white/80 leading-relaxed list-disc pl-4">
                <li>Home appointments require a direct ₹500 travel allowance, waived off during booking confirm.</li>
                <li>Please bring your saree or fabric coordinate for accurate matching suggestions.</li>
                <li>Trial sessions are 20 mins max to secure delivery slots.</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 relative z-10">
            <span className="font-playfair text-sm text-gold block mb-1 font-bold">Need Immediate Help?</span>
            <p className="font-poppins text-[10px] text-white/70 leading-relaxed mb-3">Reach out to our private bridal designer desk.</p>
            <a 
              href="tel:+919840123456"
              className="font-poppins text-[10px] uppercase tracking-wider text-gold hover:text-white font-bold block transition-colors"
            >
              Call Designer Desk →
            </a>
          </div>

        </div>

      </div>

      ${bookingConfirmed && html`
        <div className="fixed inset-0 bg-maroon-dark/95 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center border border-gold/20 shadow-glow space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center text-3xl mx-auto animate-pulse">
              📅
            </div>

            <div className="space-y-2">
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-maroon">Appointment Scheduled!</h3>
              <p className="font-poppins text-xs text-maroon/70">
                Your consultation slot is recorded with ID: <strong className="text-maroon">${bookingConfirmed.id}</strong>.
              </p>
            </div>

            <div className="w-full border-t border-maroon/5 pt-4 space-y-3 font-poppins text-xs text-maroon/70 text-left">
              <div className="flex justify-between"><span>Customer Name:</span><strong className="text-maroon">${formData.name}</strong></div>
              <div className="flex justify-between"><span>Consultation:</span><strong className="text-maroon">${formData.type}</strong></div>
              <div className="flex justify-between"><span>Scheduled Date:</span><strong className="text-maroon">${formData.date}</strong></div>
              <div className="flex justify-between"><span>Scheduled Time:</span><strong className="text-maroon">${formData.timeSlot}</strong></div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick=${handleWhatsAppShare}
                className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-gold hover:bg-gold-dark text-maroon py-3.5 rounded-full border border-gold transition-colors duration-300"
              >
                Send Confirmation to Shop on WhatsApp
              </button>
              <button 
                onClick=${() => setBookingConfirmed(null)}
                className="w-full font-poppins text-xs uppercase tracking-widest font-semibold bg-transparent hover:bg-maroon/5 text-maroon py-3"
              >
                Book Another Slot
              </button>
            </div>

          </div>
        </div>
      `}

    </div>
  `;
};
export default AppointmentBooking;

