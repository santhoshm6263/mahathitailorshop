'use client';

// src/app/login/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { supabase } from '../../shared/api/supabase';
import { BoutiqueDB } from '../../shared/api/db';
import { Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { setCurrentUser } = useBoutique();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all credentials.');
      setLoading(false);
      return;
    }

    // 1. Supabase real Auth Integration
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data && data.user) {
          // Fetch corresponding user profile
          const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (pError) throw pError;

          if (profile) {
            if (isAdminMode && profile.role !== 'admin') {
              await supabase.auth.signOut();
              setErrorMsg('Access denied. This profile is not authorized as Admin.');
              setLoading(false);
              return;
            }

            const activeUser = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              role: profile.role,
              joined_date: profile.joined_date,
              notes: profile.notes,
              measurements: {
                chest: profile.chest || 0,
                waist: profile.waist || 0,
                blouse_length: profile.blouse_length || 0,
                shoulder: profile.shoulder || 0,
                front_neck: profile.front_neck || 0,
                back_neck: profile.back_neck || 0,
                sleeve_length: profile.sleeve_length || 0,
                sleeve_round: profile.sleeve_round || 0,
                arm_hole: profile.arm_hole || 0,
              }
            };
            
            setCurrentUser(activeUser);
            router.push(profile.role === 'admin' ? '/admin' : '/dashboard');
            return;
          }
        }
      } catch (err: any) {
        console.error('Supabase auth signin error:', err);
        setErrorMsg(err.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }
    }

    // 2. Simulated LocalStorage Fallback (For Demo / Sandbox)
    setTimeout(async () => {
      // Mock Admin bypass credentials
      if (isAdminMode && email === 'admin@mahathi.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin-usr',
          name: 'Ammulu Jeeva',
          email: 'admin@mahathi.com',
          role: 'admin' as const,
          joined_date: '2020-05-01'
        };
        setCurrentUser(adminUser);
        router.push('/admin');
        setLoading(false);
        return;
      }

      if (isAdminMode) {
        setErrorMsg('Invalid simulated administrator credentials. (Hint: admin@mahathi.com / admin123)');
        setLoading(false);
        return;
      }

      // Check customer database in localStorage
      const customers = await BoutiqueDB.getCustomers();
      const match = customers.find(c => c.email.toLowerCase() === email.toLowerCase());

      if (match && password === 'client123') {
        setCurrentUser(match);
        router.push('/dashboard');
      } else if (email && password === 'client123') {
        const newCust = {
          id: 'cust-' + Math.floor(Math.random() * 900 + 100),
          name: email.split('@')[0],
          email,
          phone: '9999999999',
          role: 'customer' as const,
          joined_date: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(newCust);
        router.push('/dashboard');
      } else {
        setErrorMsg('Invalid credentials. (Hint: Use client123 as password for simulated login)');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFF8F0]/30 px-6 py-12 relative overflow-hidden">
      
      {/* Visual background details */}
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
            {isAdminMode ? 'Secure Admin Login' : 'Atelier Client Desk'}
          </h2>
          <p className="font-poppins text-xs text-maroon/50 mt-1">
            {isAdminMode ? 'Enter credentials to manage boutique logs' : 'Sign in to access measurements & coordinates'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-poppins p-3 rounded-xl flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-2">Email Address *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Mail className="w-4 h-4" /></span>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs px-3 py-3 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[9px] uppercase tracking-widest text-maroon font-semibold mb-2">Password *</label>
            <div className="flex border border-maroon/10 rounded-xl overflow-hidden bg-cream/30 focus-within:border-gold">
              <span className="flex items-center pl-4 text-maroon/40"><Lock className="w-4 h-4" /></span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs px-3 py-3 focus:outline-none w-full text-maroon" 
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-poppins text-xs uppercase tracking-widest font-bold bg-maroon hover:bg-gold text-gold hover:text-maroon py-3.5 rounded-full border border-maroon hover:border-gold transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Session...' : 'Authenticate Account'}
          </button>
        </form>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#5C061E]/5 text-center space-y-3 font-poppins text-xs text-maroon/50">
          {!isAdminMode && (
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-gold font-bold hover:underline">
                Create one now
              </Link>
            </p>
          )}

          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setErrorMsg('');
            }}
            className="text-[10px] uppercase font-bold text-gold hover:text-maroon transition-colors tracking-widest block mx-auto cursor-pointer"
          >
            {isAdminMode ? '← Back to Client Desk' : '🔒 Switch to Admin Login'}
          </button>
        </div>

      </div>
    </section>
  );
}
