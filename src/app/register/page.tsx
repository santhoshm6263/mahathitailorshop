'use client';

// src/app/register/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { supabase } from '../../shared/api/supabase';
import { Lock, Mail, User, Phone, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const { setCurrentUser, addCustomer } = useBoutique();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!name || !email || !phone || !password) {
      setErrorMsg('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    // 1. Supabase real Signup Integration
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone
            }
          }
        });

        if (error) throw error;

        if (data && data.user) {
          // Explicitly add profile row to profiles table, bypassing DB trigger delay or as secondary insert
          const newCust = {
            id: data.user.id,
            name,
            email,
            phone,
            role: 'customer' as const,
            joined_date: new Date().toISOString().split('T')[0]
          };

          await addCustomer(newCust);
          setCurrentUser(newCust);
          router.push('/dashboard');
          return;
        }
      } catch (err: any) {
        console.error('Supabase signup error:', err);
        setErrorMsg(err.message || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    // 2. Simulated LocalStorage Fallback (For Demo / Sandbox)
    setTimeout(async () => {
      const newCust = {
        name,
        email,
        phone,
        role: 'customer' as const,
        joined_date: new Date().toISOString().split('T')[0]
      };

      const res = await addCustomer(newCust);
      setCurrentUser(res);
      router.push('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFF8F0]/30 px-6 py-12 relative overflow-hidden">
      
      {/* Background blur details */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-maroon/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-maroon/5 shadow-luxury space-y-8 relative z-10">
        
        {/* Logo / Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center font-playfair font-bold text-maroon text-sm">M</div>
            <span className="font-playfair text-base font-bold text-maroon uppercase tracking-wide">Mahathi Tailors</span>
          </Link>
          <h2 className="font-playfair text-2xl font-bold text-maroon">
            Create Client Profile
          </h2>
          <p className="font-poppins text-xs text-maroon/50 mt-1">
            Access secure measurement files & order logs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-poppins p-3 rounded-xl flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-1.5">Full Name *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><User className="w-4 h-4" /></span>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-xs px-3 py-2.5 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-1.5">Email Address *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Mail className="w-4 h-4" /></span>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs px-3 py-2.5 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-1.5">Contact Mobile *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Phone className="w-4 h-4" /></span>
              <input 
                type="tel" 
                placeholder="10-digit number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent text-xs px-3 py-2.5 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-1.5">Password *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Lock className="w-4 h-4" /></span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs px-3 py-2.5 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-1.5">Confirm Password *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Lock className="w-4 h-4" /></span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent text-xs px-3 py-2.5 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-3.5 rounded-full border border-maroon hover:border-gold transition-all duration-300 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Profile...' : 'Register Profile'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#5C061E]/5 text-center font-poppins text-xs text-maroon/50">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-gold font-bold hover:underline">
              Log in instead
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
