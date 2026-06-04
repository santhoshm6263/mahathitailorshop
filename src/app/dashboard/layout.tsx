'use client';

// src/app/dashboard/layout.tsx
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBoutique } from '../providers';
import { User, Ruler, ClipboardList, Calendar, Heart, ArrowLeft, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser } = useBoutique();
  const pathname = usePathname();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    // If loading finished and user is not logged in, redirect to login
    if (!currentUser) {
      // Small timeout to allow state hydration
      const t = setTimeout(() => {
        if (!currentUser) router.push('/login');
      }, 500);
      return () => clearTimeout(t);
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FDFBF7] text-center">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#5C061E]/30 border-t-maroon animate-spin mb-4"></div>
        <h3 className="font-playfair text-lg text-maroon">Checking Active Session...</h3>
        <p className="font-poppins text-xs text-maroon/40 mt-1">Please log in to access your customer profile.</p>
        <Link href="/login" className="font-poppins text-xs uppercase tracking-widest font-bold text-gold bg-maroon px-6 py-2.5 rounded-full border border-gold hover:bg-gold hover:text-maroon transition-all mt-4">
          Go to Login
        </Link>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'My Profile', path: '/dashboard', icon: User },
    { label: 'Sizing Guide', path: '/dashboard/measurements', icon: Ruler },
    { label: 'Order History', path: '/dashboard/orders', icon: ClipboardList },
    { label: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
    { label: 'Saved Wishlist', path: '/dashboard/wishlist', icon: Heart }
  ];

  return (
    <section className="py-24 bg-[#FFF8F0]/10 min-h-screen pt-[120px] text-maroon animate-fade-in">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:w-1/4 bg-white rounded-3xl p-6 border border-maroon/5 shadow-luxury flex flex-col justify-between h-fit lg:sticky lg:top-[120px]">
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-maroon/5 text-center sm:text-left">
                <h4 className="font-playfair text-lg font-bold">{currentUser.name}</h4>
                <span className="font-poppins text-[9px] uppercase tracking-wider text-gold font-bold">Client Account</span>
              </div>

              <nav className="flex flex-col space-y-2">
                {sidebarLinks.map(link => {
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
                <span>Log Out Session</span>
              </button>
            </div>

          </div>

          {/* Right Dashboard Content */}
          <div className="lg:w-3/4 flex-grow">
            {children}
          </div>

        </div>

      </div>
    </section>
  );
}
