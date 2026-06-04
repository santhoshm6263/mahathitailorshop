'use client';

// src/app/dashboard/appointments/page.tsx
import React from 'react';
import { useBoutique } from '../../providers';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function AppointmentHistoryTab() {
  const { appointments, currentUser } = useBoutique();

  if (!currentUser) return null;

  // Filter appointments for this user
  const customerApts = appointments.filter(
    apt => apt.phone === currentUser.phone || apt.user_id === currentUser.id
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-8 animate-fade-in text-maroon">
      <div className="border-b border-maroon/5 pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Booking History</h3>
          <p className="font-poppins text-xs text-maroon/60">Track your fitting and measurement consultations.</p>
        </div>
        <Calendar className="w-8 h-8 text-gold" />
      </div>

      {customerApts.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <span className="text-4xl block">📅</span>
          <h4 className="font-playfair text-lg font-bold">No Bookings Scheduled</h4>
          <p className="font-poppins text-xs text-maroon/50 max-w-xs mx-auto">
            You don&apos;t have any scheduled appointments. Book one using our scheduler tool.
          </p>
          <Link href="/booking" className="font-poppins text-xs uppercase tracking-widest font-bold bg-gold text-maroon px-6 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all duration-300 inline-block cursor-pointer">
            Book Appointment Slot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customerApts.map(apt => (
            <div 
              key={apt.id} 
              className="bg-[#FFF8F0]/30 rounded-2xl p-6 border border-maroon/5 space-y-4 hover:shadow-luxury transition-shadow duration-300 relative flex flex-col justify-between"
            >
              
              {/* Type Badge and Status */}
              <div className="flex items-center justify-between">
                <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-gold/25">
                  {apt.type}
                </span>
                
                <span className={`font-poppins text-[9px] uppercase font-bold px-3 py-1 rounded-full border ${
                  apt.status === 'Confirmed' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : apt.status === 'Completed'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : apt.status === 'Cancelled'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  {apt.status}
                </span>
              </div>

              {/* Date / Time */}
              <div className="space-y-2 font-poppins text-xs pt-2">
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-maroon/70">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>{apt.time}</span>
                </div>
                
                {apt.notes && (
                  <p className="text-maroon/50 mt-3 border-t border-maroon/5 pt-3 leading-relaxed italic">
                    Note: &quot;{apt.notes}&quot;
                  </p>
                )}
              </div>

              {/* Actions/Reminders */}
              <div className="border-t border-maroon/5 pt-4 mt-2 flex items-center justify-between font-poppins text-[10px] text-maroon/40 font-bold">
                <span>Ref ID: {apt.id}</span>
                {apt.status === 'Pending' && (
                  <a 
                    href={`https://wa.me/919347001303?text=${encodeURIComponent(`Hello! I have a pending appointment booking "${apt.id}" scheduled for ${apt.date}. Please verify.`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gold hover:text-maroon uppercase"
                  >
                    Ping WhatsApp →
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// Helpers
import Link from 'next/link';
