'use client';

// src/app/dashboard/page.tsx
import React from 'react';
import { useBoutique } from '../providers';
import { Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export default function MyProfileTab() {
  const { currentUser } = useBoutique();

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-maroon/5 shadow-luxury space-y-8 animate-fade-in">
      <div className="border-b border-maroon/5 pb-4">
        <h3 className="font-playfair text-xl sm:text-2xl font-bold">Client Account Profile</h3>
        <p className="font-poppins text-xs text-maroon/60">Manage your credentials and styling options.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-poppins text-xs">
        <div className="p-4 bg-[#FFF8F0]/30 rounded-2xl border border-gold/10 flex items-start space-x-3">
          <Mail className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-maroon/40 uppercase text-[9px] block font-semibold mb-1">Email Address</span>
            <strong className="text-sm font-semibold">{currentUser.email}</strong>
          </div>
        </div>

        <div className="p-4 bg-[#FFF8F0]/30 rounded-2xl border border-gold/10 flex items-start space-x-3">
          <Phone className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-maroon/40 uppercase text-[9px] block font-semibold mb-1">Contact Mobile</span>
            <strong className="text-sm font-semibold">{currentUser.phone || 'Not Provided'}</strong>
          </div>
        </div>

        <div className="p-4 bg-[#FFF8F0]/30 rounded-2xl border border-gold/10 flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-maroon/40 uppercase text-[9px] block font-semibold mb-1">Joined Date</span>
            <strong className="text-sm font-semibold">{currentUser.joined_date || 'Est. 2026'}</strong>
          </div>
        </div>

        <div className="p-4 bg-[#FFF8F0]/30 rounded-2xl border border-gold/10 flex items-start space-x-3">
          <UserCheck className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-maroon/40 uppercase text-[9px] block font-semibold mb-1">Account Role</span>
            <strong className="text-sm font-semibold capitalize">{currentUser.role}</strong>
          </div>
        </div>
      </div>

      {currentUser.notes && (
        <div className="bg-[#FFF8F0]/20 rounded-2xl p-6 border border-maroon/5 space-y-3 font-poppins text-xs">
          <h4 className="font-playfair text-sm font-bold">Studio Styling Notes:</h4>
          <p className="text-maroon/70 leading-relaxed italic">{currentUser.notes}</p>
        </div>
      )}

      <div className="bg-[#FFF8F0]/30 p-6 rounded-2xl border border-gold/15 text-center">
        <span className="text-2xl block mb-2">📐</span>
        <h4 className="font-playfair text-base font-bold">Flawless Sizing Measurements</h4>
        <p className="font-poppins text-[10px] text-maroon/60 leading-relaxed mb-4 max-w-sm mx-auto">
          Ensure your garments are cut with precision. Update your sizing guide variables before placing coordinate stitching orders.
        </p>
        <Link href="/dashboard/measurements" className="font-poppins text-[9px] uppercase tracking-widest font-bold bg-gold text-maroon px-5 py-2.5 rounded-full border border-gold hover:bg-maroon hover:text-gold transition-all duration-300">
          Configure Sizing variables
        </Link>
      </div>

    </div>
  );
}
// Helper link
import Link from 'next/link';
