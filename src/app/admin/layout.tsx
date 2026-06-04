'use client';

// src/app/admin/layout.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { 
  BarChart3, Scissors, Calendar, ShoppingBag, 
  Users, ArrowLeft, LogOut, ShieldCheck 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useBoutique();
  const pathname = usePathname();
  const router = useRouter();

  // Protect Admin route
  useEffect(() => {
    if (!currentUser) {
      const t = setTimeout(() => {
        if (!currentUser) router.push('/login');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] text-center">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#5C061E]/30 border-t-maroon animate-spin mb-4"></div>
        <h3 className="font-playfair text-lg text-maroon">Checking Authorization...</h3>
        <p className="font-poppins text-xs text-maroon/40 mt-1">Please wait while we verify your administrator credentials.</p>
      </div>
    );
  }

  // Check if role is admin. If not, show Unauthorized page inside the frame
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-red-50 border border-red-200 text-red-800 rounded-full flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-playfair text-2xl font-bold text-maroon">Access Restricted</h2>
          <p className="font-poppins text-xs text-maroon/60 leading-relaxed">
            You do not have the required administrative permissions to access the boutique control console. Please contact the administrator or log in with authorized credentials.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link 
            href="/dashboard" 
            className="flex-1 font-poppins text-[10px] uppercase tracking-widest font-bold bg-maroon text-gold px-6 py-3 rounded-full border border-gold hover:bg-gold hover:text-maroon text-center transition-all duration-300"
          >
            My Profile
          </Link>
          <button 
            onClick={() => { setCurrentUser(null); router.push('/login'); }}
            className="flex-1 font-poppins text-[10px] uppercase tracking-widest font-bold bg-white text-maroon px-6 py-3 rounded-full border border-maroon/20 hover:bg-maroon/5 text-center transition-all duration-300 cursor-pointer"
          >
            Switch Account
          </button>
        </div>
      </div>
    );
  }

  const adminLinks = [
    { label: 'Analytics Panel', path: '/admin', icon: BarChart3 },
    { label: 'Order Stitching', path: '/admin/orders', icon: Scissors },
    { label: 'Appointments list', path: '/admin/appointments', icon: Calendar },
    { label: 'Product Catalog', path: '/admin/products', icon: ShoppingBag },
    { label: 'Client Database', path: '/admin/customers', icon: Users }
  ];

  return (
    <section className="py-24 bg-[#FFF8F0]/15 min-h-screen pt-[120px] text-maroon animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Admin Navigation Sidebar */}
          <div className="lg:w-1/4 bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury flex flex-col justify-between h-fit lg:sticky lg:top-[120px]">
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-maroon/5 text-center sm:text-left">
                <h4 className="font-playfair text-lg font-bold text-maroon flex items-center justify-center sm:justify-start space-x-2">
                  <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
                  <span>Couture Console</span>
                </h4>
                <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold block mt-1">
                  Atelier Executive Portal
                </span>
              </div>

              <nav className="flex flex-col space-y-2">
                {adminLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-poppins text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-maroon text-gold shadow-luxury'
                          : 'text-maroon/80 hover:bg-gold/10 hover:text-gold'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

            </div>

            <div className="border-t border-maroon/5 pt-6 mt-8 space-y-4">
              <Link href="/shop" className="font-poppins text-[10px] uppercase font-bold text-gold flex items-center space-x-1 hover:underline pl-4">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shop</span>
              </Link>
              <button 
                onClick={() => { setCurrentUser(null); router.push('/login'); }}
                className="w-full text-left font-poppins text-[10px] uppercase tracking-wider font-bold text-red-700 hover:text-red-950 flex items-center space-x-2 pl-4 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Portal</span>
              </button>
            </div>

          </div>

          {/* Right Dashboard Admin Views */}
          <div className="lg:w-3/4 flex-grow">
            {children}
          </div>

        </div>

      </div>
    </section>
  );
}
