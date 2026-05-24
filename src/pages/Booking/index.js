// src/pages/Booking/index.js
import { html } from '../../shared/lib/html.js';
import { AppointmentBooking } from '../../features/AppointmentBooking/index.js';
const React = window.React;

export const BookingPage = ({ selectedServiceFilter }) => {
  return html`
    <section className="py-24 bg-cream/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Boutique Schedule
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-maroon leading-tight">
            Consultation Booking
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs sm:text-sm text-maroon/70">
            Book an appointment for home measurements, boutique design consultations, bridal coordinate planning, or fitting trials.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-luxury border border-maroon/5">
          <${AppointmentBooking} preSelectedService=${selectedServiceFilter} />
        </div>

      </div>
    </section>
  `;
};
export default BookingPage;

