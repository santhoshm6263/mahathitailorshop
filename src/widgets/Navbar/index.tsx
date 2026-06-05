'use client';

// src/widgets/Navbar/index.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBoutique } from '../../app/providers';
import { Menu, X, MessageCircle, ShoppingBag, Heart, User, LogOut } from 'lucide-react';

interface NavbarProps {
  onCartOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartOpen }) => {
  const { currentUser, setCurrentUser, cart, wishlist } = useBoutique();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Aari Work', path: '/aari-work' },
    { label: 'Custom Tailoring', path: '/custom-tailoring' },
    { label: 'Shop', path: '/shop' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello Mahathi Tailor Shop! I would like to enquire about designer blouse stitching and Aari embroidery services.");
    window.open(`https://wa.me/919347001303?text=${msg}`, '_blank');
  };

  const isDarkBg = isScrolled || pathname !== '/';

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
      isScrolled ? 'glassmorphism shadow-luxury py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full border border-[#D4AF37]/40 transition-all duration-500 group-hover:scale-105 group-hover:border-[#D4AF37] group-hover:shadow-gold">
            <div className="absolute inset-1 rounded-full border border-dashed border-[#D4AF37]/30"></div>
            <span className="font-playfair text-xl text-[#D4AF37] font-bold">M</span>
          </div>
          <div>
            <span className="font-playfair text-lg sm:text-xl font-semibold tracking-wide text-white block transition-colors duration-300 group-hover:text-gold">
              Mahathi Tailor Shop
            </span>
            <span className="font-poppins text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/80 block -mt-1">
              Luxury Boutique
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-8">
          {navLinks.map(link => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`font-poppins text-xs uppercase tracking-widest transition-colors duration-300 ${
                  isActive
                    ? 'text-gold font-medium border-b border-gold pb-1'
                    : 'text-white/80 hover:text-gold luxury-link'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* WhatsApp Action */}
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center p-2.5 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Cart Drawer Trigger */}
          <button 
            onClick={onCartOpen}
            className="flex items-center justify-center p-2.5 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 transition-all duration-300 relative cursor-pointer"
            title="View Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#5C061E] font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-[#3D0210]">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Wishlist Link */}
          <Link 
            href="/dashboard/wishlist"
            className="flex items-center justify-center p-2.5 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 transition-all duration-300 relative"
            title="My Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#5C061E] font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-[#3D0210]">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User Auth Link */}
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <Link 
                href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                className="font-poppins text-xs uppercase tracking-widest font-semibold text-gold bg-gold/10 border border-gold/30 hover:bg-gold/25 px-4 py-2.5 rounded-full transition-all duration-300"
              >
                {currentUser.role === 'admin' ? 'Admin Panel' : 'My Account'}
              </Link>
              <button 
                onClick={() => setCurrentUser(null)}
                className="flex items-center justify-center text-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="font-poppins text-xs uppercase tracking-widest text-white hover:text-gold transition-colors duration-300 px-3 py-2"
            >
              Login
            </Link>
          )}

          {/* Appointment Booking Trigger */}
          <Link 
            href="/booking"
            className="font-poppins text-xs uppercase tracking-widest font-bold btn-gold-glow px-6 py-3 rounded-full border border-gold"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="xl:hidden text-gold hover:text-white p-2 focus:outline-none cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[70px] bg-[#0F0F12]/95 backdrop-blur-lg z-30 xl:hidden animate-fade-in flex flex-col justify-between p-8 border-t border-white/10">
          <nav className="flex flex-col space-y-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left font-playfair text-2xl tracking-wide ${
                  pathname === link.path ? 'text-gold' : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col space-y-4 pt-8 border-t border-[#D4AF37]/10">
            <Link 
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center font-poppins text-sm uppercase tracking-widest font-semibold bg-[#D4AF37] text-maroon py-3 rounded-full transition-colors duration-300"
            >
              Book Appointment
            </Link>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={handleWhatsApp}
                className="flex items-center space-x-2 text-gold font-poppins text-xs uppercase tracking-wider cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Consult</span>
              </button>

              {currentUser ? (
                <button 
                  onClick={() => { setCurrentUser(null); setIsMobileMenuOpen(false); }}
                  className="text-white/60 hover:text-white text-xs font-poppins underline decoration-gold/40 cursor-pointer"
                >
                  Logout ({currentUser.name})
                </button>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-gold font-poppins text-xs uppercase tracking-widest font-semibold"
                >
                  Client Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
