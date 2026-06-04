'use client';

// src/app/AppShell.tsx
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '../widgets/Navbar';
import { Footer } from '../widgets/Footer';
import { CartDrawer } from '../features/CartDrawer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Conditionally show Navbar */}
      {!isAdmin && !isAuth && (
        <Navbar onCartOpen={() => setIsCartOpen(true)} />
      )}

      {/* Main content body */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Conditionally show Footer */}
      {!isAdmin && !isAuth && (
        <Footer />
      )}

      {/* Dynamic Slide-out Cart Bag */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
export default AppShell;
