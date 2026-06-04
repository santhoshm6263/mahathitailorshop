'use client';

// src/app/admin/appointments/page.tsx
import React, { useState } from 'react';
import { useBoutique } from '../../providers';
import { 
  Calendar, Search, Clock, Phone, Mail, 
  CheckCircle, XCircle, AlertCircle, RefreshCw, 
  MessageSquare, UserCheck 
} from 'lucide-react';
import { AppointmentStatus } from '../../../shared/types';

export default function AppointmentManagementPage() {
  const { appointments, updateAppointmentStatus, refreshData } = useBoutique();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // WhatsApp confirm message generator
  const sendWhatsAppConfirmation = (apt: any) => {
    const formattedPhone = apt.phone.startsWith('91') ? apt.phone : `91${apt.phone}`;
    const text = encodeURIComponent(
      `Hello ${apt.name},\n\nWe are pleased to inform you that your *${apt.type}* appointment with Mahathi Tailor Shop has been confirmed.\n\n📅 *Date*: ${apt.date}\n⏰ *Time*: ${apt.time}\n📍 *Boutique Address*: Beside MMP Primary School, Mallanur, Kuppam.\n\nWe look forward to styling you. Let us know if you need to reschedule!`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, status);
      alert(`Appointment status updated to ${status}.`);
      refreshData();
    } catch (e) {
      console.error(e);
      alert('Error updating status.');
    }
  };

  // Filter list
  const filteredApts = appointments.filter(apt => {
    const matchesSearch = 
      apt.name.toLowerCase().includes(search.toLowerCase()) ||
      apt.type.toLowerCase().includes(search.toLowerCase()) ||
      (apt.notes && apt.notes.toLowerCase().includes(search.toLowerCase())) ||
      apt.phone.includes(search);

    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-maroon">
      
      {/* Header */}
      <div className="border-b border-maroon/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-playfair text-xl sm:text-2xl font-bold">Consultation Slot Tracker</h3>
          <p className="font-poppins text-xs text-maroon/60">Review bridal bookings, custom sizing schedules, and trial fittings appointments.</p>
        </div>
        <button 
          onClick={refreshData}
          className="font-poppins text-[10px] uppercase font-bold tracking-widest text-gold bg-[#5C061E]/5 hover:bg-maroon hover:text-gold px-4 py-2 rounded-full border border-maroon/10 hover:border-gold transition-all duration-300 flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Calendar</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gold" />
          <input 
            type="text" 
            placeholder="Search by client name, appointment type, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-maroon/10 focus:border-gold outline-none font-poppins text-xs text-maroon"
          />
        </div>

        <div className="flex gap-2">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-full font-poppins text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                statusFilter === status 
                  ? 'bg-maroon text-gold border border-gold shadow-md' 
                  : 'bg-white text-maroon border border-maroon/10 hover:bg-gold/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of consultations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApts.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-16 text-center border border-maroon/5 shadow-luxury">
            <Calendar className="w-12 h-12 text-gold/40 mx-auto mb-3" />
            <h4 className="font-playfair text-base font-bold">No Consultations scheduled</h4>
            <p className="font-poppins text-xs text-maroon/50 mt-1">There are no client bookings under the selected status filter.</p>
          </div>
        ) : (
          filteredApts.map(apt => {
            const isPending = apt.status === 'Pending';
            const isConfirmed = apt.status === 'Confirmed';
            const isCompleted = apt.status === 'Completed';
            const isCancelled = apt.status === 'Cancelled';

            let statusColor = 'bg-gray-100 text-gray-500 border-gray-200';
            if (isPending) statusColor = 'bg-yellow-50 border-yellow-200 text-yellow-700';
            if (isConfirmed) statusColor = 'bg-green-50 border-green-200 text-green-700';
            if (isCancelled) statusColor = 'bg-red-50 border-red-200 text-red-700';

            return (
              <div 
                key={apt.id}
                className="bg-white rounded-2xl p-6 border border-maroon/5 shadow-luxury flex flex-col justify-between space-y-6 hover:border-gold/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold">
                      {apt.type}
                    </span>
                    <h4 className="font-playfair text-base font-bold text-maroon mt-0.5">{apt.name}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${statusColor}`}>
                    {apt.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 font-poppins text-xs text-maroon/70">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gold" />
                    <span>{apt.phone}</span>
                  </div>
                  {apt.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gold" />
                      <span className="break-all">{apt.email}</span>
                    </div>
                  )}

                  {apt.notes && (
                    <div className="p-3 bg-[#FFF8F0]/30 rounded-xl border border-gold/5 mt-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-maroon/40 block mb-1">
                        Client instructions:
                      </span>
                      <p className="italic text-maroon/80 text-[11px] leading-relaxed">
                        "{apt.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-maroon/5 flex flex-wrap items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                      className="inline-flex items-center space-x-1 font-poppins text-[9px] uppercase tracking-widest font-bold bg-green-700 text-gold px-3.5 py-2 rounded-full border border-gold hover:bg-gold hover:text-green-950 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm appointment</span>
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                      className="inline-flex items-center space-x-1 font-poppins text-[9px] uppercase tracking-widest font-bold bg-maroon text-gold px-3.5 py-2 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {(isPending || isConfirmed) && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                      className="inline-flex items-center space-x-1 font-poppins text-[9px] uppercase tracking-widest font-bold bg-white border border-red-200 text-red-700 px-3.5 py-2 rounded-full hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => sendWhatsAppConfirmation(apt)}
                      className="inline-flex items-center space-x-1 font-poppins text-[9px] uppercase tracking-widest font-bold bg-green-50 border border-green-200 text-green-700 px-3.5 py-2 rounded-full hover:bg-green-100 transition-all cursor-pointer ml-auto"
                      title="Send confirmation text via WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Confirmation</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
