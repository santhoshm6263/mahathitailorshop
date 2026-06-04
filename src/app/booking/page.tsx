'use client';

// src/app/booking/page.tsx
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppointmentBooking } from '../../features/AppointmentBooking';

const BookingPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-poppins text-xs font-semibold tracking-[0.25em] text-gold uppercase block">
            Bespoke Scheduling
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon leading-tight">
            Schedule Studio Visit
          </h1>
          <div className="w-12 h-[2px] bg-gold mx-auto"></div>
          <p className="font-poppins text-xs text-maroon/70 max-w-md mx-auto">
            Book your slot for measurements, fitting trials, or a private coordinate consultation with our designer masterRamus. We will confirm details instantly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AppointmentBooking preSelectedService={service} />
        </div>

      </div>
    </section>
  );
};

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-20 font-playfair text-xl text-maroon">
        Loading Atelier Scheduler...
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
